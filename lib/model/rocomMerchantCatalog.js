import { storeKeys } from '../constants/storeKeys.js';
import { requestWeGame } from './wegameAccount.js';
import { writeRuntimeStore, readRuntimeStore } from './runtimeStore.js';

const CATALOG_TTL_MS = 6 * 60 * 60 * 1000;
const ALL_ALIASES = new Set(['全部', '全物品', '全部物品', '所有', '所有物品', 'all', '*']);
function normalizeText(value) {
    return String(value ?? '').trim();
}
function buildMerchantCatalog(randomGoods) {
    const items = [];
    const seen = new Set();
    for (const raw of Array.isArray(randomGoods) ? randomGoods : []) {
        const entry = raw && typeof raw === 'object' ? raw : {};
        const name = normalizeText(entry.goods_name);
        if (!name || seen.has(name)) {
            continue;
        }
        seen.add(name);
        items.push({
            index: items.length + 1,
            name,
            goods_id: Number(entry.id) || 0,
            item_id: Number(entry.item_id) || 0,
            item_num: Number(entry.item_num) || 1
        });
    }
    return items;
}
let memory = null;
async function readDiskCatalog() {
    const payload = await readRuntimeStore(storeKeys.rocom.merchantCatalog, 'rocom-merchant-catalog.json', {});
    const items = Array.isArray(payload.items) ? payload.items : [];
    return items.filter(item => Boolean(normalizeText(item?.name)));
}
async function writeDiskCatalog(items) {
    await writeRuntimeStore(storeKeys.rocom.merchantCatalog, 'rocom-merchant-catalog.json', {
        updated_at: new Date().toISOString(),
        source: 'merchant/info?random_goods=all',
        items
    });
}
async function getMerchantCatalog(options = {}) {
    const now = Date.now();
    if (!options.refresh && memory && memory.items.length > 0 && now - memory.at < CATALOG_TTL_MS) {
        return [...memory.items];
    }
    try {
        const payload = await requestWeGame('/api/v1/games/rocom/merchant/info', {
            method: 'GET',
            params: { random_goods: 'all' }
        });
        const items = buildMerchantCatalog(Array.isArray(payload.random_goods) ? payload.random_goods : []);
        if (items.length > 0) {
            memory = { at: now, items };
            await writeDiskCatalog(items).catch(() => undefined);
            return [...items];
        }
        logger.warn('[rocom] 远行商人商品目录为空，沿用本地缓存');
    }
    catch (error) {
        logger.warn(`[rocom] 拉取远行商人商品目录失败：${error instanceof Error ? error.message : error}`);
    }
    const disk = await readDiskCatalog();
    if (disk.length > 0) {
        memory = { at: now, items: disk };
        return [...disk];
    }
    return memory?.items ? [...memory.items] : [];
}
function isAllAlias(token = '') {
    return ALL_ALIASES.has(normalizeText(token).toLowerCase());
}
function resolveMerchantSelection(input, catalog) {
    const names = [];
    const seen = new Set();
    const unknownIndexes = [];
    const unrecognizedNames = [];
    let all = false;
    const pushName = (value) => {
        const text = normalizeText(value);
        if (!text || seen.has(text)) {
            return;
        }
        seen.add(text);
        names.push(text);
    };
    for (const raw of input) {
        const token = normalizeText(raw);
        if (!token) {
            continue;
        }
        if (isAllAlias(token)) {
            all = true;
            continue;
        }
        if (/^\d+$/u.test(token)) {
            const hit = catalog.find(item => Number(item.index) === Number(token));
            if (hit) {
                pushName(hit.name);
            }
            else {
                unknownIndexes.push(token);
            }
            continue;
        }
        const hit = catalog.find(item => normalizeText(item.name) === token);
        if (hit) {
            pushName(hit.name);
            continue;
        }
        pushName(token);
        if (catalog.length > 0) {
            unrecognizedNames.push(token);
        }
    }
    return { all, names, unknownIndexes, unrecognizedNames };
}
function describeMerchantItems(names, catalog) {
    const indexByName = new Map();
    for (const item of catalog) {
        indexByName.set(item.name, item.index);
    }
    return names
        .map(raw => {
        const name = normalizeText(raw);
        const index = indexByName.get(name) ?? 0;
        return index > 0 ? `${index}.${name}` : name;
    })
        .filter(Boolean)
        .join('、');
}

export { buildMerchantCatalog, describeMerchantItems, getMerchantCatalog, isAllAlias, resolveMerchantSelection };
