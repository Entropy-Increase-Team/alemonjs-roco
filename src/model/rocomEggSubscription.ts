/*
 * 说明：后端 payload 字段大量为 unknown，字符串兜底链刻意使用 ||（空字符串同样视为缺失），
 * 因此关闭 prefer-nullish-coalescing 检查。
 */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { storeKeys } from '@src/constants/storeKeys';
import { requestWeGame } from '@src/model/wegameAccount';
import { readRuntimeStore, writeRuntimeStore } from '@src/model/runtimeStore';
import { Format, MessageDirect } from 'alemonjs';

export const TARGET_GROUP = 'group';
export const TARGET_PRIVATE = 'private';

const MENTION_ALL_ALIASES = new Set(['@全体', '全体', '@所有人', 'at全体', 'at所有人']);

export type EggSubscription = {
  key: string;
  target_type: string;
  bot_id: string;
  group_id: string;
  user_id: string;
  target_uid: string;
  mention_all: boolean;
  last_egg_count: number;
  last_pushed_egg_count: number;
  last_push_time: string;
  last_check_time: string;
  updated_by: string;
  updated_at: string;
};

type EggSubscriptionStore = Record<string, Record<string, unknown>>;

const subscriptionStoreKey = storeKeys.rocom.eggSubscriptions;
const subscriptionStoreFileName = 'rocom-egg-subscriptions.json';

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeTimestampSeconds(value: unknown): number {
  const num = Number(value);

  if (!Number.isFinite(num) || num <= 0) {
    return 0;
  }

  if (num > 1e14) {
    return Math.floor(num / 1000000);
  }

  if (num > 1e11) {
    return Math.floor(num / 1000);
  }

  return Math.floor(num);
}

function formatRemaining(targetTime: unknown, now = Math.floor(Date.now() / 1000)): string {
  const target = normalizeTimestampSeconds(targetTime);

  if (!target) {
    return '未开始';
  }

  if (now >= target) {
    return '已完成';
  }

  const remain = Math.max(0, target - now);
  const days = Math.floor(remain / 86400);
  const hours = Math.floor((remain % 86400) / 3600);
  const minutes = Math.floor((remain % 3600) / 60);

  if (days > 0) {
    return `${days}天${hours}小时`;
  }

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }

  if (minutes > 0) {
    return `${minutes}分钟`;
  }

  return '即将完成';
}

export function buildEggSubscriptionKey(botId: string, targetId: string, targetType: string, uid: string): string {
  return `${normalizeText(botId) || 'bot'}:${targetType}:${normalizeText(targetId)}:${normalizeText(uid)}`;
}

function normalizeSubscription(key: string, payload: Record<string, unknown> = {}): EggSubscription {
  return {
    key,
    target_type: normalizeText(payload.target_type ?? payload.targetType) || TARGET_GROUP,
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
    updated_at: normalizeText(payload.updated_at ?? payload.updatedAt ?? new Date().toISOString())
  };
}

async function readAllSubscriptions(): Promise<Record<string, EggSubscription>> {
  const payload = await readRuntimeStore<EggSubscriptionStore>(subscriptionStoreKey, subscriptionStoreFileName, {});

  return Object.fromEntries(Object.entries(payload ?? {}).map(([key, value]) => [key, normalizeSubscription(key, value ?? {})]));
}

async function writeAllSubscriptions(payload: Record<string, EggSubscription>): Promise<void> {
  await writeRuntimeStore(subscriptionStoreKey, subscriptionStoreFileName, payload);
}

export async function upsertEggSubscription(key: string, payload: Record<string, unknown>): Promise<EggSubscription> {
  const all = await readAllSubscriptions();

  all[key] = normalizeSubscription(key, { ...(all[key] ?? {}), ...payload });
  await writeAllSubscriptions(all);

  return all[key];
}

