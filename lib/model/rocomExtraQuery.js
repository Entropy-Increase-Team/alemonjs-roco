import { getRocomAccounts } from './rocomAccount.js';
import { fetchRocomMerchantInfo } from './rocomMerchant.js';
import { getRocomCommandPrefixes } from './rocom.js';
import { getWeGameUserContext, requestWeGame, resolveActiveWeGameCredential } from './wegameAccount.js';

function normalizeText(value) {
    return String(value ?? '').trim();
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function buildPrefixPattern() {
    return getRocomCommandPrefixes()
        .map(item => escapeRegExp(item))
        .join('|');
}
function extractUidByPattern(text, pattern) {
    const matched = text.match(new RegExp(pattern, 'u'));
    return normalizeText(matched?.[1]);
}
function formatSearchValue(value) {
    const text = normalizeText(value);
    return text || '未返回';
}
function normalizeTaskStatus(value) {
    return normalizeText(value).toLowerCase();
}
function isCompletedPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    return Array.isArray(payload.rows) || payload.home_info !== undefined || payload.friend_home_brief_info !== undefined;
}
function toRecord(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
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
async function resolveRocomUid(event, pattern, emptyMessage) {
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
function formatDateTime(value) {
    const text = normalizeText(value);
    if (!text) {
        return '未返回';
    }
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
        return text;
    }
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function normalizeUrl(value) {
    const text = normalizeText(value);
    if (!text) {
        return '';
    }
    if (text.startsWith('//')) {
        return `https:${text}`;
    }
    if (/^https?:\/\//u.test(text)) {
        return text;
    }
    return '';
}
function getBattleResult(value) {
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
function formatWinRate(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
        return '--';
    }
    return `${num
        .toFixed(2)
        .replace(/\.00$/u, '')
        .replace(/(\.\d)0$/u, '$1')}%`;
}
function normalizeBattlePets(petInfoList) {
    if (!Array.isArray(petInfoList)) {
        return [];
    }
    return petInfoList.slice(0, 6).map((item, index) => {
        const pet = toRecord(item) ?? {};
        return {
            name: formatSearchValue(pet.pet_name ?? `精灵 ${index + 1}`),
            icon: normalizeUrl(pet.pet_img_url)
        };
    });
}
async function getRocomHome(event) {
    const context = getWeGameUserContext(event);
    const uid = await resolveRocomUid(event, `^(?:${buildPrefixPattern()})\\s*(?:家园|home|刷新家园|rehome)(?:\\s*(\\d+))?$`, '未提供 UID，且当前没有可用的已绑定洛克角色。请先发送 +账号列表 或 +家园 <UID>');
    const payload = await requestWeGame('/api/v1/games/rocom/ingame/home/info', {
        method: 'GET',
        params: {
            user_identifier: context.userIdentifier,
            uid,
            wait_ms: '20000'
        }
    });
    const resolved = await resolveIngamePayload(payload);
    const homeInfo = resolved.home_info ?? resolved;
    const brief = homeInfo.friend_home_brief_info ?? homeInfo.home_brief_info ?? homeInfo;
    return {
        rawPayload: resolved,
        uid,
        homeName: formatSearchValue(brief.home_name ?? brief.name),
        roomLevel: formatSearchValue(brief.room_level),
        homeLevel: formatSearchValue(brief.home_level),
        homeExperience: formatSearchValue(brief.home_experience),
        comfortLevel: formatSearchValue(brief.home_comfort_level)
    };
}
function buildRocomHomeText(payload) {
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
function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}
function normalizeTimestampSeconds(value) {
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
function normalizeDurationSeconds(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) {
        return 0;
    }
    if (num > 1e11) {
        return Math.floor(num / 1000000);
    }
    if (num > 1e8) {
        return Math.floor(num / 1000);
    }
    return Math.floor(num);
}
function formatRemaining(targetTime, now = Math.floor(Date.now() / 1000)) {
    const target = normalizeTimestampSeconds(targetTime);
    if (!target) {
        return '未开始';
    }
    if (now >= target) {
        return '已完成';
    }
    const remain = Math.max(0, target - now);
    let hours = Math.floor(remain / 3600);
    const minutes = Math.floor((remain % 3600) / 60);
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        hours %= 24;
        return `${days}天${hours}小时`;
    }
    if (hours > 0) {
        return `${hours}小时${minutes}分钟`;
    }
    return `${minutes}分钟`;
}
function buildProgress(targetTime, duration, now = Math.floor(Date.now() / 1000)) {
    const target = normalizeTimestampSeconds(targetTime);
    const cost = normalizeDurationSeconds(duration);
    if (!target) {
        return 0;
    }
    if (now >= target) {
        return 100;
    }
    if (!cost) {
        return 5;
    }
    return Math.max(5, Math.min(100, Math.round(((cost - (target - now)) / cost) * 100)));
}
function assetPetId(petId) {
    const numeric = Number(petId);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return '';
    }
    return numeric >= 3000 ? String(numeric) : String(numeric + 3000);
}
function buildPetIconUrl(petId) {
    const id = assetPetId(petId);
    if (!id) {
        return '';
    }
    return `https://game.gtimg.cn/images/rocom/rocodata/jingling/${id}/icon.png`;
}
function pickHomePayload(payload) {
    const homeInfo = toRecord(payload.home_info);
    const nestedHomeInfo = toRecord(homeInfo?.home_info);
    const data = toRecord(payload.data);
    const dataHomeInfo = toRecord(data?.home_info);
    const result = toRecord(payload.result);
    const resultHomeInfo = toRecord(result?.home_info);
    if (toRecord(homeInfo?.friend_home_brief_info)) {
        return homeInfo;
    }
    if (toRecord(nestedHomeInfo?.friend_home_brief_info)) {
        return nestedHomeInfo;
    }
    if (toRecord(dataHomeInfo?.friend_home_brief_info)) {
        return dataHomeInfo;
    }
    if (toRecord(resultHomeInfo?.friend_home_brief_info)) {
        return resultHomeInfo;
    }
    return homeInfo ?? data ?? result ?? payload;
}
function extractPet(item, now = Math.floor(Date.now() / 1000), guard = false) {
    const homePetInfo = toRecord(item.home_pet_info) ?? item;
    const displayInfo = toRecord(item.display_info) ?? {};
    const feedInfo = toRecord(homePetInfo.feed_info);
    const petId = homePetInfo.pet_cfg_id ?? homePetInfo.pet_id ?? homePetInfo.pet_base_id ?? item.pet_cfg_id ?? item.pet_id ?? item.id;
    if (!toNumber(petId, 0) && !guard) {
        return null;
    }
    const name = normalizeText(homePetInfo.name ?? homePetInfo.pet_name ?? item.name ?? item.pet_name) || `精灵 ${String(petId ?? '').trim()}`.trim();
    const beginTime = feedInfo ? normalizeTimestampSeconds(feedInfo.begin_time) : 0;
    const timeCost = feedInfo ? normalizeDurationSeconds(feedInfo.time_cost) : 0;
    let ripTime = normalizeTimestampSeconds(homePetInfo.pet_rip_time ?? item.pet_rip_time ?? item.rip_time);
    if (!ripTime && beginTime && timeCost) {
        ripTime = beginTime + timeCost;
    }
    const hasInspiration = Boolean(ripTime);
    const inspireReady = hasInspiration && now >= ripTime;
    const status = normalizeText(item.status).toLowerCase();
    const isGuard = guard || item.is_guard === true || item.guard === true || status === '2' || status === 'guard';
    const statusText = isGuard && !hasInspiration ? '守卫中' : inspireReady ? '灵感已完成' : hasInspiration ? '灵感收集中' : '未喂食';
    const statusClass = isGuard && !hasInspiration ? 'guard' : inspireReady ? 'ready' : hasInspiration ? 'progress' : 'idle';
    return {
        id: String(petId ?? ''),
        name,
        level: normalizeText(displayInfo.level ?? item.level ?? homePetInfo.level) || '--',
        iconUrl: buildPetIconUrl(petId),
        badge: isGuard ? '守' : '',
        isGuard,
        statusText,
        statusClass,
        note: hasInspiration ? formatRemaining(ripTime, now) : isGuard ? '家园守卫位' : '暂无灵感倒计时'
    };
}
function collectPetSources(homeInfo) {
    const cellInfo = toRecord(homeInfo.friend_cell_home_brief_info) ?? toRecord(homeInfo.cell_info) ?? {};
    const indoorSources = [];
    const guardSources = [];
    const homePets = Array.isArray(homeInfo.home_pets) ? homeInfo.home_pets : [];
    for (const pet of homePets) {
        if (toRecord(pet)) {
            indoorSources.push(toRecord(pet));
        }
    }
    const cellHomePets = Array.isArray(cellInfo.home_pets) ? cellInfo.home_pets : [];
    for (const pet of cellHomePets) {
        const row = toRecord(pet);
        const homePet = toRecord(row?.home_pet_info) ?? {};
        if (!row) {
            continue;
        }
        if (String(homePet.pet_cfg_id ?? '0') === '0' && (homePet.name || homePet.pet_name)) {
            guardSources.push(row);
        }
        else {
            indoorSources.push(row);
        }
    }
    const petInfo = toRecord(cellInfo.home_pet_info) ?? {};
    const homePetList = Array.isArray(petInfo.home_pet_list) ? petInfo.home_pet_list : [];
    for (const pet of homePetList) {
        const row = toRecord(pet);
        if (row) {
            indoorSources.push(row);
        }
    }
    for (const key of ['guard_pets', 'home_guard_pets', 'guard_pet_list']) {
        const homeRows = Array.isArray(homeInfo[key]) ? homeInfo[key] : [];
        const cellRows = Array.isArray(cellInfo[key]) ? cellInfo[key] : [];
        for (const row of [...homeRows, ...cellRows]) {
            const item = toRecord(row);
            if (item) {
                guardSources.push(item);
            }
        }
    }
    for (const key of [
        'guard_pet',
        'home_guard_pet',
        'guard_pet_info',
        'home_guard_pet_info',
        'defend_pet',
        'defend_pet_info',
        'protect_pet',
        'protect_pet_info'
    ]) {
        const homeRow = toRecord(homeInfo[key]);
        const cellRow = toRecord(cellInfo[key]);
        if (homeRow) {
            guardSources.push(homeRow);
        }
        if (cellRow) {
            guardSources.push(cellRow);
        }
    }
    return { indoorSources, guardSources };
}
function extractPlants(homeInfo) {
    const cellInfo = toRecord(homeInfo.friend_cell_home_brief_info) ?? toRecord(homeInfo.cell_info) ?? {};
    const plantSources = [];
    const directPlants = Array.isArray(homeInfo.home_plants) ? homeInfo.home_plants : [];
    for (const plant of directPlants) {
        const item = toRecord(plant);
        if (item) {
            plantSources.push(item);
        }
    }
    const plantInfo = toRecord(cellInfo.home_plant_info) ?? {};
    const landList = Array.isArray(plantInfo.home_plant_land_list) ? plantInfo.home_plant_land_list : [];
    for (const land of landList) {
        const landRow = toRecord(land);
        const homePlantList = Array.isArray(landRow?.home_plant_list) ? landRow.home_plant_list : [];
        for (const plant of homePlantList) {
            const item = toRecord(plant);
            if (item) {
                plantSources.push({
                    ...item,
                    land_index: item.land_index ?? landRow?.land_index
                });
            }
        }
    }
    const now = Math.floor(Date.now() / 1000);
    const result = [];
    for (let index = 0; index < plantSources.length; index += 1) {
        const raw = plantSources[index];
        const plantData = toRecord(raw.plant_info) ?? raw;
        const plantId = raw.plant_seed_id ?? raw.plant_cfg_id ?? raw.plant_id ?? plantData.id;
        if (!toNumber(plantId, 0)) {
            continue;
        }
        let ripTime = normalizeTimestampSeconds(raw.plant_rip_time ?? raw.rip_time ?? raw.end_time);
        const leftTime = toNumber(raw.left_time, 0);
        if (!ripTime && leftTime > 0) {
            ripTime = now + leftTime;
        }
        const ready = (ripTime > 0 && now >= ripTime) || raw.status === 2 || raw.status === 'ready' || raw.status === 'mature';
        let total = toNumber(raw.time_cost ?? raw.total_time, 0);
        if (!total && raw.plant_tab_id) {
            total = toNumber(raw.plant_tab_id, 1) * 21600;
        }
        result.push({
            id: String(plantId),
            landIndex: normalizeText(raw.slot_index ?? raw.land_index ?? index + 1),
            plantName: normalizeText(plantData.name ?? raw.name) || `种子 ${plantId}`,
            statusText: ready ? '已成熟' : '成长中',
            stateType: ready ? 'ready' : 'warning',
            leftTimeText: ready ? '可收获' : formatRemaining(ripTime, now),
            progress: total && ripTime ? buildProgress(ripTime, total, now) : ready ? 100 : 35,
            harvestText: raw.plant_harvest_num !== null && raw.plant_harvest_num !== undefined ? `产量 ${raw.plant_harvest_num}` : '',
            stealText: raw.plant_steal_account !== null &&
                raw.plant_steal_account !== undefined &&
                raw.plant_can_steal_account !== null &&
                raw.plant_can_steal_account !== undefined
                ? `可偷 ${raw.plant_steal_account}/${raw.plant_can_steal_account}`
                : ''
        });
    }
    return result;
}
function buildRocomHomeCardData(payload, uid) {
    const homeInfo = pickHomePayload(payload);
    const brief = toRecord(homeInfo.friend_home_brief_info) ?? toRecord(homeInfo.home_brief_info) ?? toRecord(homeInfo.brief) ?? homeInfo;
    const now = Math.floor(Date.now() / 1000);
    const { indoorSources, guardSources } = collectPetSources(homeInfo);
    const indoorPets = [];
    const guardPets = [];
    for (const petSource of indoorSources) {
        const pet = extractPet(petSource, now, false);
        if (!pet) {
            continue;
        }
        if (pet.isGuard) {
            guardPets.push(pet);
        }
        else {
            indoorPets.push(pet);
        }
    }
    for (const petSource of guardSources) {
        const pet = extractPet(petSource, now, true);
        if (pet) {
            guardPets.push(pet);
        }
    }
    const gardenPlots = extractPlants(homeInfo);
    const homeName = normalizeText(brief.home_name ?? brief.name) || '洛克玩家';
    return {
        title: '洛克家园',
        subtitle: 'Home Information',
        homeName,
        uid,
        updatedAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        summaryCards: [
            { label: '房间等级', value: normalizeText(brief.room_level) || '--' },
            { label: '家园等级', value: normalizeText(brief.home_level) || '--' },
            { label: '家园经验', value: normalizeText(brief.home_experience) || '--' },
            { label: '舒适度', value: normalizeText(brief.home_comfort_level) || '--' }
        ],
        gardenPlots,
        guardPets,
        indoorPets,
        gardenCount: gardenPlots.length,
        indoorCount: indoorPets.length,
        guardCount: guardPets.length,
        guardEmptyText: '后端当前返回中没有守卫精灵字段'
    };
}
function resolveBattleZone(loginType) {
    const normalized = normalizeText(loginType).toLowerCase();
    if (normalized === 'qq') {
        return '0';
    }
    if (normalized === 'wechat') {
        return '1';
    }
    return undefined;
}
async function getRocomRecord(event) {
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
    let battles = [];
    let finish = false;
    const zone = resolveBattleZone(credential.loginType);
    const [roleData, battleOverviewData] = await Promise.all([
        requestWeGame('/api/v1/games/rocom/profile/role', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            }
        }).catch(() => ({})),
        requestWeGame('/api/v1/games/rocom/profile/battle-overview', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            }
        }).catch(() => ({}))
    ]);
    while (currentPage <= pageNo) {
        const params = {
            page_size: '4'
        };
        if (zone !== undefined) {
            params.zone = zone;
        }
        if (afterTime) {
            params.after_time = afterTime;
        }
        const data = await requestWeGame('/api/v1/games/rocom/battle/list', {
            method: 'GET',
            headers: {
                'X-Framework-Token': credential.frameworkToken
            },
            params
        });
        battles = Array.isArray(data.battles) ? data.battles : [];
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
        currentPage,
        finish,
        role: toRecord(toRecord(roleData)?.role) ?? credential.role ?? {},
        battleOverview: battleOverviewData,
        battles
    };
}
function buildRocomRecordText(payload) {
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
function buildRocomRecordCardData(payload) {
    const role = ('role' in payload ? payload.role : {}) ?? {};
    const battleOverview = ('battleOverview' in payload ? payload.battleOverview : {}) ?? {};
    return {
        userName: formatSearchValue(role.name ?? payload.battles[0]?.nickname ?? '洛克玩家'),
        userLevel: formatSearchValue(role.level),
        userUid: formatSearchValue(role.id ?? role.openid),
        userAvatar: normalizeUrl(role.avatar_url ?? role.avatar ?? payload.battles[0]?.avatar_url),
        winRate: formatWinRate(battleOverview.win_rate),
        totalMatch: formatSearchValue(battleOverview.total_match ?? payload.battles.length),
        currentPage: 'currentPage' in payload ? Number(payload.currentPage) || payload.pageNo : payload.pageNo,
        pageText: 'finish' in payload && payload.finish
            ? `第 ${'currentPage' in payload ? Number(payload.currentPage) || payload.pageNo : payload.pageNo} 页 / 共 ${'currentPage' in payload ? Number(payload.currentPage) || payload.pageNo : payload.pageNo} 页`
            : `第 ${'currentPage' in payload ? Number(payload.currentPage) || payload.pageNo : payload.pageNo} 页 / 可继续翻页`,
        footerCommandHint: '用 “+战绩 <页数>” 进行翻页',
        battles: payload.battles.map(battle => {
            const result = getBattleResult(battle.result);
            const formatted = formatDateTime(battle.battle_time);
            const [date = '未返回', time = '未返回'] = formatted.split(' ');
            return {
                leftName: formatSearchValue(battle.nickname),
                leftAvatar: normalizeUrl(battle.avatar_url),
                leftPets: normalizeBattlePets(battle.pet_base_info),
                rightName: formatSearchValue(battle.enemy_nickname),
                rightAvatar: normalizeUrl(battle.enemy_avatar_url),
                rightPets: normalizeBattlePets(battle.enemy_pet_base_info),
                resultLabel: result.label,
                resultKind: result.kind,
                time,
                date
            };
        })
    };
}
function parseRocomSizeArgs(rawText) {
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
function formatDecimalValue(value) {
    return value
        .toFixed(2)
        .replace(/\.00$/u, '')
        .replace(/(\.\d)0$/u, '$1');
}
function formatMetricRange(min, max, unit) {
    const minValue = Number(min);
    const maxValue = Number(max);
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
        return '后端未提供';
    }
    return `${formatDecimalValue(minValue)}-${formatDecimalValue(maxValue)}${unit}`;
}
function formatCountLabel(value, label) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return '';
    }
    return `${label} ${formatDecimalValue(numeric)}`;
}
function formatProbabilityLabel(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return '';
    }
    return `匹配概率 ${formatDecimalValue(numeric)}%`;
}
function buildSizeQueryLabel(args, searchMode) {
    const labels = [`身高 ${args.diameter} cm`, `体重 ${args.weight} kg`];
    const modeText = normalizeText(searchMode);
    if (!modeText) {
        return labels.join(' / ');
    }
    return `${labels.join(' / ')} · 模式 ${modeText}`;
}
function normalizeSizeMatchCard(item) {
    const row = toRecord(item);
    if (!row) {
        return null;
    }
    const petName = normalizeText(row.pet);
    const petId = normalizeText(row.petId);
    const probability = formatProbabilityLabel(row.probability);
    const matchCount = formatCountLabel(row.matchCount, '命中次数');
    const extraLabels = [probability, matchCount].filter(Boolean);
    return {
        id: petId || '-',
        name: petName || '未知精灵',
        icon: normalizeUrl(row.petIcon) || normalizeUrl(row.petImage),
        typeLabel: '后端未提供',
        eggGroupsLabel: extraLabels.length > 0 ? extraLabels.join(' / ') : '后端未提供',
        heightLabel: formatMetricRange(row.diameterMin, row.diameterMax, 'm'),
        weightLabel: formatMetricRange(row.weightMin, row.weightMax, 'kg')
    };
}
async function getRocomSizeQuery(rawText) {
    const args = parseRocomSizeArgs(rawText);
    const payload = await requestWeGame('/api/v1/games/rocom/pet/size-query', {
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
function buildRocomSizeCardData(result) {
    const exactResults = Array.isArray(result.payload.exactResults) ? result.payload.exactResults : [];
    const candidates = Array.isArray(result.payload.candidates) ? result.payload.candidates : [];
    const perfectMatches = exactResults.map(normalizeSizeMatchCard).filter((item) => Boolean(item));
    const rangeMatches = candidates.map(normalizeSizeMatchCard).filter((item) => Boolean(item));
    return {
        queryLabel: buildSizeQueryLabel(result.args, result.payload.searchMode),
        hasResults: perfectMatches.length > 0 || rangeMatches.length > 0,
        perfectMatches,
        rangeMatches,
        commandHint: '发送 +查蛋 <精灵名> 查看详细蛋组信息',
        copyright: 'WeGame-plugin · RoCom'
    };
}
function buildRocomSizeText(result) {
    const data = buildRocomSizeCardData(result);
    const lines = ['尺寸反查', `查询条件：${data.queryLabel}`];
    if (!data.hasResults) {
        lines.push('没有找到匹配当前尺寸的精灵');
        lines.push('');
        lines.push(data.commandHint);
        return lines.join('\n');
    }
    if (data.perfectMatches.length > 0) {
        lines.push('');
        lines.push(`完美匹配（${data.perfectMatches.length}）`);
        for (const [index, item] of data.perfectMatches.entries()) {
            lines.push(`${index + 1}. ${item.name} #${item.id} · ${item.heightLabel} / ${item.weightLabel} · ${item.eggGroupsLabel}`);
        }
    }
    if (data.rangeMatches.length > 0) {
        lines.push('');
        lines.push(`范围匹配（${data.rangeMatches.length}）`);
        for (const [index, item] of data.rangeMatches.entries()) {
            lines.push(`${index + 1}. ${item.name} #${item.id} · ${item.heightLabel} / ${item.weightLabel} · ${item.eggGroupsLabel}`);
        }
    }
    lines.push('');
    lines.push(data.commandHint);
    return lines.join('\n');
}
function getRocomMerchantInfo() {
    return fetchRocomMerchantInfo(false);
}

export { buildRocomHomeCardData, buildRocomHomeText, buildRocomRecordCardData, buildRocomRecordText, buildRocomSizeCardData, buildRocomSizeText, getRocomHome, getRocomMerchantInfo, getRocomRecord, getRocomSizeQuery, parseRocomSizeArgs };
