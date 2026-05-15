import { getRocomAccounts } from '@src/model/rocomAccount';
import { fetchRocomMerchantInfo } from '@src/model/rocomMerchant';
import { getRocomCommandPrefixes } from '@src/model/rocom';
import { getWeGameUserContext, requestWeGame, resolveActiveWeGameCredential } from '@src/model/wegameAccount';

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPrefixPattern(): string {
  return getRocomCommandPrefixes()
    .map(item => escapeRegExp(item))
    .join('|');
}

function extractUidByPattern(text: string, pattern: string): string {
  const matched = text.match(new RegExp(pattern, 'u'));

  return normalizeText(matched?.[1]);
}

function formatSearchValue(value: unknown): string {
  const text = normalizeText(value);

  return text || '未返回';
}

function normalizeTaskStatus(value: unknown): string {
  return normalizeText(value).toLowerCase();
}

function isCompletedPayload(payload: Record<string, unknown> | null | undefined): boolean {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return Array.isArray(payload.rows) || payload.home_info !== undefined || payload.friend_home_brief_info !== undefined;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function isIngameTaskPayload(payload: Record<string, unknown> | null | undefined): boolean {
  return Boolean(normalizeText(payload?.task_id ?? payload?.taskId));
}

function isPendingTaskStatus(status: string): boolean {
  return ['queued', 'pending', 'running', 'processing', 'accepted'].includes(status);
}

function isFailedTaskStatus(status: string): boolean {
  return ['failed', 'error', 'timeout', 'cancelled', 'canceled'].includes(status);
}

function getIngameTask(taskId: string): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>(`/api/v1/games/rocom/ingame/tasks/${encodeURIComponent(taskId)}`, {
    method: 'GET'
  });
}

async function resolveIngamePayload(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (isCompletedPayload(payload)) {
    return payload;
  }

  if (!isIngameTaskPayload(payload)) {
    return payload;
  }

  const taskId = normalizeText(payload.task_id ?? payload.taskId);
  const timeoutMs = 5 * 60 * 1000;
  const intervalMs = 3000;
  const startedAt = Date.now();
  let currentPayload: Record<string, unknown> = payload;
  let status = normalizeTaskStatus(payload.status);

  while (Date.now() - startedAt < timeoutMs) {
    if (isFailedTaskStatus(status)) {
      throw new Error(`Ingame 任务失败：${status}`);
    }

    if (!isPendingTaskStatus(status)) {
      break;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
    currentPayload = await getIngameTask(taskId);

    if (isCompletedPayload(currentPayload)) {
      return currentPayload;
    }

    const resultPayload = toRecord(currentPayload.result);

    if (resultPayload && isCompletedPayload(resultPayload)) {
      return resultPayload;
    }

    const dataPayload = toRecord(currentPayload.data);

    if (dataPayload && isCompletedPayload(dataPayload)) {
      return dataPayload;
    }

    status = normalizeTaskStatus(currentPayload.status);
  }

  if (isCompletedPayload(currentPayload)) {
    return currentPayload;
  }

  throw new Error(`Ingame 任务等待超时：${taskId}`);
}

async function resolveRocomUid(
  event: { current: { UserId?: string; Platform?: string; BotId?: string; MessageText?: string } },
  pattern: string,
  emptyMessage: string
) {
  const text = event.current.MessageText ?? '';
  let uid = extractUidByPattern(text, pattern);

  if (!uid) {
    const data = await getRocomAccounts(event);

    uid = normalizeText(data.accounts.find(item => item.isPrimary)?.roleId ?? data.accounts[0]?.roleId);
  }

  if (!uid) {
    throw new Error(emptyMessage);
  }

  return uid;
}

function formatDateTime(value: unknown): string {
  const text = normalizeText(value);

  if (!text) {
    return '未返回';
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  const pad = (num: number) => String(num).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getBattleResult(value: unknown): { label: string; kind: 'win' | 'lose' } {
  const numeric = Number(value);

  if (numeric === 0) {
    return {
      label: '胜利',
      kind: 'win'
    };
  }

  return {
    label: '失败',
    kind: 'lose'
  };
}

export async function getRocomHome(event: { current: { Platform?: string; BotId?: string; UserId?: string; MessageText?: string } }) {
  const context = getWeGameUserContext(event);
  const uid = await resolveRocomUid(
    event,
    `^(?:${buildPrefixPattern()})\\s*(?:家园|home|刷新家园|rehome)(?:\\s*(\\d+))?$`,
    '未提供 UID，且当前没有可用的已绑定洛克角色。请先发送 +账号列表 或 +家园 <UID>'
  );

  const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/ingame/home/info', {
    method: 'GET',
    params: {
      user_identifier: context.userIdentifier,
      uid,
      wait_ms: '20000'
    }
  });
  const resolved = await resolveIngamePayload(payload);
  const homeInfo = (resolved.home_info as Record<string, unknown> | undefined) ?? resolved;
  const brief =
    (homeInfo.friend_home_brief_info as Record<string, unknown> | undefined) ?? (homeInfo.home_brief_info as Record<string, unknown> | undefined) ?? homeInfo;

  return {
    uid,
    homeName: formatSearchValue(brief.home_name ?? brief.name),
    roomLevel: formatSearchValue(brief.room_level),
    homeLevel: formatSearchValue(brief.home_level),
    homeExperience: formatSearchValue(brief.home_experience),
    comfortLevel: formatSearchValue(brief.home_comfort_level)
  };
}

export function buildRocomHomeText(payload: {
  uid: string;
  homeName: string;
  roomLevel: string;
  homeLevel: string;
  homeExperience: string;
  comfortLevel: string;
}): string {
  return [
    '洛克家园',
    `UID：${payload.uid}`,
    `名称：${payload.homeName}`,
    `房间等级：${payload.roomLevel}`,
    `家园等级：${payload.homeLevel}`,
    `家园经验：${payload.homeExperience}`,
    `舒适度：${payload.comfortLevel}`
  ].join('\n');
}

function resolveBattleZone(loginType?: string): string | undefined {
  const normalized = normalizeText(loginType).toLowerCase();

  if (normalized === 'qq') {
    return '0';
  }
  if (normalized === 'wechat') {
    return '1';
  }

  return undefined;
}

export async function getRocomRecord(event: { current: { Platform?: string; BotId?: string; UserId?: string; MessageText?: string } }) {
  const context = getWeGameUserContext(event);
  const { credential } = await resolveActiveWeGameCredential(context);

  if (!credential?.frameworkToken) {
    throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
  }

  const text = event.current.MessageText ?? '';
  const matched = text.match(new RegExp(`^(?:${buildPrefixPattern()})\\s*(?:大赛战绩|战绩)(?:\\s+(\\d+))?$`, 'u'));
  const pageNo = Number(normalizeText(matched?.[1]) || '1');

  if (!Number.isFinite(pageNo) || pageNo < 1) {
    throw new Error('页码必须大于等于 1');
  }

  let afterTime = '';
  let currentPage = 1;
  let battles: Array<Record<string, unknown>> = [];
  let finish = false;
  const zone = resolveBattleZone(credential.loginType);

  while (currentPage <= pageNo) {
    const params: Record<string, string> = {
      page_size: '4'
    };

    if (zone !== undefined) {
      params.zone = zone;
    }

    if (afterTime) {
      params.after_time = afterTime;
    }

    const data = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/battle/list', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      },
      params
    });

    battles = Array.isArray(data.battles) ? (data.battles as Array<Record<string, unknown>>) : [];
    finish = data.finish === true;

    if (currentPage === pageNo) {
      break;
    }

    if (finish || battles.length === 0) {
      throw new Error(`当前最多只有 ${currentPage} 页战绩`);
    }

    afterTime = normalizeText(battles[battles.length - 1]?.battle_time);
    currentPage += 1;
  }

  return {
    pageNo,
    battles
  };
}

