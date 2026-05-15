import { getRocomCommandPrefixes } from '@src/model/rocom';
import { getRocomAccounts } from '@src/model/rocomAccount';
import { getWeGameRuntimeConfig, getWeGameUserContext, requestWeGame, resolveActiveWeGameCredential } from '@src/model/wegameAccount';

type RocomSearchRow = {
  field: string;
  label: string;
  value: string;
};

type IngameTaskPayload = {
  task_id?: string;
  taskId?: string;
  status?: string;
  rows?: unknown[];
  result?: Record<string, unknown>;
  data?: Record<string, unknown>;
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function formatLoginTypeToAccountType(loginType?: string): string | undefined {
  const normalized = normalizeText(loginType).toLowerCase();

  if (normalized === 'qq') {
    return '1';
  }
  if (normalized === 'wechat') {
    return '2';
  }

  return undefined;
}

function formatSearchValue(value: unknown): string {
  const text = normalizeText(value);

  return text || '未返回';
}

function buildRocomPrefixPattern(): string {
  return getRocomCommandPrefixes()
    .map(item => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
}

function extractUidArgument(text: string): string {
  const matched = text.match(new RegExp(`^(?:${buildRocomPrefixPattern()})\\s*(?:uid|UID)(?:\\s*(\\d+))?$`, 'u'));

  return normalizeText(matched?.[1]);
}

async function buildRuntimeScopedParams(userIdentifier: string): Promise<Record<string, string>> {
  const config = await getWeGameRuntimeConfig();
  const params: Record<string, string> = {
    user_identifier: userIdentifier
  };

  if (config.client_type) {
    params.client_type = config.client_type;
  }

  if (config.client_id) {
    params.client_id = config.client_id;
  }

  return params;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function normalizeTaskStatus(value: unknown): string {
  return normalizeText(value).toLowerCase();
}

function isCompletedPayload(payload: Record<string, unknown> | null | undefined): boolean {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return Array.isArray(payload.rows);
}

function isIngameTaskPayload(payload: Record<string, unknown> | null | undefined): payload is IngameTaskPayload {
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

export async function getRocomProfile(event: { current: { Platform?: string; BotId?: string; UserId?: string } }) {
  const context = getWeGameUserContext(event);
  const { credential, binding } = await resolveActiveWeGameCredential(context);

  if (!credential?.frameworkToken) {
    throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
  }

  const accountType = formatLoginTypeToAccountType(binding?.loginType ?? credential.loginType);
  const profileParams: Record<string, string> | undefined = accountType ? { account_type: accountType } : undefined;

  const [roleData, evaluationData, collectionData, battleOverviewData] = await Promise.all([
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/profile/role', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      },
      params: profileParams
    }),
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/profile/evaluation', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      },
      params: profileParams
    }),
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/profile/collection', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      },
      params: profileParams
    }),
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/profile/battle-overview', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      }
    })
  ]);

  return {
    role: (roleData.role as Record<string, unknown> | undefined) ?? credential.role ?? {},
    evaluation: evaluationData,
    collection: collectionData,
    battleOverview: battleOverviewData
  };
}

export function buildRocomProfileText(payload: {
  role: Record<string, unknown>;
  evaluation: Record<string, unknown>;
  collection: Record<string, unknown>;
  battleOverview: Record<string, unknown>;
}): string {
  const role = payload.role ?? {};
  const evaluation = payload.evaluation ?? {};
  const collection = payload.collection ?? {};
  const battleOverview = payload.battleOverview ?? {};

  return [
    '洛克档案',
    `昵称：${formatSearchValue(role.name)}`,
    `角色ID：${formatSearchValue(role.id ?? role.openid)}`,
    `等级：${formatSearchValue(role.level)}`,
    `星级：${formatSearchValue(role.star_name)}`,
    `注册天数：${formatSearchValue(role.enroll_days)}`,
    `评分：${formatSearchValue(evaluation.score)}`,
    `战力：${formatSearchValue(evaluation.strength)}`,
    `推进：${formatSearchValue(evaluation.progression)}`,
    `捉宠：${formatSearchValue(evaluation.capture)}`,
    `收藏：${formatSearchValue(evaluation.collection)}`,
    `当前图鉴：${formatSearchValue(collection.current_collection_count)}`,
    `总图鉴：${formatSearchValue(collection.total_collection_count)}`,
    `总对局：${formatSearchValue(battleOverview.total_match)}`,
    `总胜场：${formatSearchValue(battleOverview.total_win)}`,
    `胜率：${formatSearchValue(battleOverview.win_rate)}`
  ].join('\n');
}

function normalizeSearchRow(row: unknown): RocomSearchRow | null {
  if (!row || typeof row !== 'object') {
    return null;
  }

  const payload = row as Record<string, unknown>;

  return {
    field: normalizeText(payload.field),
    label: normalizeText(payload.label),
    value: normalizeText(payload.value)
  };
}

function buildSearchLines(uid: string, rows: RocomSearchRow[]): string {
  const lines = [`UID：${uid}`];

  for (const row of rows) {
    if (!row.label && !row.field) {
      continue;
    }

    const label = row.label || row.field;
    const value = row.value || '未返回';

    lines.push(`${label}：${value}`);
  }

  return lines.join('\n');
}

export async function searchRocomPlayer(event: { current: { Platform?: string; BotId?: string; UserId?: string; MessageText?: string } }) {
  const context = getWeGameUserContext(event);
  const text = event.current.MessageText ?? '';
  let uid = extractUidArgument(text);

  if (!uid) {
    const data = await getRocomAccounts(event);

    uid = normalizeText(data.accounts.find(item => item.isPrimary)?.roleId ?? data.accounts[0]?.roleId);
  }

  if (!uid) {
    throw new Error('未提供 UID，且当前没有可用的已绑定洛克角色。请先发送 #洛克账号列表 或 +uid <UID>');
  }

  const params = await buildRuntimeScopedParams(context.userIdentifier);
  const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/ingame/player/search', {
    method: 'POST',
    params,
    data: {
      uid,
      wait_ms: 5000
    }
  });
  const resolvedPayload = await resolveIngamePayload(payload);

  const directRows = Array.isArray(resolvedPayload.rows) ? resolvedPayload.rows : [];
  const rows = directRows.map(item => normalizeSearchRow(item)).filter((item): item is RocomSearchRow => Boolean(item));

  return {
    uid,
    rows
  };
}

export function buildRocomSearchText(uid: string, rows: RocomSearchRow[]): string {
  if (rows.length === 0) {
    return `UID：${uid}\n未解析到可展示的玩家资料。`;
  }

  return buildSearchLines(uid, rows);
}
