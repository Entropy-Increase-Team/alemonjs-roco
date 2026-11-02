import { requestWeGameEnvelope } from './wegameAccount.js';
import { getCurrentMerchantRound, fetchRocomMerchantInfo, normalizeMerchantActivities } from './rocomMerchant.js';
import { writeRuntimeStore, readRuntimeStore } from './runtimeStore.js';
import { storeKeys } from '../constants/storeKeys.js';

const priceLogStoreKey = storeKeys.rocom.merchantPriceLog;
const priceLogStoreFileName = 'rocom-merchant-price-log.json';
function normalizeText(value) {
    return String(value ?? '').trim();
}
function toPositiveNumber(value) {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : 0;
}
function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
const chinaDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' });
function getChinaDateKey(date = new Date()) {
    return chinaDateFormatter.format(date);
}
function getChinaParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
        .formatToParts(date)
        .reduce((acc, item) => {
        if (item.type !== 'literal') {
            acc[item.type] = Number(item.value);
        }
        return acc;
    }, {});
    return {
        year: parts.year,
        month: parts.month,
        day: parts.day,
        hour: parts.hour,
        minute: parts.minute,
        second: parts.second
    };
}
const ROUND_WINDOWS = [
    { id: 1, label: '08:00 - 12:00', startHour: 8, endHour: 12 },
    { id: 2, label: '12:00 - 16:00', startHour: 12, endHour: 16 },
    { id: 3, label: '16:00 - 20:00', startHour: 16, endHour: 20 },
    { id: 4, label: '20:00 - 24:00', startHour: 20, endHour: 24 }
];
function padNumber(value) {
    return String(value).padStart(2, '0');
}
function toTimestampMs(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return 0;
    }
    return numeric < 1e12 ? numeric * 1000 : numeric;
}
function getTodayRangeMs(date = new Date()) {
    const parts = getChinaParts(date);
    const startOfDay = new Date(`${parts.year}-${padNumber(parts.month)}-${padNumber(parts.day)}T00:00:00+08:00`).getTime();
    return {
        startOfDay,
        endOfDay: startOfDay + 24 * 60 * 60 * 1000
    };
}
function resolveRealtimePrice(goods = {}, key = 'real') {
    const price = goods.price;
    if (isPlainObject(price)) {
        const target = price[key] ?? price.origin ?? price.real;
        if (isPlainObject(target)) {
            return Number(target.amount) || 0;
        }
        return Number(target) || 0;
    }
    return Number(price) || 0;
}
async function loadPriceLog(now = new Date()) {
    const today = getChinaDateKey(now);
    const raw = await readRuntimeStore(priceLogStoreKey, priceLogStoreFileName, { date: '', updated_at: '', items: {} });
    if (raw?.date === today) {
        return {
            date: today,
            updated_at: normalizeText(raw.updated_at),
            items: isPlainObject(raw.items) ? raw.items : {}
        };
    }
    const empty = { date: today, updated_at: '', items: {} };
    await writeRuntimeStore(priceLogStoreKey, priceLogStoreFileName, empty).catch(() => undefined);
    return empty;
}
async function recordRealtimePrices(entries) {
    try {
        const state = await loadPriceLog();
        let changed = false;
        for (const entry of entries) {
            const goodsId = Number(entry.goods_id);
            const price = toPositiveNumber(entry.price);
            if (!Number.isFinite(goodsId) || goodsId <= 0 || price <= 0) {
                continue;
            }
            const key = String(goodsId);
            const current = state.items[key] ?? {
                goods_id: goodsId,
                name: normalizeText(entry.goods_name),
                item_id: Number(entry.item_id) || 0,
                item_num: Number(entry.item_num) || 1,
                buy_limit_num: Number(entry.buy_limit_num) || 0,
                by_round: {},
                price: 0,
                origin_price: 0,
                round: 0
            };
            if (!current.name && entry.goods_name) {
                current.name = normalizeText(entry.goods_name);
            }
            if (!current.item_id && entry.item_id) {
                current.item_id = Number(entry.item_id);
            }
            if (!current.item_num && entry.item_num) {
                current.item_num = Number(entry.item_num);
            }
            if (!current.buy_limit_num && entry.buy_limit_num) {
                current.buy_limit_num = Number(entry.buy_limit_num);
            }
            current.by_round[String(entry.round || 0)] = {
                price,
                origin_price: toPositiveNumber(entry.origin_price) || price,
                buy_limit_num: Number(entry.buy_limit_num) || current.buy_limit_num || 0,
                at: new Date().toISOString()
            };
            current.price = price;
            current.origin_price = toPositiveNumber(entry.origin_price) || price;
            current.round = entry.round || current.round;
            state.items[key] = current;
            changed = true;
        }
        if (changed) {
            state.updated_at = new Date().toISOString();
            await writeRuntimeStore(priceLogStoreKey, priceLogStoreFileName, state);
        }
    }
    catch (error) {
        logger.warn(`[rocom] 记录远行商人实时价格失败：${error instanceof Error ? error.message : error}`);
    }
}
async function lookupLoggedPrice(goodsId, name = '', round = 0) {
    const state = await loadPriceLog();
    const items = state.items ?? {};
    const fromEntry = (entry) => {
        if (!entry) {
            return null;
        }
        const byRound = entry.by_round ?? {};
        const matched = byRound[String(Number(round) || 0)];
        const source = matched || { price: entry.price, origin_price: entry.origin_price, buy_limit_num: entry.buy_limit_num };
        const price = toPositiveNumber(source?.price);
        if (price <= 0) {
            return null;
        }
        return {
            goods_id: Number(entry.goods_id) || 0,
            name: normalizeText(entry.name),
            price,
            origin_price: toPositiveNumber(source?.origin_price) || price,
            buy_limit_num: Number(source?.buy_limit_num) || Number(entry.buy_limit_num) || 0,
            round: Number(round) || Number(entry.round) || 0
        };
    };
    const normalizedId = Number(goodsId);
    if (Number.isFinite(normalizedId) && normalizedId > 0) {
        const direct = fromEntry(items[String(normalizedId)]);
        if (direct) {
            return direct;
        }
    }
    const normalizedName = normalizeText(name);
    if (!normalizedName) {
        return null;
    }
    for (const entry of Object.values(items)) {
        if (normalizeText(entry?.name) === normalizedName) {
            const found = fromEntry(entry);
            if (found) {
                return found;
            }
        }
    }
    return null;
}
function extractCompletedPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }
    const candidates = [payload, payload.result, payload.data];
    for (const candidate of candidates) {
        const record = candidate;
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            continue;
        }
        if (Array.isArray(record.rows) || normalizeText(record.title) || record.source !== undefined || record.home_info !== undefined) {
            return record;
        }
        if (Array.isArray(record.goods) && record.shop !== undefined) {
            return record;
        }
    }
    return null;
}
function extractTaskErrorMessage(payload, fallbackStatus = '') {
    const candidates = [
        payload.message,
        payload.error,
        payload.error_message,
        payload.errorMessage,
        payload.reason,
        payload.detail,
        toRecordLike(payload.result).message,
        toRecordLike(payload.data).message
    ];
    for (const candidate of candidates) {
        const text = normalizeText(candidate);
        if (text && text !== 'failed') {
            return text;
        }
    }
    return normalizeText(payload.status || fallbackStatus) || 'failed';
}
function attachEnvelopeExtras(envelope) {
    const data = isPlainObject(envelope.data) ? { ...envelope.data } : {};
    const mapping = Array.isArray(envelope.goods_mapping) ? envelope.goods_mapping : Array.isArray(data.goods_mapping) ? data.goods_mapping : null;
    if (mapping) {
        data.goods_mapping = mapping;
        const result = data.result;
        if (isPlainObject(result) && !Array.isArray(result.goods_mapping)) {
            data.result = { ...result, goods_mapping: mapping };
        }
    }
    return data;
}
async function fetchMerchantTaskEnvelope(taskId, userIdentifier) {
    const envelope = await requestWeGameEnvelope(`/api/v1/games/rocom/ingame/tasks/${encodeURIComponent(taskId)}`, {
        method: 'GET',
        headers: { 'X-User-Identifier': userIdentifier },
        params: { user_identifier: userIdentifier }
    });
    return attachEnvelopeExtras(envelope);
}
async function fetchRealtimeMerchantInfo(userIdentifier = '') {
    const envelope = await requestWeGameEnvelope('/api/v1/games/rocom/ingame/merchant/info', {
        method: 'GET',
        params: {
            wait_ms: '5000',
            user_identifier: userIdentifier
        },
        headers: { 'X-User-Identifier': userIdentifier }
    });
    let payload = attachEnvelopeExtras(envelope);
    const initialCompleted = extractCompletedPayload(payload);
    if (initialCompleted) {
        payload = initialCompleted;
    }
    const taskId = normalizeText(payload.task_id ?? payload.taskId);
    if (taskId) {
        const startedAt = Date.now();
        const timeoutMs = 3 * 60 * 1000;
        const intervalMs = 5000;
        while (Date.now() - startedAt < timeoutMs) {
            const status = normalizeText(payload.status).toLowerCase();
            if (['failed', 'error', 'timeout', 'cancelled', 'canceled'].includes(status)) {
                throw new Error(`Ingame 任务失败：${extractTaskErrorMessage(payload, status)}`);
            }
            const next = await fetchMerchantTaskEnvelope(taskId, userIdentifier);
            const completed = extractCompletedPayload(next);
            if (completed) {
                payload = completed;
                break;
            }
            payload = next;
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
    }
    const goods = Array.isArray(payload.goods) ? payload.goods : [];
    if (goods.length === 0) {
        const meta = isPlainObject(payload.meta) ? payload.meta : {};
        const status = normalizeText(meta.status);
        if (status && status !== 'ok') {
            logger.warn(`[rocom] 实时商店查询未成功（status=${status}），回退旧接口`);
        }
        return null;
    }
    return payload;
}
function buildLegacyGoodsIndex(legacy) {
    const merchantActivities = Array.isArray(legacy?.merchantActivities)
        ? legacy.merchantActivities
        : Array.isArray(legacy?.merchant_activities)
            ? legacy.merchant_activities
            : [];
    const activity = merchantActivities[0] ?? {};
    const randomGoods = Array.isArray(legacy?.random_goods) ? legacy.random_goods : [];
    const byGoodsId = new Map();
    const byItemId = new Map();
    const byName = new Map();
    const items = [];
    for (const raw of randomGoods) {
        const item = toRecordLike(raw);
        const goodsId = Number(item.id);
        const name = normalizeText(item.goods_name);
        const entry = {
            goods_id: Number.isFinite(goodsId) ? goodsId : 0,
            name,
            icon_url: '',
            item_id: Number(item.item_id) || 0,
            item_num: Number(item.item_num) || 1,
            price: Number(item.price) || 0,
            origin_price: Number(item.origin_price) || 0,
            buy_limit_num: Number(item.buy_limit_num) || 0
        };
        if (entry.goods_id) {
            byGoodsId.set(entry.goods_id, entry);
        }
        if (entry.item_id) {
            byItemId.set(entry.item_id, entry);
        }
        if (name) {
            byName.set(name, entry);
        }
    }
    const collectItems = (list, kind) => {
        for (const raw of Array.isArray(list) ? list : []) {
            const item = toRecordLike(raw);
            const name = normalizeText(item.name);
            if (!name) {
                continue;
            }
            const linked = toRecordLike(byName.get(name));
            const entry = {
                goods_id: Number(linked.goods_id) || 0,
                name,
                icon_url: normalizeText(item.icon_url),
                start_time: Number(item.start_time) || 0,
                end_time: Number(item.end_time) || 0,
                round: Number(item.round) || 0,
                item_id: Number(linked.item_id) || 0,
                item_num: Number(linked.item_num) || 1,
                price: Number(linked.price) || 0,
                origin_price: Number(linked.origin_price) || 0,
                buy_limit_num: Number(linked.buy_limit_num) || 0,
                kind
            };
            items.push(entry);
            byName.set(name, entry);
            const goodsId = Number(entry.goods_id);
            if (goodsId) {
                byGoodsId.set(goodsId, entry);
            }
            const itemId = Number(entry.item_id);
            if (itemId) {
                byItemId.set(itemId, entry);
            }
        }
    };
    collectItems(Array.isArray(activity.get_props) ? activity.get_props : [], 'prop');
    collectItems(Array.isArray(activity.get_extra_props) ? activity.get_extra_props : [], 'extra_prop');
    collectItems(Array.isArray(activity.get_pets) ? activity.get_pets : [], 'pet');
    return { activity, items, byGoodsId, byItemId, byName, randomGoods };
}
function toRecordLike(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}
function resolveRealtimeWindow(item, now) {
    const nowMs = now.getTime();
    const roundInfo = getCurrentMerchantRound(now);
    const currentRound = roundInfo.current;
    let roundWindow = null;
    if (roundInfo.startTime && roundInfo.endTime) {
        roundWindow = { start_time: roundInfo.startTime.getTime(), end_time: roundInfo.endTime.getTime() };
    }
    const nextRefreshMs = toTimestampMs(item.next_refresh_time);
    if (nextRefreshMs > nowMs) {
        return {
            start_time: roundWindow ? roundWindow.start_time : nowMs,
            end_time: nextRefreshMs,
            round: currentRound || 0
        };
    }
    if (!nextRefreshMs) {
        const { startOfDay, endOfDay } = getTodayRangeMs(now);
        return {
            start_time: startOfDay + 8 * 60 * 60 * 1000,
            end_time: endOfDay,
            round: 0
        };
    }
    return roundWindow ? { ...roundWindow, round: currentRound || 0 } : { start_time: nowMs, end_time: nowMs + 4 * 60 * 60 * 1000, round: currentRound || 0 };
}
function formatChinaDate(date = new Date()) {
    const parts = getChinaParts(date);
    return `${parts.year}-${padNumber(parts.month)}-${padNumber(parts.day)}`;
}
async function buildRealtimePayload(realtime, options) {
    const now = options.now instanceof Date ? options.now : new Date();
    const legacyIndex = buildLegacyGoodsIndex(options.legacy);
    const shop = toRecordLike(realtime.shop);
    const goods = Array.isArray(realtime.goods) ? realtime.goods : [];
    const mapping = Array.isArray(realtime.goods_mapping) ? realtime.goods_mapping : [];
    const mappingById = new Map();
    for (const raw of mapping) {
        const item = toRecordLike(raw);
        const goodsId = Number(item.goods_id);
        if (Number.isFinite(goodsId)) {
            mappingById.set(goodsId, item);
        }
    }
    const getProps = [];
    const randomGoods = [];
    const realtimeRoundKeys = new Set();
    const legacyRoundKeys = new Set();
    const realtimeNames = new Set();
    const realtimeGoodsIds = new Set();
    const priceEntries = [];
    for (const raw of goods) {
        const item = toRecordLike(raw);
        const goodsId = Number(item.goods_id);
        const mapped = mappingById.get(goodsId) ?? {};
        const mappedItemId = Number(mapped.item_id) || 0;
        const legacyItem = legacyIndex.byGoodsId.get(goodsId) ||
            (mappedItemId ? legacyIndex.byItemId.get(mappedItemId) : null) ||
            legacyIndex.byName.get(normalizeText(mapped.goods_name)) ||
            null;
        const name = normalizeText(item.goods_name) ||
            normalizeText(mapped.goods_name) ||
            normalizeText(legacyItem?.name) ||
            (Number.isFinite(goodsId) ? `商品 ${goodsId}` : '未知商品');
        const price = resolveRealtimePrice(item, 'real');
        const originPrice = resolveRealtimePrice(item, 'origin');
        const buyLimit = Number(item.limit_buy_num) || 0;
        const itemId = mappedItemId || Number(legacyItem?.item_id) || 0;
        const itemNum = Number(mapped.item_num) || Number(legacyItem?.item_num) || 1;
        const window = resolveRealtimeWindow(item, now);
        getProps.push({
            name,
            icon_url: normalizeText(legacyItem?.icon_url),
            start_time: window.start_time,
            end_time: window.end_time,
            round: window.round,
            goods_id: Number.isFinite(goodsId) ? goodsId : 0,
            item_id: itemId,
            item_num: itemNum,
            price,
            origin_price: originPrice,
            buy_limit_num: buyLimit,
            buy_num: Number(item.buy_num) || 0,
            source: 'realtime'
        });
        randomGoods.push({
            id: Number.isFinite(goodsId) ? goodsId : 0,
            goods_name: name,
            item_id: itemId,
            item_num: itemNum,
            price,
            origin_price: originPrice,
            buy_limit_num: buyLimit,
            enable: true
        });
        priceEntries.push({
            goods_id: Number.isFinite(goodsId) ? goodsId : 0,
            goods_name: normalizeText(mapped.goods_name) || name,
            item_id: itemId,
            item_num: itemNum,
            buy_limit_num: buyLimit,
            price,
            origin_price: originPrice,
            round: window.round
        });
        realtimeRoundKeys.add(`${name}@${window.round || 0}`);
        realtimeNames.add(name);
        if (Number.isFinite(goodsId)) {
            realtimeGoodsIds.add(goodsId);
        }
    }
    await recordRealtimePrices(priceEntries);
    for (const entry of legacyIndex.items) {
        const roundKey = `${normalizeText(entry.name)}@${Number(entry.round) || 0}`;
        if (realtimeRoundKeys.has(roundKey) || legacyRoundKeys.has(roundKey)) {
            continue;
        }
        legacyRoundKeys.add(roundKey);
        const logged = await lookupLoggedPrice(Number(entry.goods_id) || 0, normalizeText(entry.name), Number(entry.round) || 0);
        const legacyPrice = Number(entry.price) || 0;
        getProps.push({
            ...entry,
            price: legacyPrice > 0 ? legacyPrice : logged?.price || 0,
            origin_price: Number(entry.origin_price) || logged?.origin_price || 0,
            buy_limit_num: Number(entry.buy_limit_num) || logged?.buy_limit_num || 0,
            price_source: legacyPrice > 0 ? 'legacy' : logged ? 'log' : 'none'
        });
    }
    for (const raw of legacyIndex.randomGoods) {
        const item = toRecordLike(raw);
        const goodsId = Number(item.id);
        const name = normalizeText(item.goods_name);
        if (name && realtimeNames.has(name)) {
            continue;
        }
        if (Number.isFinite(goodsId) && realtimeGoodsIds.has(goodsId)) {
            continue;
        }
        const logged = await lookupLoggedPrice(goodsId, name, 0);
        const legacyPrice = Number(item.price) || 0;
        randomGoods.push({
            ...item,
            price: legacyPrice > 0 ? legacyPrice : logged?.price || 0,
            origin_price: Number(item.origin_price) || logged?.origin_price || 0,
            buy_limit_num: Number(item.buy_limit_num) || logged?.buy_limit_num || 0,
            price_source: legacyPrice > 0 ? 'legacy' : logged ? 'log' : 'none'
        });
    }
    const legacyActivity = legacyIndex.activity ?? {};
    const activity = {
        name: normalizeText(legacyActivity.name) || '远行商人',
        start_date: normalizeText(legacyActivity.start_date) || formatChinaDate(now),
        start_time: Number(legacyActivity.start_time) || 0,
        end_time: Number(legacyActivity.end_time) || 0,
        get_props: getProps,
        get_extra_props: [],
        get_pets: [],
        source: 'realtime'
    };
    return {
        merchantActivities: [activity],
        random_goods: randomGoods,
        realtime: {
            shop,
            goods,
            goods_mapping: mapping,
            source: normalizeText(toRecordLike(realtime.meta).source),
            round: getCurrentMerchantRound(now)
        }
    };
}
async function fetchRocomMerchantMergedInfo(userIdentifier = '') {
    let realtime = null;
    try {
        realtime = await fetchRealtimeMerchantInfo(userIdentifier);
    }
    catch (error) {
        logger.warn(`[rocom] 实时远行商人接口不可用，回退旧接口：${error instanceof Error ? error.message : error}`);
    }
    if (!realtime) {
        return fetchRocomMerchantInfo();
    }
    const legacy = await fetchRocomMerchantInfo().catch(error => {
        logger.warn(`[rocom] 远行商人旧接口补充数据失败：${error instanceof Error ? error.message : error}`);
        return null;
    });
    return buildRealtimePayload(realtime, { legacy});
}
function classifyMerchantItem(item = {}) {
    const startTime = Number(item.start_time);
    const endTime = Number(item.end_time);
    if (!startTime || !endTime) {
        return 'normal';
    }
    const durationDays = (endTime - startTime) / (1000 * 60 * 60 * 24);
    if (durationDays >= 2) {
        return 'weekend';
    }
    const startParts = getChinaParts(new Date(startTime));
    const endParts = getChinaParts(new Date(endTime));
    const startHour = startParts.hour + startParts.minute / 60;
    let endHour = endParts.hour + endParts.minute / 60;
    if (endHour === 0 && endTime > startTime) {
        endHour = 24;
    }
    if (startHour <= 8 && endHour >= 23.5) {
        return 'normal';
    }
    return 'round';
}
function getRoundForItem(item = {}, date = new Date()) {
    const startTime = Number(item.start_time);
    if (!startTime) {
        return 0;
    }
    const parts = getChinaParts(new Date(startTime));
    const todayParts = getChinaParts(date);
    if (parts.year !== todayParts.year || parts.month !== todayParts.month || parts.day !== todayParts.day) {
        return 0;
    }
    const hour = parts.hour;
    for (const win of ROUND_WINDOWS) {
        if (hour >= win.startHour && hour < win.endHour) {
            return win.id;
        }
    }
    return 0;
}
function formatMerchantWindow(item = {}) {
    const startTime = Number(item.start_time);
    const endTime = Number(item.end_time);
    if (!startTime || !endTime) {
        const parts = getChinaParts(new Date());
        return `${padNumber(parts.month)}-${padNumber(parts.day)} 08:00 - 23:59`;
    }
    const format = (ms) => {
        const parts = getChinaParts(new Date(ms));
        return `${padNumber(parts.month)}-${padNumber(parts.day)} ${padNumber(parts.hour)}:${padNumber(parts.minute)}`;
    };
    const startLabel = format(startTime);
    const endLabel = format(endTime);
    return startLabel.slice(0, 5) === endLabel.slice(0, 5) ? `${startLabel} - ${endLabel.slice(6)}` : `${startLabel} - ${endLabel}`;
}
function buildIconMapAndPriceMap(payload) {
    const { merchantActivities } = normalizeMerchantActivities(payload);
    const activity = merchantActivities[0] ?? {};
    const props = Array.isArray(activity.get_props) ? activity.get_props : [];
    const extraProps = Array.isArray(activity.get_extra_props) ? activity.get_extra_props : [];
    const pets = Array.isArray(activity.get_pets) ? activity.get_pets : [];
    const randomGoods = Array.isArray(payload.random_goods) ? payload.random_goods : [];
    const iconMap = {};
    const priceMap = {};
    const limitMap = {};
    for (const raw of [...props, ...extraProps, ...pets]) {
        const item = toRecordLike(raw);
        const name = normalizeText(item.name);
        if (name && item.icon_url) {
            iconMap[name] = normalizeText(item.icon_url);
        }
    }
    for (const raw of randomGoods) {
        const item = toRecordLike(raw);
        const name = normalizeText(item.goods_name);
        if (name) {
            priceMap[name] = Number(item.price) || 0;
            limitMap[name] = Number(item.buy_limit_num) || 0;
        }
    }
    return {
        activity,
        allItems: [...props, ...extraProps, ...pets].map(raw => toRecordLike(raw)),
        iconMap,
        priceMap,
        limitMap
    };
}
function buildRocomMerchantTodayCardData(payload, now = new Date()) {
    const { allItems, iconMap, priceMap, limitMap } = buildIconMapAndPriceMap(payload);
    const roundInfo = getCurrentMerchantRound(now);
    const currentRoundId = roundInfo.current;
    const dateStr = `${now.getMonth() + 1}.${now.getDate()}`;
    const goodsAll = [];
    for (const item of allItems) {
        const category = classifyMerchantItem(item);
        const limit = limitMap[normalizeText(item.name)] || 0;
        const startTime = Number(item.start_time || 0);
        const endTime = Number(item.end_time || 0);
        const isEnded = now.getTime() >= endTime || now.getTime() < startTime;
        if (category === 'normal') {
            goodsAll.push({
                goodsName: normalizeText(item.name),
                iconUrl: normalizeText(item.icon_url) || iconMap[normalizeText(item.name)] || '',
                price: priceMap[normalizeText(item.name)] || 0,
                limit,
                category: 'normal',
                roundId: 0,
                isHot: true,
                isEnded: false,
                remainingStr: `本日限购${limit}个`,
                timeLabel: formatMerchantWindow(item)
            });
            continue;
        }
        const roundId = getRoundForItem(item, now);
        if (!roundId) {
            continue;
        }
        if (category === 'weekend') {
            goodsAll.push({
                goodsName: normalizeText(item.name),
                iconUrl: normalizeText(item.icon_url) || iconMap[normalizeText(item.name)] || '',
                price: priceMap[normalizeText(item.name)] || 0,
                limit,
                category: 'weekend',
                roundId: 0,
                isHot: true,
                isEnded,
                remainingStr: isEnded ? `第${roundId}轮·本轮限购${limit}个` : `活动期间限购${limit}个`,
                timeLabel: formatMerchantWindow(item)
            });
            continue;
        }
        goodsAll.push({
            goodsName: normalizeText(item.name),
            iconUrl: normalizeText(item.icon_url) || iconMap[normalizeText(item.name)] || '',
            price: priceMap[normalizeText(item.name)] || 0,
            limit,
            category: 'round',
            roundId,
            isHot: false,
            isEnded,
            remainingStr: isEnded ? `第${roundId}轮·本轮限购${limit}个` : `本轮限购${limit}个`,
            timeLabel: formatMerchantWindow(item)
        });
    }
    const catOrder = { round: 0, normal: 1, weekend: 2 };
    goodsAll.sort((a, b) => {
        if (a.isEnded !== b.isEnded) {
            return a.isEnded ? 1 : -1;
        }
        if (a.category !== b.category) {
            return catOrder[a.category] - catOrder[b.category];
        }
        return (b.price || 0) - (a.price || 0);
    });
    const grouped = new Map();
    for (const item of goodsAll) {
        const roundId = item.roundId || 0;
        if (!grouped.has(roundId)) {
            grouped.set(roundId, []);
        }
        grouped.get(roundId).push(item);
    }
    const roundIds = [...grouped.keys()].sort((a, b) => {
        if (a === 0) {
            return -1;
        }
        if (b === 0) {
            return 1;
        }
        return a - b;
    });
    const rows = roundIds.map(roundId => {
        const win = ROUND_WINDOWS.find(item => item.id === roundId);
        const items = grouped.get(roundId) ?? [];
        return {
            roundId,
            label: win ? `第${roundId}轮` : '热销',
            timeLabel: win ? `${padNumber(win.startHour)}-${padNumber(win.endHour)}` : '全天',
            isCurrent: Boolean(currentRoundId) && roundId === currentRoundId,
            items
        };
    });
    const todayDate = formatChinaDate(now);
    return {
        title: '今日远行商人',
        subtitle: `${todayDate} · 每日 08:00 / 12:00 / 16:00 / 20:00 刷新`,
        dateStr,
        totalProducts: rows.reduce((sum, row) => sum + row.items.length, 0),
        rows,
        currentRoundLabel: `第 ${currentRoundId ?? '未开放'} / ${roundInfo.total} 轮`,
        currentCountdown: roundInfo.countdown
    };
}
function buildRocomMerchantRoundCardData(payload, now = new Date()) {
    const { allItems, iconMap, priceMap, limitMap } = buildIconMapAndPriceMap(payload);
    const roundInfo = getCurrentMerchantRound(now);
    const currentRoundId = roundInfo.current;
    const dateStr = `${now.getMonth() + 1}.${now.getDate()}`;
    let timeRange = '--:--~--:--';
    if (currentRoundId) {
        const win = ROUND_WINDOWS.find(item => item.id === currentRoundId);
        if (win) {
            timeRange = `${padNumber(win.startHour)}:00-${padNumber(win.endHour)}:00`;
        }
    }
    const goodsAll = [];
    for (const item of allItems) {
        const category = classifyMerchantItem(item);
        const limit = limitMap[normalizeText(item.name)] || 0;
        if (category === 'normal') {
            goodsAll.push({
                goodsName: normalizeText(item.name),
                iconUrl: normalizeText(item.icon_url) || iconMap[normalizeText(item.name)] || '',
                price: priceMap[normalizeText(item.name)] || 0,
                limit,
                category: 'normal',
                roundId: 0,
                isHot: true,
                isEnded: false,
                remainingStr: `本日限购${limit}个`,
                timeLabel: formatMerchantWindow(item)
            });
            continue;
        }
        if (category === 'weekend') {
            goodsAll.push({
                goodsName: normalizeText(item.name),
                iconUrl: normalizeText(item.icon_url) || iconMap[normalizeText(item.name)] || '',
                price: priceMap[normalizeText(item.name)] || 0,
                limit,
                category: 'weekend',
                roundId: 0,
                isHot: true,
                isEnded: false,
                remainingStr: `活动期间限购${limit}个`,
                timeLabel: formatMerchantWindow(item)
            });
            continue;
        }
        const roundId = getRoundForItem(item, now);
        if (roundId !== currentRoundId) {
            continue;
        }
        const endTime = Number(item.end_time || 0);
        const isEnded = now.getTime() >= endTime || now.getTime() < Number(item.start_time || 0);
        goodsAll.push({
            goodsName: normalizeText(item.name),
            iconUrl: normalizeText(item.icon_url) || iconMap[normalizeText(item.name)] || '',
            price: priceMap[normalizeText(item.name)] || 0,
            limit,
            category: 'round',
            roundId,
            isHot: false,
            isEnded,
            remainingStr: `本轮限购${limit}个`,
            timeLabel: formatMerchantWindow(item)
        });
    }
    const catOrder = { round: 0, normal: 1, weekend: 2 };
    goodsAll.sort((a, b) => {
        if (a.category !== b.category) {
            return catOrder[a.category] - catOrder[b.category];
        }
        return (b.price || 0) - (a.price || 0);
    });
    return {
        title: normalizeText(toRecordLike(activity0(payload)).name) || '远行商人',
        subtitle: normalizeText(toRecordLike(activity0(payload)).start_date) || '每日 08:00 / 12:00 / 16:00 / 20:00 刷新',
        dateStr,
        timeRange,
        goods: goodsAll.map((item, index) => ({ ...item, num: String(index + 1).padStart(2, '0') })),
        currentRoundLabel: `第 ${currentRoundId ?? '未开放'} / ${roundInfo.total} 轮`,
        countdown: roundInfo.countdown
    };
}
function activity0(payload) {
    return normalizeMerchantActivities(payload).merchantActivities[0] ?? {};
}

export { ROUND_WINDOWS, buildRocomMerchantRoundCardData, buildRocomMerchantTodayCardData, fetchRealtimeMerchantInfo, fetchRocomMerchantMergedInfo, lookupLoggedPrice, recordRealtimePrices };