export async function deleteEggSubscription(key: string): Promise<boolean> {
  const all = await readAllSubscriptions();

  if (!all[key]) {
    return false;
  }

  const { [key]: _removed, ...rest } = all;

  await writeAllSubscriptions(rest);

  return true;
}

export async function getEggSubscriptionsByTarget(botId: string, targetId: string, targetType: string): Promise<EggSubscription[]> {
  const all = await readAllSubscriptions();

  return Object.values(all).filter(
    sub => sub.bot_id === (normalizeText(botId) || 'bot') && sub.target_type === targetType && (sub.group_id || sub.user_id) === normalizeText(targetId)
  );
}

export function getAllEggSubscriptions(): Promise<Record<string, EggSubscription>> {
  return readAllSubscriptions();
}

export async function batchUpdateEggSubscriptions(updates: Array<{ key: string } & Partial<Omit<EggSubscription, 'key'>>>): Promise<void> {
  const all = await readAllSubscriptions();

  for (const update of updates) {
    const current = all[update.key];

    if (!current) {
      continue;
    }

    all[update.key] = normalizeSubscription(update.key, { ...current, ...update });
  }

  await writeAllSubscriptions(all);
}

export function isMentionAllToken(token: string): boolean {
  return MENTION_ALL_ALIASES.has(normalizeText(token).toLowerCase());
}

export type EggStatusPet = {
  petId: string;
  name: string;
  ready: boolean;
  remaining: string;
  predictedEggTime: number;
};

export type EggStatus = {
  readyCount: number;
  totalEggs: number;
  pets: EggStatusPet[];
};

function extractEggPet(item: Record<string, unknown> = {}, now = Math.floor(Date.now() / 1000)): EggStatusPet | null {
  const petInfo = item.home_pet_info && typeof item.home_pet_info === 'object' ? (item.home_pet_info as Record<string, unknown>) : item;
  const petId = petInfo.pet_cfg_id || petInfo.pet_id || item.pet_cfg_id || item.pet_id;
  const name = normalizeText(petInfo.name || petInfo.pet_name || item.name || item.pet_name);

  if (!toNumber(petId, 0) && !name) {
    return null;
  }

  const hasEgg = Boolean(item.have_egg ?? petInfo.have_egg);
  const predictedEggTime = normalizeTimestampSeconds(item.predicted_egg_time ?? petInfo.predicted_egg_time ?? item.egg_ready_time);
  const ready = hasEgg || (predictedEggTime > 0 && now >= predictedEggTime);

  return {
    petId: String(petId || ''),
    name: name || `精灵 ${petId || ''}`,
    ready,
    remaining: ready ? '' : predictedEggTime > 0 ? formatRemaining(predictedEggTime, now) : '未知',
    predictedEggTime: predictedEggTime || 0
  };
}

/** 从 home/eggs 响应中提取蛋状态（兼容多种字段名） */
export function extractEggStatus(payload: Record<string, unknown> = {}): EggStatus {
  const data = pickEggPayload(payload);
  const now = Math.floor(Date.now() / 1000);
  const eggLists = [data.eggs, data.egg_list, data.egg_info, data.home_eggs, data.home_egg_list, data.home_pets, data.pet_list].filter(
    (list): list is unknown[] => Array.isArray(list)
  );

  const pets: EggStatusPet[] = [];

  for (const list of eggLists) {
    for (const item of list) {
      const pet = extractEggPet(item && typeof item === 'object' ? (item as Record<string, unknown>) : {}, now);

      if (pet) {
        pets.push(pet);
      }
    }
  }

  const readyCount =
    pets.length > 0 ? pets.filter(pet => pet.ready).length : toNumber(data.ready_egg_count ?? data.readyEggCount ?? data.egg_ready_count ?? 0, 0);
  const totalEggs = pets.length > 0 ? pets.length : toNumber(data.total_egg_count ?? data.totalEggCount ?? data.egg_count ?? 0, 0);

  return { readyCount, totalEggs, pets };
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);

  return Number.isFinite(num) ? num : fallback;
}

