/*
 * 说明：后端 payload 字段大量为 unknown，字符串兜底链刻意使用 ||（空字符串同样视为缺失），
 * 因此关闭 prefer-nullish-coalescing 检查。
 */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { storeKeys } from '@src/constants/storeKeys';
import RocomMerchantRoundCard from '@src/img/views/RocomMerchantRoundCard';
import { getCurrentMerchantRound } from '@src/model/rocomMerchant';
import { buildRocomMerchantRoundCardData, fetchRocomMerchantMergedInfo } from '@src/model/rocomMerchantRealtime';
import { describeMerchantItems, getMerchantCatalog, resolveMerchantSelection } from '@src/model/rocomMerchantCatalog';
import { readRuntimeStore, writeRuntimeStore } from '@src/model/runtimeStore';
import { readRocomConfig } from '@src/model/wegameResource';
import { Format, MessageDirect } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

type MerchantSubscription = {
  key: string;
  group_id: string;
  bot_id: string;
  mention_all: boolean;
  mode: 'all' | 'items';
  items: string[];
  last_push_round: string;
  last_matched_items: string[];
  updated_by: string;
  updated_at: string;
};

type MerchantScope = {
  botId: string;
  groupId: string;
  userId: string;
};

const subscriptionStoreKey = storeKeys.rocom.merchantSubscriptions;
const subscriptionStoreFileName = 'rocom-merchant-subscriptions.json';

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeItems(items: unknown): string[] {
  const output: string[] = [];
  const seen = new Set<string>();

  for (const item of Array.isArray(items) ? items : []) {
    const text = normalizeText(item);

    if (!text || seen.has(text)) {
      continue;
    }

    seen.add(text);
    output.push(text);
  }

  return output;
}

async function getDefaultMerchantItems(): Promise<string[]> {
  const merchant = (await readRocomConfig()).merchant as Record<string, unknown> | undefined;
  const values = normalizeItems(merchant?.subscription_default_items);

  return values.length > 0 ? values : ['国王球', '棱镜球', '炫彩精灵蛋'];
}

export function parseMerchantSubscriptionArgs(rawText = ''): { mentionAll: boolean | null; tokens: string[] } {
  const text = normalizeText(rawText);

  if (!text) {
    return { mentionAll: null, tokens: [] };
  }

  const tokens = text.split(/\s+/u);
  let mentionAll: boolean | null = null;
  let rest = tokens;

  if (rest[0] === '0' || rest[0] === '1') {
    mentionAll = rest[0] === '1';
    rest = rest.slice(1);
  }

  return {
    mentionAll,
    tokens: rest.filter(Boolean)
  };
}

export async function getMerchantSubscriptionCron(): Promise<string> {
  const merchant = (await readRocomConfig()).merchant as Record<string, unknown> | undefined;
  const value = normalizeText(merchant?.subscription_cron);

  return value || '0 */5 * * * *';
}

function normalizeSubscription(key = '', payload: Record<string, unknown> = {}): MerchantSubscription {
  return {
    key: normalizeText(key),
    group_id: normalizeText(payload.group_id ?? payload.groupId),
    bot_id: normalizeText(payload.bot_id ?? payload.botId),
    mention_all: payload.mention_all === true || payload.mentionAll === true,
    mode: payload.mode === 'all' ? 'all' : 'items',
    items: normalizeItems(payload.items),
    last_push_round: normalizeText(payload.last_push_round ?? payload.lastPushRound),
    last_matched_items: normalizeItems(payload.last_matched_items ?? payload.lastMatchedItems),
    updated_by: normalizeText(payload.updated_by ?? payload.updatedBy),
    updated_at: normalizeText(payload.updated_at ?? payload.updatedAt ?? new Date().toISOString())
  };
}

async function readAllSubscriptions(): Promise<Record<string, MerchantSubscription>> {
  const payload = await readRuntimeStore<Record<string, Record<string, unknown>>>(subscriptionStoreKey, subscriptionStoreFileName, {});

  return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, normalizeSubscription(key, value)]));
}

async function writeAllSubscriptions(payload: Record<string, MerchantSubscription>): Promise<void> {
  await writeRuntimeStore(subscriptionStoreKey, subscriptionStoreFileName, payload);
}

