import { storeKeys } from '@src/constants/storeKeys';
import { requestWeGame } from '@src/model/wegameAccount';
import { readRuntimeStore, writeRuntimeStore } from '@src/model/runtimeStore';

export type MerchantCatalogItem = {
  index: number;
  name: string;
  goods_id: number;
  item_id: number;
  item_num: number;
};

const CATALOG_TTL_MS = 6 * 60 * 60 * 1000;

const ALL_ALIASES = new Set(['全部', '全物品', '全部物品', '所有', '所有物品', 'all', '*']);

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

export function buildMerchantCatalog(randomGoods: unknown[]): MerchantCatalogItem[] {
  const items: MerchantCatalogItem[] = [];
  const seen = new Set<string>();

  for (const raw of Array.isArray(randomGoods) ? randomGoods : []) {
    const entry = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
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

type CatalogCache = { at: number; items: MerchantCatalogItem[] };

let memory: CatalogCache | null = null;

async function readDiskCatalog(): Promise<MerchantCatalogItem[]> {
  const payload = await readRuntimeStore<{ items?: MerchantCatalogItem[]; updated_at?: string }>(
    storeKeys.rocom.merchantCatalog,
    'rocom-merchant-catalog.json',
    {}
  );
  const items = Array.isArray(payload.items) ? payload.items : [];

  return items.filter(item => Boolean(normalizeText(item?.name)));
}

async function writeDiskCatalog(items: MerchantCatalogItem[]): Promise<void> {
  await writeRuntimeStore(storeKeys.rocom.merchantCatalog, 'rocom-merchant-catalog.json', {
    updated_at: new Date().toISOString(),
    source: 'merchant/info?random_goods=all',
    items
  });
}

/** 取商品目录：内存缓存 → 后端全量商品池 → 磁盘缓存 */
export async function getMerchantCatalog(options: { refresh?: boolean } = {}): Promise<MerchantCatalogItem[]> {
  const now = Date.now();

  if (!options.refresh && memory && memory.items.length > 0 && now - memory.at < CATALOG_TTL_MS) {
    return [...memory.items];
  }

  try {
    const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/merchant/info', {
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
  } catch (error) {
    logger.warn(`[rocom] 拉取远行商人商品目录失败：${error instanceof Error ? error.message : error}`);
  }

  const disk = await readDiskCatalog();

  if (disk.length > 0) {
    memory = { at: now, items: disk };

    return [...disk];
  }

  return memory?.items ? [...memory.items] : [];
}

export function isAllAlias(token = ''): boolean {
  return ALL_ALIASES.has(normalizeText(token).toLowerCase());
}

/** 解析用户输入：序号 / 商品名 / 全部 */
export function resolveMerchantSelection(
  input: string[],
  catalog: MerchantCatalogItem[]
): {
  all: boolean;
  names: string[];
  unknownIndexes: string[];
  unrecognizedNames: string[];
} {
  const names: string[] = [];
  const seen = new Set<string>();
  const unknownIndexes: string[] = [];
  const unrecognizedNames: string[] = [];
  let all = false;

  const pushName = (value: unknown) => {
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
      } else {
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

/** 把订阅的商品名回显成「序号.名称」 */
export function describeMerchantItems(names: string[], catalog: MerchantCatalogItem[]): string {
  const indexByName = new Map<string, number>();

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