export function buildRocomRecordText(payload: { pageNo: number; battles: Array<Record<string, unknown>> }): string {
  if (payload.battles.length === 0) {
    return '暂无大赛战绩数据';
  }

  const lines = ['闪耀大赛战绩', `页码：${payload.pageNo}`, ''];

  payload.battles.forEach((battle, index) => {
    const result = getBattleResult(battle.result);

    lines.push(`${index + 1}. ${formatSearchValue(battle.nickname)} vs ${formatSearchValue(battle.enemy_nickname)}`);
    lines.push(`时间：${formatDateTime(battle.battle_time)}`);
    lines.push(`结果：${result.label}`);
    lines.push('');
  });

  return lines.join('\n').trim();
}

export function buildRocomRecordCardData(payload: { pageNo: number; battles: Array<Record<string, unknown>> }): {
  pageNo: number;
  battles: Array<{
    leftName: string;
    rightName: string;
    resultLabel: string;
    resultKind: 'win' | 'lose';
    time: string;
    date: string;
  }>;
} {
  return {
    pageNo: payload.pageNo,
    battles: payload.battles.map(battle => {
      const result = getBattleResult(battle.result);
      const formatted = formatDateTime(battle.battle_time);
      const [date = '未返回', time = '未返回'] = formatted.split(' ');

      return {
        leftName: formatSearchValue(battle.nickname),
        rightName: formatSearchValue(battle.enemy_nickname),
        resultLabel: result.label,
        resultKind: result.kind,
        time,
        date
      };
    })
  };
}

export function parseRocomSizeArgs(rawText: string): { diameter: string; weight: string } {
  const raw = normalizeText(rawText);
  const tokens = raw.split(/\s+/u).filter(Boolean);

  if (tokens.length !== 2) {
    throw new Error('格式：+尺寸查询 <直径米> <重量千克>');
  }

  return {
    diameter: tokens[0],
    weight: tokens[1]
  };
}

export async function getRocomSizeQuery(rawText: string) {
  const args = parseRocomSizeArgs(rawText);
  const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/pet/size-query', {
    method: 'GET',
    params: {
      diameter: args.diameter,
      weight: args.weight
    }
  });

  return {
    args,
    payload
  };
}

export function buildRocomSizeText(result: { args: { diameter: string; weight: string }; payload: Record<string, unknown> }): string {
  return ['精灵尺寸查询', `直径：${result.args.diameter} m`, `重量：${result.args.weight} kg`, JSON.stringify(result.payload, null, 2)].join('\n');
}

export function getRocomMerchantInfo() {
  return fetchRocomMerchantInfo(false);
}