function pickEggPayload(payload: Record<string, unknown> = {}): Record<string, unknown> {
  const dataRecord = payload.data as Record<string, unknown> | undefined;
  const resultRecord = payload.result as Record<string, unknown> | undefined;
  const candidates: Array<unknown> = [payload.data, payload.result, dataRecord?.data, resultRecord?.data, payload];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      return candidate as Record<string, unknown>;
    }
  }

  return {};
}

/** 查询指定 UID 家园的精灵蛋状态（轻量级接口） */
export async function fetchHomeEggs(
  uid: string,
  userIdentifier = '',
  options: { onQueued?: () => void | Promise<void> } = {}
): Promise<Record<string, unknown>> {
  let queuedNotified = false;

  const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/ingame/home/eggs', {
    method: 'GET',
    params: {
      uid,
      user_identifier: userIdentifier,
      wait_ms: '20000'
    },
    headers: { 'X-User-Identifier': userIdentifier }
  });

  // 内联等待后仍可能是异步任务，轮询直到出蛋状态数据
  let current: Record<string, unknown> = payload;
  const hasEggContent = (target: Record<string, unknown>) => ['eggs', 'egg_list', 'egg_info', 'home_eggs', 'home_egg_list', 'home_pets', 'pet_list', 'ready_egg_count', 'total_egg_count'].some(key => key in target);

  const pickPayload = (target: Record<string, unknown>) => {
    const candidates: Array<unknown> = [target.data, target.result, (target.data as Record<string, unknown>)?.data, target];

    for (const candidate of candidates) {
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
        return candidate as Record<string, unknown>;
      }
    }

    return target;
  };

  if (hasEggContent(pickPayload(current))) {
    return current;
  }

  const taskId = normalizeText(current.task_id ?? current.taskId);

  if (taskId) {
    if (!queuedNotified) {
      queuedNotified = true;
      await options.onQueued?.();
    }

    const startedAt = Date.now();
    const timeoutMs = 3 * 60 * 1000;
    const intervalMs = 5000;

    while (Date.now() - startedAt < timeoutMs) {
      const status = normalizeText(current.status).toLowerCase();

      if (['failed', 'error', 'timeout', 'cancelled', 'canceled'].includes(status)) {
        throw new Error(`Ingame 任务失败：${normalizeText(current.message || current.error || status) || status}`);
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));

      current = await requestWeGame<Record<string, unknown>>(`/api/v1/games/rocom/ingame/tasks/${encodeURIComponent(taskId)}`, {
        method: 'GET'
      });

      const inner = pickPayload(current);

      if (hasEggContent(inner)) {
        return current;
      }
    }

    throw new Error(`Ingame 任务等待超时：${taskId}`);
  }

  return current;
}

