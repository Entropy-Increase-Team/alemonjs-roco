import { getRocomCommandPrefixes } from '@src/model/rocom';
import { getRocomAccounts } from '@src/model/rocomAccount';
import { getWeGameRuntimeConfig, requestWeGame, resolveActiveWeGameCredential, type WeGameContext } from '@src/model/wegameAccount';

type RocomSearchRow = {
  field: string;
  label: string;
  value: string;
};

export type RocomProfileCardData = {
  userName: string;
  userLevel: string;
  userUid: string;
  userAvatar: string;
  enrollDays: string;
  starName: string;
  hasAiProfileData: boolean;
  summaryTitleParts: string[];
  bestPetName: string;
  bestPetImage: string;
  scoreText: string;
  aiCommentText: string;
  currentCollectionCount: string;
  totalCollectionCount: string;
  amazingSpriteCount: string;
  shinySpriteCount: string;
  colorfulSpriteCount: string;
  fashionCollectionCount: string;
  itemCount: string;
  collectionHint: string;
  hasBattleData: boolean;
  tierBadgeUrl: string;
  totalMatch: string;
  totalWin: string;
  winRate: string;
  matchResult: 'win' | 'fail';
  leftTeamPets: Array<{ name: string; icon: string }>;
  rightTeamPets: Array<{ name: string; icon: string }>;
  opponentName: string;
  opponentAvatar: string;
  radarPolygons: string[];
  radarAreaPoints: string;
  radarDots: Array<{ x: number; y: number; value: number; key: string }>;
  radarValueBadges: Array<{ value: string; x: number; y: number; width: number }>;
  radarAxisLabels: Array<{ name: string; x: number; y: number; anchor: string }>;
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

function formatLoginTypeToBattleZone(loginType?: string): string | undefined {
  const normalized = normalizeText(loginType).toLowerCase();

  if (normalized === 'qq') {
    return '0';
  }
  if (normalized === 'wechat') {
    return '1';
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

export async function getRocomProfile(context: WeGameContext) {
  const { credential, binding } = await resolveActiveWeGameCredential(context);

  if (!credential?.frameworkToken) {
    throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
  }

  const accountType = formatLoginTypeToAccountType(binding?.loginType ?? credential.loginType);
  const battleZone = formatLoginTypeToBattleZone(binding?.loginType ?? credential.loginType);
  const profileParams: Record<string, string> | undefined = accountType ? { account_type: accountType } : undefined;
  const battleListParams: Record<string, string> | undefined = battleZone
    ? {
        zone: battleZone,
        page_size: '1'
      }
    : {
        page_size: '1'
      };

  const [roleData, evaluationData, petSummaryData, collectionData, battleOverviewData, battleListData] = await Promise.all([
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
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/profile/pet-summary', {
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
    }),
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/battle/list', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      },
      params: battleListParams
    })
  ]);

  return {
    role: (roleData.role as Record<string, unknown> | undefined) ?? credential.role ?? {},
    evaluation: evaluationData,
    petSummary: petSummaryData,
    collection: collectionData,
    battleOverview: battleOverviewData,
    battleList: battleListData
  };
}

export function buildRocomProfileText(payload: {
  role: Record<string, unknown>;
  evaluation: Record<string, unknown>;
  petSummary?: Record<string, unknown>;
  collection: Record<string, unknown>;
  battleOverview: Record<string, unknown>;
  battleList?: Record<string, unknown>;
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

function normalizeRemoteUrl(value: unknown): string {
  const text = normalizeText(value);

  if (!text) {
    return '';
  }
  if (/^data:image\//.test(text)) {
    return text;
  }
  if (text.startsWith('//')) {
    return `https:${text}`;
  }
  if (/^https?:\/\//.test(text)) {
    return text;
  }

  return '';
}

function toDisplayText(value: unknown, fallback = '--'): string {
  const text = normalizeText(value);

  return text || fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);

  return Number.isFinite(num) ? num : fallback;
}

function clampPercent(value: unknown): number {
  return Math.max(0, Math.min(100, toNumber(value, 0)));
}

function formatScore(value: unknown): string {
  if (value === undefined || value === null || value === '') {
    return '--';
  }

  const num = Number(value);

  if (Number.isFinite(num)) {
    const text = Number.isInteger(num) ? String(num) : num.toFixed(1).replace(/\.0$/, '');

    return `${text}分`;
  }

  const text = normalizeText(value);

  return text.endsWith('分') ? text : `${text}分`;
}

function formatWinRate(value: unknown): string {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return '--';
  }

  return `${num
    .toFixed(2)
    .replace(/\.00$/, '')
    .replace(/(\.\d)0$/, '$1')}%`;
}