export function getAllMerchantSubscriptions(): Promise<Record<string, MerchantSubscription>> {
  return readAllSubscriptions();
}

export async function upsertMerchantSubscription(key: string, payload: Record<string, unknown>): Promise<MerchantSubscription> {
  const all = await readAllSubscriptions();

  all[key] = normalizeSubscription(key, payload);
  await writeAllSubscriptions(all);

  return all[key];
}

function getEventValue(event: { current: Record<string, unknown> }, keys: string[]): string {
  for (const key of keys) {
    const value = normalizeText(event.current[key]);

    if (value) {
      return value;
    }
  }

  return '';
}

function resolveMerchantScope(event: { current: Record<string, unknown> }): MerchantScope {
  const userId = getEventValue(event, ['UserId', 'user_id']);
  const botId = getEventValue(event, ['BotId', 'SelfId', 'bot_id', 'self_id']) || 'bot';
  const groupId = getEventValue(event, ['GroupId', 'ChannelId', 'GuildId', 'group_id', 'channel_id', 'guild_id']);

  if (!groupId || groupId === userId) {
    throw new Error('订阅远行商人仅支持群聊使用');
  }

  return {
    botId,
    groupId,
    userId
  };
}

export function buildMerchantSubscriptionKey(botId: string, groupId: string): string {
  const normalizedBotId = normalizeText(botId) || 'bot';
  const normalizedGroupId = normalizeText(groupId);

  if (!normalizedGroupId) {
    throw new Error('缺少群号，无法生成远行商人订阅键');
  }

  return `${normalizedBotId}:${normalizedGroupId}`;
}

export async function subscribeRocomMerchant(event: { current: Record<string, unknown> }, rawArgs = ''): Promise<string> {
  const scope = resolveMerchantScope(event);
  const parsed = parseMerchantSubscriptionArgs(rawArgs);
  const key = buildMerchantSubscriptionKey(scope.botId, scope.groupId);
  const previous = (await getAllMerchantSubscriptions())[key];
  const catalog = await getMerchantCatalog();
  const resolved = resolveMerchantSelection(parsed.tokens, catalog);
  const wantAll = resolved.all;
  const hasInput = resolved.all || parsed.tokens.length > 0;

  if (hasInput && !wantAll && resolved.names.length === 0) {
    return [`没有识别到可订阅的商品：${resolved.unknownIndexes.join('、') || parsed.tokens.join('、')}`, '先用 +商人商品 查看商品序号，再按序号订阅。'].join(
      '\n'
    );
  }

  let mode: MerchantSubscription['mode'] = 'items';
  let selectedItems: string[] = [];
  let sourceHint = '';

  if (wantAll) {
    mode = 'all';
    sourceHint = '全物品订阅';
  } else if (resolved.names.length > 0) {
    mode = 'items';
    selectedItems = resolved.names;
    sourceHint = '本次指定';
  } else if (previous && (previous.mode === 'all' || previous.items.length > 0)) {
    mode = previous.mode;
    selectedItems = previous.items;
    sourceHint = '沿用上次配置';
  } else {
    mode = 'items';
    selectedItems = await getDefaultMerchantItems();
    sourceHint = '默认商品配置';
  }

  const mentionAll = parsed.mentionAll === null ? previous?.mention_all === true : parsed.mentionAll;

  await upsertMerchantSubscription(key, {
    ...previous,
    group_id: scope.groupId,
    bot_id: scope.botId,
    mention_all: mentionAll,
    mode,
    items: selectedItems,
    updated_by: scope.userId,
    updated_at: new Date().toISOString()
  });

  const lines: string[] = [];

  if (mode === 'all') {
    lines.push('已订阅远行商人（本群）：全物品订阅，每轮只要有商品上架就推送。');
  } else {
    lines.push(`已订阅远行商人（本群）：共监听 ${selectedItems.length} 件商品。`);
    lines.push(`监听商品：${describeMerchantItems(selectedItems, catalog)}`);
  }

  lines.push(`商品来源：${sourceHint}。`);
  lines.push(mentionAll ? '命中后会尝试 @全体。' : '命中后不会 @全体。');

  if (resolved.unknownIndexes.length > 0) {
    lines.push(`未找到的序号：${resolved.unknownIndexes.join('、')}（已忽略）。`);
  }

  if (resolved.unrecognizedNames.length > 0) {
    lines.push(`商品目录里没有：${resolved.unrecognizedNames.join('、')}（已按原名订阅）。`);
  }

  lines.push('');
  lines.push('可用格式：');
  lines.push('+订阅远行商人 1 3 国王球  按序号或名称订阅商品');
  lines.push('+订阅远行商人 全部  订阅全物品，任意商品上架都推送');
  lines.push('+订阅远行商人 @全体 1 3  命中后尝试 @全体');
  lines.push('+商人商品  查看商品序号');
  lines.push('+取消订阅远行商人  取消订阅');

  return lines.join('\n');
}