function buildEggStatusText(uid: string, eggStatus: EggStatus): string {
  const { readyCount, totalEggs, pets } = eggStatus;
  const lines = [`家园蛋状态 - UID ${uid}`, `可收蛋精灵：${readyCount} 只 / 共检测 ${totalEggs} 只`];

  if (pets.length > 0) {
    lines.push('');

    for (const pet of pets) {
      lines.push(`${pet.name}  ${pet.ready ? '✅ 可收蛋' : `⏳ ${pet.remaining}`}`);
    }
  }

  lines.push('');
  lines.push(`更新时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);

  return lines.join('\n');
}

/** 家园状态 <UID>：立即查询并返回文本 */
export async function queryRocomEggStatus(uid: string, userIdentifier = '', options: { onQueued?: () => void | Promise<void> } = {}): Promise<string> {
  const payload = await fetchHomeEggs(uid, userIdentifier, options);
  const eggStatus = extractEggStatus(payload);

  return buildEggStatusText(uid, eggStatus);
}

async function sendSubscriptionMessage(subscription: EggSubscription, lines: string[]): Promise<void> {
  const format = Format.create();
  const md = Format.createMarkdown();

  if (subscription.mention_all && subscription.target_type !== TARGET_PRIVATE) {
    md.addMention();
    md.addNewline();
  }

  md.addText(lines.join('\n'));
  format.addMarkdown(md);

  await MessageDirect.create().sendToChannel({
    SpaceId: subscription.target_type === TARGET_PRIVATE ? subscription.user_id : subscription.group_id,
    format
  });
}

/** 定时轮询所有家园蛋状态订阅，检测到新的可收蛋时推送通知 */
export async function checkRocomEggSubscriptions(): Promise<void> {
  try {
    const subscriptions = await getAllEggSubscriptions();
    const entries = Object.entries(subscriptions ?? {});

    if (entries.length === 0) {
      return;
    }

    // 按 UID 分组，避免对同一 UID 重复请求
    const uidMap = new Map<string, EggSubscription[]>();

    for (const [, sub] of entries) {
      const uid = normalizeText(sub?.target_uid);

      if (!uid) {
        continue;
      }

      if (!uidMap.has(uid)) {
        uidMap.set(uid, []);
      }

      uidMap.get(uid)!.push(sub);
    }

    const now = new Date().toISOString();
    const batchUpdates: Array<{ key: string } & Partial<EggSubscription>> = [];

    for (const [uid, subList] of uidMap) {
      let eggStatus: EggStatus | null = null;
      let fetchError = '';

      try {
        const requestOwner = normalizeText(subList.find(s => normalizeText(s?.updated_by))?.updated_by);
        const payload = await fetchHomeEggs(uid, requestOwner);

        eggStatus = extractEggStatus(payload);
      } catch (error) {
        fetchError = error instanceof Error ? error.message : String(error);
        logger.warn(`[rocom] 轮询 UID ${uid} 家园蛋状态失败：${fetchError}`);
      }

      for (const sub of subList) {
        if (fetchError || !eggStatus) {
          batchUpdates.push({ key: sub.key, last_check_time: now });
          continue;
        }

        const currentReady = eggStatus.readyCount;
        const lastPushed = sub.last_pushed_egg_count || 0;
        const hasNewEggs = currentReady > 0 && currentReady > lastPushed;

        if (hasNewEggs) {
          const readyPets = eggStatus.pets.filter(pet => pet.ready);
          const lines = [`🔔 UID ${sub.target_uid} 的家园有 ${currentReady} 只精灵可收蛋！`];

          if (readyPets.length > 0 && readyPets.length <= 10) {
            lines.push(readyPets.map(pet => pet.name).join('、'));
          }

          lines.push(`发送 +家园状态 ${sub.target_uid} 查看详情`);

          try {
            await sendSubscriptionMessage(sub, lines);
          } catch (error) {
            logger.warn(`[rocom] 家园蛋状态推送失败：${sub.key}`, error);
            batchUpdates.push({ key: sub.key, last_check_time: now });
            continue;
          }

          batchUpdates.push({
            key: sub.key,
            last_egg_count: currentReady,
            last_pushed_egg_count: currentReady,
            last_push_time: now,
            last_check_time: now
          });
        } else {
          batchUpdates.push({ key: sub.key, last_egg_count: currentReady, last_check_time: now });
        }
      }
    }

    await batchUpdateEggSubscriptions(batchUpdates);
  } catch (error) {
    logger.error(`[rocom] 检查家园蛋状态订阅失败：${error instanceof Error ? error.message : error}`);
  }
}

/** 读取蛋订阅轮询 cron 配置 */
export async function getEggSubscriptionCron(): Promise<string> {
  const { readRocomConfig } = await import('@src/model/wegameResource');
  const egg = ((await readRocomConfig()).egg as Record<string, unknown> | undefined) ?? {};
  const value = normalizeText(egg.subscription_cron);

  return value || '0 */30 * * * *';
}