function hasMeaningfulEvaluation(evaluation: Record<string, unknown>): boolean {
  const metricKeys = ['capture', 'collection', 'progression', 'strength'];

  if (metricKeys.some(key => toNumber(evaluation[key], 0) > 0)) {
    return true;
  }

  const scoreNum = Number(evaluation.score);

  return Number.isFinite(scoreNum) && scoreNum > 0;
}

function hasMeaningfulPetSummary(petSummary: Record<string, unknown>): boolean {
  const bestPetId = normalizeText(petSummary.best_pet_id);

  if (bestPetId && bestPetId !== '0') {
    return true;
  }

  return ['best_pet_name', 'summary_title', 'summary_content', 'best_pet_img_url'].some(key => normalizeText(petSummary[key]));
}

function hasMeaningfulBattleOverview(battleOverview: Record<string, unknown>): boolean {
  if (toNumber(battleOverview.total_match, 0) > 0) {
    return true;
  }
  if (toNumber(battleOverview.total_win, 0) > 0) {
    return true;
  }
  if (normalizeText(battleOverview.tier)) {
    return true;
  }

  return Boolean(normalizeRemoteUrl(battleOverview.tier_icon_url));
}

function hasMeaningfulBattleRecord(battle: Record<string, unknown> | null): boolean {
  if (!battle) {
    return false;
  }
  if (normalizeText(battle.battle_time)) {
    return true;
  }
  if (normalizeText(battle.nickname)) {
    return true;
  }
  if (normalizeText(battle.enemy_nickname)) {
    return true;
  }
  if (Array.isArray(battle.pet_base_info) && battle.pet_base_info.length > 0) {
    return true;
  }
  if (Array.isArray(battle.enemy_pet_base_info) && battle.enemy_pet_base_info.length > 0) {
    return true;
  }

  return false;
}

function splitSummaryTitle(value: unknown): string[] {
  const text = normalizeText(value);

  if (!text) {
    return ['洛克档案'];
  }

  const parts = text.split(/[\s|｜/、，,]+/).filter(Boolean);

  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(' ')].filter(Boolean).slice(0, 2);
  }

  if (text.length >= 6) {
    const middle = Math.ceil(text.length / 2);

    return [text.slice(0, middle), text.slice(middle)].filter(Boolean);
  }

  return [text];
}

function buildRadarPoints(centerX: number, centerY: number, radius: number, ratio: number): string {
  return [
    `${centerX},${centerY - radius * ratio}`,
    `${centerX + radius * ratio},${centerY}`,
    `${centerX},${centerY + radius * ratio}`,
    `${centerX - radius * ratio},${centerY}`
  ].join(' ');
}

function buildRadarModel(evaluation: Record<string, unknown>) {
  const centerX = 128;
  const centerY = 108;
  const radius = 60;
  const values = {
    strength: clampPercent(evaluation.strength),
    progression: clampPercent(evaluation.progression),
    capture: clampPercent(evaluation.capture),
    collection: clampPercent(evaluation.collection)
  };
  const radarAxes = [
    { key: 'strength', name: '战力', labelX: 128, labelY: 12, anchor: 'middle', dx: 0, dy: -18 },
    { key: 'progression', name: '推进', labelX: 224, labelY: 110, anchor: 'start', dx: 20, dy: 0 },
    { key: 'capture', name: '捉宠', labelX: 128, labelY: 215, anchor: 'middle', dx: 0, dy: 18 },
    { key: 'collection', name: '收藏', labelX: 34, labelY: 110, anchor: 'end', dx: -20, dy: 0 }
  ] as const;
  const radarPolygons = [0.25, 0.5, 0.75, 1].map(level => buildRadarPoints(centerX, centerY, radius, level));
  const pointMap = {
    strength: { x: centerX, y: centerY - (radius * values.strength) / 100 },
    progression: { x: centerX + (radius * values.progression) / 100, y: centerY },
    capture: { x: centerX, y: centerY + (radius * values.capture) / 100 },
    collection: { x: centerX - (radius * values.collection) / 100, y: centerY }
  };
  const radarAreaPoints = [pointMap.strength, pointMap.progression, pointMap.capture, pointMap.collection].map(point => `${point.x},${point.y}`).join(' ');
  const radarDots = radarAxes.map(axis => ({
    key: axis.key,
    x: pointMap[axis.key].x,
    y: pointMap[axis.key].y,
    value: values[axis.key]
  }));
  const radarValueBadges = radarAxes.map(axis => {
    const point = pointMap[axis.key];
    const text = String(values[axis.key]);
    const width = Math.max(34, text.length * 10 + 16);

    return {
      value: text,
      x: point.x + axis.dx - width / 2,
      y: point.y + axis.dy - 12,
      width
    };
  });
  const radarAxisLabels = radarAxes.map(axis => ({
    name: axis.name,
    x: axis.labelX,
    y: axis.labelY,
    anchor: axis.anchor
  }));

  return {
    radarPolygons,
    radarAreaPoints,
    radarDots,
    radarValueBadges,
    radarAxisLabels
  };
}

