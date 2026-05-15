import { getRocomCommandPrefixes } from './rocom.js';
import { getRocomAccounts } from './rocomAccount.js';
import { resolveActiveWeGameCredential, requestWeGame, getWeGameRuntimeConfig } from './wegameAccount.js';

function normalizeText(value) {
    return String(value ?? '').trim();
}
function formatLoginTypeToAccountType(loginType) {
    const normalized = normalizeText(loginType).toLowerCase();
    if (normalized === 'qq') {
        return '1';
    }
    if (normalized === 'wechat') {
        return '2';
    }
    return undefined;
}
function formatLoginTypeToBattleZone(loginType) {
    const normalized = normalizeText(loginType).toLowerCase();
    if (normalized === 'qq') {
        return '0';
    }
    if (normalized === 'wechat') {
        return '1';
    }
    return undefined;
}
function formatSearchValue(value) {
    const text = normalizeText(value);
    return text || '未返回';
}
function buildRocomPrefixPattern() {
    return getRocomCommandPrefixes()
        .map(item => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
}
function extractUidArgument(text) {
    const matched = text.match(new RegExp(`^(?:${buildRocomPrefixPattern()})\\s*(?:uid|UID)(?:\\s*(\\d+))?$`, 'u'));
    return normalizeText(matched?.[1]);
}
async function buildRuntimeScopedParams(userIdentifier) {
    const config = await getWeGameRuntimeConfig();
    const params = {
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
function toRecord(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}
function normalizeTaskStatus(value) {
    return normalizeText(value).toLowerCase();
}
function isCompletedPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    return Array.isArray(payload.rows);
}
function isIngameTaskPayload(payload) {
    return Boolean(normalizeText(payload?.task_id ?? payload?.taskId));
}
function isPendingTaskStatus(status) {
    return ['queued', 'pending', 'running', 'processing', 'accepted'].includes(status);
}
function isFailedTaskStatus(status) {
    return ['failed', 'error', 'timeout', 'cancelled', 'canceled'].includes(status);
}
function getIngameTask(taskId) {
    return requestWeGame(`/api/v1/games/rocom/ingame/tasks/${encodeURIComponent(taskId)}`, {
        method: 'GET'
    });
}
async function resolveIngamePayload(payload) {
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
    let currentPayload = payload;
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
async function getRocomProfile(context) {
    const { credential, binding } = await resolveActiveWeGameCredential(context);
    if (!credential?.frameworkToken) {
        throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
    }
    const accountType = formatLoginTypeToAccountType(binding?.loginType ?? credential.loginType);
    const battleZone = formatLoginTypeToBattleZone(binding?.loginType ?? credential.loginType);
    const profileParams = accountType ? { account_type: accountType } : undefined;
    const battleListParams = battleZone
        ? {
            zone: battleZone,
            page_size: '1'
        }
        : {
            page_size: '1'
        };
    const [roleData, evaluationData, petSummaryData, collectionData, battleOverviewData, battleListData] = await Promise.all([
        requestWeGame('/api/v1/games/rocom/profile/role', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            },
            params: profileParams
        }),
        requestWeGame('/api/v1/games/rocom/profile/evaluation', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            },
            params: profileParams
        }),
        requestWeGame('/api/v1/games/rocom/profile/pet-summary', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            },
            params: profileParams
        }),
        requestWeGame('/api/v1/games/rocom/profile/collection', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            },
            params: profileParams
        }),
        requestWeGame('/api/v1/games/rocom/profile/battle-overview', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            }
        }),
        requestWeGame('/api/v1/games/rocom/battle/list', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            },
            params: battleListParams
        })
    ]);
    return {
        role: roleData.role ?? credential.role ?? {},
        evaluation: evaluationData,
        petSummary: petSummaryData,
        collection: collectionData,
        battleOverview: battleOverviewData,
        battleList: battleListData
    };
}
function buildRocomProfileText(payload) {
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
function normalizeRemoteUrl(value) {
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
function toDisplayText(value, fallback = '--') {
    const text = normalizeText(value);
    return text || fallback;
}
function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}
function clampPercent(value) {
    return Math.max(0, Math.min(100, toNumber(value, 0)));
}
function formatScore(value) {
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
function formatWinRate(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
        return '--';
    }
    return `${num
        .toFixed(2)
        .replace(/\.00$/, '')
        .replace(/(\.\d)0$/, '$1')}%`;
}
function hasMeaningfulEvaluation(evaluation) {
    const metricKeys = ['capture', 'collection', 'progression', 'strength'];
    if (metricKeys.some(key => toNumber(evaluation[key], 0) > 0)) {
        return true;
    }
    const scoreNum = Number(evaluation.score);
    return Number.isFinite(scoreNum) && scoreNum > 0;
}
function hasMeaningfulPetSummary(petSummary) {
    const bestPetId = normalizeText(petSummary.best_pet_id);
    if (bestPetId && bestPetId !== '0') {
        return true;
    }
    return ['best_pet_name', 'summary_title', 'summary_content', 'best_pet_img_url'].some(key => normalizeText(petSummary[key]));
}
function hasMeaningfulBattleOverview(battleOverview) {
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
function hasMeaningfulBattleRecord(battle) {
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
function splitSummaryTitle(value) {
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
function buildRadarPoints(centerX, centerY, radius, ratio) {
    return [
        `${centerX},${centerY - radius * ratio}`,
        `${centerX + radius * ratio},${centerY}`,
        `${centerX},${centerY + radius * ratio}`,
        `${centerX - radius * ratio},${centerY}`
    ].join(' ');
}
function buildRadarModel(evaluation) {
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
    ];
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
function normalizeBattlePets(petInfoList) {
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
function normalizeBattleResult(value) {
    const text = normalizeText(value).toLowerCase();
    if (Number(value) === 0) {
        return 'win';
    }
    if (['win', 'success', 'true'].includes(text)) {
        return 'win';
    }
    return 'fail';
}
function buildRocomProfileCardData(payload) {
    const role = payload.role ?? {};
    const evaluation = payload.evaluation ?? {};
    const petSummary = payload.petSummary ?? {};
    const collection = payload.collection ?? {};
    const battleOverview = payload.battleOverview ?? {};
    const latestBattle = Array.isArray(payload.battleList?.battles) ? toRecord(payload.battleList?.battles[0]) : null;
    const hasAiProfileData = hasMeaningfulEvaluation(evaluation) && hasMeaningfulPetSummary(petSummary);
    const hasBattleData = hasMeaningfulBattleOverview(battleOverview) && hasMeaningfulBattleRecord(latestBattle);
    const bestPetName = toDisplayText(petSummary.best_pet_name, normalizeText(petSummary.best_pet_id) ? `精灵 ${normalizeText(petSummary.best_pet_id)}` : '本期精灵');
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
function normalizeSearchRow(row) {
    if (!row || typeof row !== 'object') {
        return null;
    }
    const payload = row;
    return {
        field: normalizeText(payload.field),
        label: normalizeText(payload.label),
        value: normalizeText(payload.value)
    };
}
function buildSearchLines(uid, rows) {
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
async function searchRocomPlayer(context, rawArgs = '') {
    let uid = extractUidArgument(rawArgs);
    if (!uid) {
        const data = await getRocomAccounts(event);
        uid = normalizeText(data.accounts.find(item => item.isPrimary)?.roleId ?? data.accounts[0]?.roleId);
    }
    if (!uid) {
        throw new Error('未提供 UID，且当前没有可用的已绑定洛克角色。请先发送 +账号列表 或 +uid <UID>');
    }
    const params = await buildRuntimeScopedParams(context.userIdentifier);
    const payload = await requestWeGame('/api/v1/games/rocom/ingame/player/search', {
        method: 'POST',
        params,
        data: {
            uid,
            wait_ms: 5000
        }
    });
    const resolvedPayload = await resolveIngamePayload(payload);
    const directRows = Array.isArray(resolvedPayload.rows) ? resolvedPayload.rows : [];
    const rows = directRows.map(item => normalizeSearchRow(item)).filter((item) => Boolean(item));
    return {
        uid,
        rows
    };
}
function buildRocomSearchText(uid, rows) {
    if (rows.length === 0) {
        return `UID：${uid}\n未解析到可展示的玩家资料。`;
    }
    return buildSearchLines(uid, rows);
}

export { buildRocomProfileCardData, buildRocomProfileText, buildRocomSearchText, getRocomProfile, searchRocomPlayer };
