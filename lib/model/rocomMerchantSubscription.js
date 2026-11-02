import { storeKeys } from '../constants/storeKeys.js';
import RocomMerchantRoundCard from '../img/views/RocomMerchantRoundCard.js';
import { getCurrentMerchantRound } from './rocomMerchant.js';
import { fetchRocomMerchantMergedInfo, buildRocomMerchantRoundCardData } from './rocomMerchantRealtime.js';
import { getMerchantCatalog, resolveMerchantSelection, describeMerchantItems } from './rocomMerchantCatalog.js';
import { readRuntimeStore, writeRuntimeStore } from './runtimeStore.js';
import { readRocomConfig } from './wegameResource.js';
import { Format, MessageDirect } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

const subscriptionStoreKey = storeKeys.rocom.merchantSubscriptions;
const subscriptionStoreFileName = 'rocom-merchant-subscriptions.json';
function normalizeText(value) {
    return String(value ?? '').trim();
}
function normalizeItems(items) {
    const output = [];
    const seen = new Set();
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
async function getDefaultMerchantItems() {
    const merchant = (await readRocomConfig()).merchant;
    const values = normalizeItems(merchant?.subscription_default_items);
    return values.length > 0 ? values : ['国王球', '棱镜球', '炫彩精灵蛋'];
}
function parseMerchantSubscriptionArgs(rawText = '') {
    const text = normalizeText(rawText);
    if (!text) {
        return { mentionAll: null, tokens: [] };
    }
    const tokens = text.split(/\s+/u);
    let mentionAll = null;
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
async function getMerchantSubscriptionCron() {
    const merchant = (await readRocomConfig()).merchant;
    const value = normalizeText(merchant?.subscription_cron);
    return value || '0 */5 * * * *';
}
function normalizeSubscription(key = '', payload = {}) {
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
async function readAllSubscriptions() {
    const payload = await readRuntimeStore(subscriptionStoreKey, subscriptionStoreFileName, {});
    return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, normalizeSubscription(key, value)]));
}
async function writeAllSubscriptions(payload) {
    await writeRuntimeStore(subscriptionStoreKey, subscriptionStoreFileName, payload);
}
function getAllMerchantSubscriptions() {
    return readAllSubscriptions();
}
async function upsertMerchantSubscription(key, payload) {
    const all = await readAllSubscriptions();
    all[key] = normalizeSubscription(key, payload);
    await writeAllSubscriptions(all);
    return all[key];
}
function getEventValue(event, keys) {
    for (const key of keys) {
        const value = normalizeText(event.current[key]);
        if (value) {
            return value;
        }
    }
    return '';
}
function resolveMerchantScope(event) {
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
function buildMerchantSubscriptionKey(botId, groupId) {
    const normalizedBotId = normalizeText(botId) || 'bot';
    const normalizedGroupId = normalizeText(groupId);
    if (!normalizedGroupId) {
        throw new Error('缺少群号，无法生成远行商人订阅键');
    }
    return `${normalizedBotId}:${normalizedGroupId}`;
}
async function subscribeRocomMerchantResult(event, rawArgs = '', selection) {
    const scope = resolveMerchantScope(event);
    const parsed = selection ?? parseMerchantSubscriptionArgs(rawArgs);
    const key = buildMerchantSubscriptionKey(scope.botId, scope.groupId);
    const previous = (await getAllMerchantSubscriptions())[key];
    const catalog = await getMerchantCatalog();
    const resolved = resolveMerchantSelection(parsed.tokens, catalog);
    const wantAll = resolved.all;
    const hasInput = resolved.all || parsed.tokens.length > 0;
    if (hasInput && !wantAll && resolved.names.length === 0) {
        return {
            status: 'rejected',
            text: [`没有识别到可订阅的商品：${resolved.unknownIndexes.join('、') || parsed.tokens.join('、')}`, '先用 +商人商品 查看商品序号，再按序号订阅。'].join('\n'),
            items: [],
            unknownIndexes: resolved.unknownIndexes,
            mode: 'items'
        };
    }
    let mode = 'items';
    let selectedItems = [];
    let sourceHint = '';
    if (wantAll) {
        mode = 'all';
        sourceHint = '全物品订阅';
    }
    else if (resolved.names.length > 0) {
        mode = 'items';
        selectedItems = resolved.names;
        sourceHint = '本次指定';
    }
    else if (previous && (previous.mode === 'all' || previous.items.length > 0)) {
        mode = previous.mode;
        selectedItems = previous.items;
        sourceHint = '沿用上次配置';
    }
    else {
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
    const lines = [];
    if (mode === 'all') {
        lines.push('已订阅远行商人（本群）：全物品订阅，每轮只要有商品上架就推送。');
    }
    else {
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
    return {
        status: resolved.unknownIndexes.length ? 'partial' : 'success',
        text: lines.join('\n'),
        items: selectedItems,
        unknownIndexes: resolved.unknownIndexes,
        mode
    };
}
async function subscribeRocomMerchant(event, rawArgs = '') {
    return (await subscribeRocomMerchantResult(event, rawArgs)).text;
}
async function unsubscribeRocomMerchant(event) {
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
async function sendMerchantSubscriptionMessage(subscription, matchedItems, roundInfo, image) {
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
async function checkRocomMerchantSubscriptions() {
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
    let image = null;
    try {
        const rendered = await renderComponentIsHtmlToBuffer(RocomMerchantRoundCard, { data: goods });
        if (typeof rendered !== 'boolean') {
            image = rendered;
        }
    }
    catch (error) {
        logger.warn(`[rocom] 远行商人订阅图片渲染失败：${error instanceof Error ? error.message : error}`);
    }
    for (const [key, subscription] of entries) {
        if (normalizeText(subscription.last_push_round) === roundInfo.roundId) {
            continue;
        }
        const subscriptionMode = subscription.mode === 'all' ? 'all' : 'items';
        let matchedItems = [];
        if (subscriptionMode === 'all') {
            matchedItems = [...productNameSet];
        }
        else {
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
        }
        catch (error) {
            logger.warn(`[rocom] 远行商人订阅推送失败：${subscription.group_id} ${error instanceof Error ? error.message : error}`);
        }
    }
}

export { buildMerchantSubscriptionKey, checkRocomMerchantSubscriptions, getAllMerchantSubscriptions, getMerchantSubscriptionCron, parseMerchantSubscriptionArgs, subscribeRocomMerchant, subscribeRocomMerchantResult, unsubscribeRocomMerchant, upsertMerchantSubscription };