function normalizeBattlePets(petInfoList: unknown): Array<{ name: string; icon: string }> {
  if (!Array.isArray(petInfoList)) {
    return [];
  }

  return petInfoList.slice(0, 6).map((item, index) => {
    const row = toRecord(item);

    return {
      name: toDisplayText(row?.pet_name, `精灵 ${index + 1}`),
      icon: normalizeRemoteUrl(row?.pet_img_url)
    };
  });
}

function normalizeBattleResult(value: unknown): 'win' | 'fail' {
  const text = normalizeText(value).toLowerCase();

  if (Number(value) === 0) {
    return 'win';
  }
  if (['win', 'success', 'true'].includes(text)) {
    return 'win';
  }

  return 'fail';
}

export function buildRocomProfileCardData(payload: {
  role: Record<string, unknown>;
  evaluation: Record<string, unknown>;
  petSummary?: Record<string, unknown>;
  collection: Record<string, unknown>;
  battleOverview: Record<string, unknown>;
  battleList?: Record<string, unknown>;
}): RocomProfileCardData {
  const role = payload.role ?? {};
  const evaluation = payload.evaluation ?? {};
  const petSummary = payload.petSummary ?? {};
  const collection = payload.collection ?? {};
  const battleOverview = payload.battleOverview ?? {};
  const latestBattle = Array.isArray(payload.battleList?.battles) ? toRecord(payload.battleList?.battles[0]) : null;
  const hasAiProfileData = hasMeaningfulEvaluation(evaluation) && hasMeaningfulPetSummary(petSummary);
  const hasBattleData = hasMeaningfulBattleOverview(battleOverview) && hasMeaningfulBattleRecord(latestBattle);
  const bestPetName = toDisplayText(
    petSummary.best_pet_name,
    normalizeText(petSummary.best_pet_id) ? `精灵 ${normalizeText(petSummary.best_pet_id)}` : '本期精灵'
  );

  return {
    userName: toDisplayText(role.name, '洛克玩家'),
    userLevel: toDisplayText(role.level),
    userUid: toDisplayText(role.id ?? role.openid),
    userAvatar: normalizeRemoteUrl(role.avatar_url ?? latestBattle?.avatar_url ?? role.avatar),
    enrollDays: toDisplayText(role.enroll_days),
    starName: toDisplayText(role.star_name),
    hasAiProfileData,
    summaryTitleParts: splitSummaryTitle(petSummary.summary_title),
    bestPetName,
    bestPetImage: normalizeRemoteUrl(petSummary.best_pet_img_url),
    scoreText: formatScore(evaluation.score),
    aiCommentText: toDisplayText(petSummary.summary_content, '暂无 AI 点评。'),
    currentCollectionCount: toDisplayText(collection.current_collection_count, '0'),
    totalCollectionCount: toDisplayText(collection.total_collection_count, '0'),
    amazingSpriteCount: toDisplayText(collection.amazing_sprite_count, '0'),
    shinySpriteCount: toDisplayText(collection.shiny_sprite_count, '0'),
    colorfulSpriteCount: toDisplayText(collection.colorful_sprite_count, '0'),
    fashionCollectionCount: toDisplayText(collection.fashion_collection_count, '0'),
    itemCount: toDisplayText(collection.item_count, '0'),
    collectionHint: '输入“+精灵列表”查看精灵总览',
    hasBattleData,
    tierBadgeUrl: normalizeRemoteUrl(battleOverview.tier_icon_url ?? latestBattle?.tier_url),
    totalMatch: toDisplayText(battleOverview.total_match, '0'),
    totalWin: toDisplayText(battleOverview.total_win, '0'),
    winRate: formatWinRate(battleOverview.win_rate),
    matchResult: normalizeBattleResult(latestBattle?.result),
    leftTeamPets: normalizeBattlePets(latestBattle?.pet_base_info),
    rightTeamPets: normalizeBattlePets(latestBattle?.enemy_pet_base_info),
    opponentName: toDisplayText(latestBattle?.enemy_nickname, '未知对手'),
    opponentAvatar: normalizeRemoteUrl(latestBattle?.enemy_avatar_url),
    ...buildRadarModel(evaluation)
  };
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

export async function searchRocomPlayer(context: WeGameContext, rawArgs = '') {
  let uid = extractUidArgument(rawArgs);

  if (!uid) {
    const data = await getRocomAccounts(event);

    uid = normalizeText(data.accounts.find(item => item.isPrimary)?.roleId ?? data.accounts[0]?.roleId);
  }

  if (!uid) {
    throw new Error('未提供 UID，且当前没有可用的已绑定洛克角色。请先发送 +账号列表 或 +uid <UID>');
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
