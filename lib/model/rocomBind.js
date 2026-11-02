import { requestWeGame, resolveActiveWeGameCredential } from "./wegameAccount.js";
import { readRuntimeStore, writeRuntimeStore } from "./runtimeStore.js";
import { storeKeys } from "../constants/storeKeys.js";

// src/model/rocomBind.ts
const storeKey = storeKeys.rocom.bindUid;
const uidStoreFileName = "rocom-bind-uid.json";
function normalizeText(value) {
	return String(value ?? "").trim();
}
function parseBindUidArgs(rawArgs) {
	const uid = normalizeText(rawArgs);
	if (!uid) throw new Error("格式：+绑定UID <UID>\nUID 即角色资料中的 role.id");
	if (!/^\d+$/u.test(uid)) throw new Error("UID 必须为纯数字");
	return uid;
}
async function bindRocomUid(context, uid) {
	const data = await requestWeGame("/api/v1/games/rocom/uid/bind", {
		method: "POST",
		data: { uid },
		headers: {
			"X-User-Identifier": context.userIdentifier,
			"Content-Type": "application/json"
		}
	});
	const frameworkToken = normalizeText(data.frameworkToken);
	const binding = data.binding && typeof data.binding === "object" ? data.binding : {};
	const isPrimary = binding.is_primary === true;
	const source = normalizeText(binding.source);
	if (frameworkToken) {
		const store = await readRuntimeStore(storeKey, uidStoreFileName, { users: {} });
		store.users = store.users ?? {};
		store.users[context.userKey] = {
			uid,
			frameworkToken,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		await writeRuntimeStore(storeKey, uidStoreFileName, store).catch(() => void 0);
	}
	const lines = [
		"✅ UID 绑定成功！",
		`UID：${uid}`,
		isPrimary ? "状态：主账号（首次绑定）" : "状态：已绑定"
	];
	if (source) lines.push(`来源：${source}`);
	if (frameworkToken) lines.push("", "已生成凭证，后续 ingame 查询可直接使用。");
	return lines.join("\n");
}
/** 绑定 UID 兜底：从本地绑定记录里取 UID */
async function getBoundUid(context) {
	const entry = (await readRuntimeStore(storeKey, uidStoreFileName, { users: {} })).users?.[context.userKey];
	if (entry?.uid) return normalizeText(entry.uid);
	const { credential } = await resolveActiveWeGameCredential(context);
	return normalizeText(credential?.role?.id);
}
async function hasBindUidRecord(context) {
	const store = await readRuntimeStore(storeKey, uidStoreFileName, { users: {} });
	return Boolean(store.users?.[context.userKey]?.uid);
}

export { bindRocomUid, getBoundUid, hasBindUidRecord, parseBindUidArgs };