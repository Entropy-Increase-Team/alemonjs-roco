import { storeKeys } from "../constants/storeKeys.js";
import { requestWeGame } from "./wegameAccount.js";
import { readRuntimeStore, writeRuntimeStore } from "./runtimeStore.js";
import { Format, MessageDirect } from "alemonjs";

// src/model/rocomEggSubscription.ts
const TARGET_GROUP = "group";
const TARGET_PRIVATE = "private";
const MENTION_ALL_ALIASES = /* @__PURE__ */ new Set([
	"@全体",
	"全体",
	"@所有人",
	"at全体",
	"at所有人"
]);
const subscriptionStoreKey = storeKeys.rocom.eggSubscriptions;
const subscriptionStoreFileName = "rocom-egg-subscriptions.json";
function normalizeText(value) {
	return String(value ?? "").trim();
}
function normalizeTimestampSeconds(value) {
	const num = Number(value);
	if (!Number.isFinite(num) || num <= 0) return 0;
	if (num > 0x5af3107a4000) return Math.floor(num / 1e6);
	if (num > 1e11) return Math.floor(num / 1e3);
	return Math.floor(num);
}
function formatRemaining(targetTime, now = Math.floor(Date.now() / 1e3)) {
	const target = normalizeTimestampSeconds(targetTime);
	if (!target) return "未开始";
	if (now >= target) return "已完成";
	const remain = Math.max(0, target - now);
	const days = Math.floor(remain / 86400);
	const hours = Math.floor(remain % 86400 / 3600);
	const minutes = Math.floor(remain % 3600 / 60);
	if (days > 0) return `${days}天${hours}小时`;
	if (hours > 0) return `${hours}小时${minutes}分钟`;
	if (minutes > 0) return `${minutes}分钟`;
	return "即将完成";
}
function buildEggSubscriptionKey(botId, targetId, targetType, uid) {
	return `${normalizeText(botId) || "bot"}:${targetType}:${normalizeText(targetId)}:${normalizeText(uid)}`;
}
function normalizeSubscription(key, payload = {}) {
	return {
		key,
		target_type: normalizeText(payload.target_type ?? payload.targetType) || "group",
		bot_id: normalizeText(payload.bot_id ?? payload.botId),
		group_id: normalizeText(payload.group_id ?? payload.groupId),
		user_id: normalizeText(payload.user_id ?? payload.userId),
		target_uid: normalizeText(payload.target_uid ?? payload.targetUid),
		mention_all: payload.mention_all === true || payload.mentionAll === true,
		last_egg_count: Number(payload.last_egg_count ?? payload.lastEggCount) || 0,
		last_pushed_egg_count: Number(payload.last_pushed_egg_count ?? payload.lastPushedEggCount) || 0,
		last_push_time: normalizeText(payload.last_push_time ?? payload.lastPushTime),
		last_check_time: normalizeText(payload.last_check_time ?? payload.lastCheckTime),
		updated_by: normalizeText(payload.updated_by ?? payload.updatedBy),
		updated_at: normalizeText(payload.updated_at ?? payload.updatedAt ?? (/* @__PURE__ */ new Date()).toISOString())
	};
}
async function readAllSubscriptions() {
	const payload = await readRuntimeStore(subscriptionStoreKey, subscriptionStoreFileName, {});
	return Object.fromEntries(Object.entries(payload ?? {}).map(([key, value]) => [key, normalizeSubscription(key, value ?? {})]));
}
async function writeAllSubscriptions(payload) {
	await writeRuntimeStore(subscriptionStoreKey, subscriptionStoreFileName, payload);
}
async function upsertEggSubscription(key, payload) {
	const all = await readAllSubscriptions();
	all[key] = normalizeSubscription(key, {
		...all[key] ?? {},
		...payload
	});
	await writeAllSubscriptions(all);
	return all[key];
}
async function deleteEggSubscription(key) {
	const all = await readAllSubscriptions();
	if (!all[key]) return false;
	const { [key]: _removed, ...rest } = all;
	await writeAllSubscriptions(rest);
	return true;
}
async function getEggSubscriptionsByTarget(botId, targetId, targetType) {
	const all = await readAllSubscriptions();
	return Object.values(all).filter((sub) => sub.bot_id === (normalizeText(botId) || "bot") && sub.target_type === targetType && (sub.group_id || sub.user_id) === normalizeText(targetId));
}
function getAllEggSubscriptions() {
	return readAllSubscriptions();
}
async function batchUpdateEggSubscriptions(updates) {
	const all = await readAllSubscriptions();
	for (const update of updates) {
		const current = all[update.key];
		if (!current) continue;
		all[update.key] = normalizeSubscription(update.key, {
			...current,
			...update
		});
	}
	await writeAllSubscriptions(all);
}
function isMentionAllToken(token) {
	return MENTION_ALL_ALIASES.has(normalizeText(token).toLowerCase());
}
function extractEggPet(item = {}, now = Math.floor(Date.now() / 1e3)) {
	const petInfo = item.home_pet_info && typeof item.home_pet_info === "object" ? item.home_pet_info : item;
	const petId = petInfo.pet_cfg_id || petInfo.pet_id || item.pet_cfg_id || item.pet_id;
	const name = normalizeText(petInfo.name || petInfo.pet_name || item.name || item.pet_name);
	if (!toNumber(petId, 0) && !name) return null;
	const hasEgg = Boolean(item.have_egg ?? petInfo.have_egg);
	const predictedEggTime = normalizeTimestampSeconds(item.predicted_egg_time ?? petInfo.predicted_egg_time ?? item.egg_ready_time);
	const ready = hasEgg || predictedEggTime > 0 && now >= predictedEggTime;
	return {
		petId: String(petId || ""),
		name: name || `精灵 ${petId || ""}`,
		ready,
		remaining: ready ? "" : predictedEggTime > 0 ? formatRemaining(predictedEggTime, now) : "未知",
		predictedEggTime: predictedEggTime || 0
	};
}
/** 从 home/eggs 响应中提取蛋状态（兼容多种字段名） */
function extractEggStatus(payload = {}) {
	const data = pickEggPayload(payload);
	const now = Math.floor(Date.now() / 1e3);
	const eggLists = [
		data.eggs,
		data.egg_list,
		data.egg_info,
		data.home_eggs,
		data.home_egg_list,
		data.home_pets,
		data.pet_list
	].filter((list) => Array.isArray(list));
	const pets = [];
	for (const list of eggLists) for (const item of list) {
		const pet = extractEggPet(item && typeof item === "object" ? item : {}, now);
		if (pet) pets.push(pet);
	}
	return {
		readyCount: pets.length > 0 ? pets.filter((pet) => pet.ready).length : toNumber(data.ready_egg_count ?? data.readyEggCount ?? data.egg_ready_count ?? 0, 0),
		totalEggs: pets.length > 0 ? pets.length : toNumber(data.total_egg_count ?? data.totalEggCount ?? data.egg_count ?? 0, 0),
		pets
	};
}
function toNumber(value, fallback = 0) {
	const num = Number(value);
	return Number.isFinite(num) ? num : fallback;
}
function pickEggPayload(payload = {}) {
	const dataRecord = payload.data;
	const resultRecord = payload.result;
	const candidates = [
		payload.data,
		payload.result,
		dataRecord?.data,
		resultRecord?.data,
		payload
	];
	for (const candidate of candidates) if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) return candidate;
	return {};
}
/** 查询指定 UID 家园的精灵蛋状态（轻量级接口） */
async function fetchHomeEggs(uid, userIdentifier = "", options = {}) {
	let queuedNotified = false;
	let current = await requestWeGame("/api/v1/games/rocom/ingame/home/eggs", {
		method: "GET",
		params: {
			uid,
			user_identifier: userIdentifier,
			wait_ms: "20000"
		},
		headers: { "X-User-Identifier": userIdentifier }
	});
	const hasEggContent = (target) => [
		"eggs",
		"egg_list",
		"egg_info",
		"home_eggs",
		"home_egg_list",
		"home_pets",
		"pet_list",
		"ready_egg_count",
		"total_egg_count"
	].some((key) => key in target);
	const pickPayload = (target) => {
		const candidates = [
			target.data,
			target.result,
			target.data?.data,
			target
		];
		for (const candidate of candidates) if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) return candidate;
		return target;
	};
	if (hasEggContent(pickPayload(current))) return current;
	const taskId = normalizeText(current.task_id ?? current.taskId);
	if (taskId) {
		if (!queuedNotified) {
			queuedNotified = true;
			await options.onQueued?.();
		}
		const startedAt = Date.now();
		const timeoutMs = 18e4;
		const intervalMs = 5e3;
		while (Date.now() - startedAt < timeoutMs) {
			const status = normalizeText(current.status).toLowerCase();
			if ([
				"failed",
				"error",
				"timeout",
				"cancelled",
				"canceled"
			].includes(status)) throw new Error(`Ingame 任务失败：${normalizeText(current.message || current.error || status) || status}`);
			await new Promise((resolve) => setTimeout(resolve, intervalMs));
			current = await requestWeGame(`/api/v1/games/rocom/ingame/tasks/${encodeURIComponent(taskId)}`, { method: "GET" });
			if (hasEggContent(pickPayload(current))) return current;
		}
		throw new Error(`Ingame 任务等待超时：${taskId}`);
	}
	return current;
}
function buildEggStatusText(uid, eggStatus) {
	const { readyCount, totalEggs, pets } = eggStatus;
	const lines = [`家园蛋状态 - UID ${uid}`, `可收蛋精灵：${readyCount} 只 / 共检测 ${totalEggs} 只`];
	if (pets.length > 0) {
		lines.push("");
		for (const pet of pets) lines.push(`${pet.name}  ${pet.ready ? "✅ 可收蛋" : `⏳ ${pet.remaining}`}`);
	}
	lines.push("");
	lines.push(`更新时间：${(/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`);
	return lines.join("\n");
}
/** 家园状态 <UID>：立即查询并返回文本 */
async function queryRocomEggStatus(uid, userIdentifier = "", options = {}) {
	return buildEggStatusText(uid, extractEggStatus(await fetchHomeEggs(uid, userIdentifier, options)));
}
async function sendSubscriptionMessage(subscription, lines) {
	const format = Format.create();
	const md = Format.createMarkdown();
	if (subscription.mention_all && subscription.target_type !== "private") {
		md.addMention();
		md.addNewline();
	}
	md.addText(lines.join("\n"));
	format.addMarkdown(md);
	await MessageDirect.create().sendToChannel({
		SpaceId: subscription.target_type === "private" ? subscription.user_id : subscription.group_id,
		format
	});
}
/** 定时轮询所有家园蛋状态订阅，检测到新的可收蛋时推送通知 */
async function checkRocomEggSubscriptions() {
	try {
		const subscriptions = await getAllEggSubscriptions();
		const entries = Object.entries(subscriptions ?? {});
		if (entries.length === 0) return;
		const uidMap = /* @__PURE__ */ new Map();
		for (const [, sub] of entries) {
			const uid = normalizeText(sub?.target_uid);
			if (!uid) continue;
			if (!uidMap.has(uid)) uidMap.set(uid, []);
			uidMap.get(uid).push(sub);
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const batchUpdates = [];
		for (const [uid, subList] of uidMap) {
			let eggStatus = null;
			let fetchError = "";
			try {
				eggStatus = extractEggStatus(await fetchHomeEggs(uid, normalizeText(subList.find((s) => normalizeText(s?.updated_by))?.updated_by)));
			} catch (error) {
				fetchError = error instanceof Error ? error.message : String(error);
				logger.warn(`[rocom] 轮询 UID ${uid} 家园蛋状态失败：${fetchError}`);
			}
			for (const sub of subList) {
				if (fetchError || !eggStatus) {
					batchUpdates.push({
						key: sub.key,
						last_check_time: now
					});
					continue;
				}
				const currentReady = eggStatus.readyCount;
				const lastPushed = sub.last_pushed_egg_count || 0;
				if (currentReady > 0 && currentReady > lastPushed) {
					const readyPets = eggStatus.pets.filter((pet) => pet.ready);
					const lines = [`🔔 UID ${sub.target_uid} 的家园有 ${currentReady} 只精灵可收蛋！`];
					if (readyPets.length > 0 && readyPets.length <= 10) lines.push(readyPets.map((pet) => pet.name).join("、"));
					lines.push(`发送 +家园状态 ${sub.target_uid} 查看详情`);
					try {
						await sendSubscriptionMessage(sub, lines);
					} catch (error) {
						logger.warn(`[rocom] 家园蛋状态推送失败：${sub.key}`, error);
						batchUpdates.push({
							key: sub.key,
							last_check_time: now
						});
						continue;
					}
					batchUpdates.push({
						key: sub.key,
						last_egg_count: currentReady,
						last_pushed_egg_count: currentReady,
						last_push_time: now,
						last_check_time: now
					});
				} else batchUpdates.push({
					key: sub.key,
					last_egg_count: currentReady,
					last_check_time: now
				});
			}
		}
		await batchUpdateEggSubscriptions(batchUpdates);
	} catch (error) {
		logger.error(`[rocom] 检查家园蛋状态订阅失败：${error instanceof Error ? error.message : error}`);
	}
}
/** 读取蛋订阅轮询 cron 配置 */
async function getEggSubscriptionCron() {
	const { readRocomConfig } = await import("./wegameResource.js");
	return normalizeText(((await readRocomConfig()).egg ?? {}).subscription_cron) || "0 */30 * * * *";
}

export { TARGET_GROUP, TARGET_PRIVATE, batchUpdateEggSubscriptions, buildEggSubscriptionKey, checkRocomEggSubscriptions, deleteEggSubscription, extractEggStatus, fetchHomeEggs, getAllEggSubscriptions, getEggSubscriptionCron, getEggSubscriptionsByTarget, isMentionAllToken, queryRocomEggStatus, upsertEggSubscription };