export async function unsubscribeRocomMerchant(event: { current: Record<string, unknown> }): Promise<string> {
  const scope = resolveMerchantScope(event);
  const key = buildMerchantSubscriptionKey(scope.botId, scope.groupId);
  const all = await readAllSubscriptions();

  if (!all[key]) {
    return '本群当前没有远行商人订阅。';
  }

  const { [key]: _removed, ...rest } = all;

  await writeAllSubscriptions(rest);

  return '已取消本群远行商人订阅。';
}

async function sendMerchantSubscriptionMessage(
  subscription: MerchantSubscription,
  matchedItems: string[],
  roundInfo: { current: number | null; total: number; countdown: string },
  image: Buffer | null
) {
  const format = Format.create();
  const md = Format.createMarkdown();

  if (subscription.mention_all) {
    md.addMention();
    md.addNewline();
  }

  md.addText(subscription.mode === 'all' ? `远行商人本轮上新：${matchedItems.join('、')}` : `远行商人本轮命中订阅商品：${matchedItems.join('、')}`);
  md.addNewline();
  md.addText(`轮次：第 ${roundInfo.current ?? '未开放'} / ${roundInfo.total} 轮`);
  md.addNewline();
  md.addText(`剩余：${roundInfo.countdown}`);
  format.addMarkdown(md);

  if (image) {
    format.addImage(image);
  }

  await MessageDirect.create().sendToChannel({
    SpaceId: subscription.group_id,
    format
  });
}

export async function checkRocomMerchantSubscriptions(): Promise<void> {
  const subscriptions = await getAllMerchantSubscriptions();
  const entries = Object.entries(subscriptions);

  if (entries.length === 0) {
    return;
  }

  const requestOwner = normalizeText(entries.find(([, item]) => normalizeText(item?.updated_by))?.[1]?.updated_by);
  const payload = await fetchRocomMerchantMergedInfo(requestOwner);
  const roundInfo = getCurrentMerchantRound();
  const goods = buildRocomMerchantRoundCardData(payload);
  const productNameSet = new Set(goods.goods.map(item => normalizeText(item.goodsName)).filter(Boolean));

  if (!roundInfo.isOpen || productNameSet.size === 0) {
    return;
  }

  let image: Buffer | null = null;

  try {
    const rendered = await renderComponentIsHtmlToBuffer(RocomMerchantRoundCard, { data: goods });

    if (typeof rendered !== 'boolean') {
      image = rendered;
    }
  } catch (error) {
    logger.warn(`[rocom] 远行商人订阅图片渲染失败：${error instanceof Error ? error.message : error}`);
  }

  for (const [key, subscription] of entries) {
    if (normalizeText(subscription.last_push_round) === roundInfo.roundId) {
      continue;
    }

    const subscriptionMode = subscription.mode === 'all' ? 'all' : 'items';
    let matchedItems: string[] = [];

    if (subscriptionMode === 'all') {
      matchedItems = [...productNameSet];
    } else {
      const configuredItems = subscription.items.length > 0 ? subscription.items : await getDefaultMerchantItems();

      matchedItems = configuredItems.filter(item => productNameSet.has(normalizeText(item)));

      if (matchedItems.length === 0) {
        continue;
      }
    }

    try {
      await sendMerchantSubscriptionMessage(subscription, matchedItems, roundInfo, image);
      await upsertMerchantSubscription(key, {
        ...subscription,
        last_push_round: roundInfo.roundId,
        last_matched_items: matchedItems,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      logger.warn(`[rocom] 远行商人订阅推送失败：${subscription.group_id} ${error instanceof Error ? error.message : error}`);
    }
  }
}
