import { storeKeys } from '../constants/storeKeys.js';
import { fetchRocomMerchantInfo, extractMerchantProducts, getCurrentMerchantRound } from './rocomMerchant.js';
import { readRuntimeStore, writeRuntimeStore } from './runtimeStore.js';
import { readRocomConfig } from './wegameResource.js';
import { Format, MessageDirect } from 'alemonjs';

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
function splitMerchantSubscriptionItems(rawText = '') {
    return normalizeItems(String(rawText || '').split(/[\s,，、/|；;]+/u));
}
function parseMerchantSubscriptionArgs(rawText = '') {
    const text = normalizeText(rawText);
    if (!text) {
        return {
            mentionAll: false,
            customItems: null
        };
    }
    const tokens = text.split(/\s+/, 2);
    let mentionAll = false;
    let itemsText = text;
    if (tokens[0] === '0' || tokens[0] === '1') {
        mentionAll = tokens[0] === '1';
        itemsText = text.slice(tokens[0].length).trim();
    }
    const customItems = splitMerchantSubscriptionItems(itemsText);
    return {
        mentionAll,
        customItems: customItems.length > 0 ? customItems : null
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
async function subscribeRocomMerchant(event, rawArgs = '') {
    const scope = resolveMerchantScope(event);
    const parsed = parseMerchantSubscriptionArgs(rawArgs);
    const selectedItems = parsed.customItems ?? (await getDefaultMerchantItems());
    const key = buildMerchantSubscriptionKey(scope.botId, scope.groupId);
    const all = await readAllSubscriptions();
    all[key] = normalizeSubscription(key, {
        ...all[key],
        group_id: scope.groupId,
        bot_id: scope.botId,
        mention_all: parsed.mentionAll,
        items: selectedItems,
        updated_by: scope.userId,
        updated_at: new Date().toISOString()
    });
    await writeAllSubscriptions(all);
    const sourceHint = parsed.customItems ? '本群自定义商品' : '默认商品配置';
    return [
        '已订阅远行商人。',
        `监听商品：${selectedItems.join('、')}（${sourceHint}）`,
        parsed.mentionAll ? '命中后会尝试 @全体。' : '命中后不会 @全体。',
        '可用格式：+订阅远行商人 1 国王球 棱镜球 / +取消订阅远行商人'
    ].join('\n');
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
async function sendMerchantSubscriptionMessage(subscription, matchedItems, roundInfo) {
    const format = Format.create();
    const md = Format.createMarkdown();
    if (subscription.mention_all) {
        md.addMention();
        md.addNewline();
    }
    md.addText(`远行商人本轮命中订阅商品：${matchedItems.join('、')}`);
    md.addNewline();
    md.addText(`轮次：第 ${roundInfo.current ?? '未开放'} / ${roundInfo.total} 轮`);
    md.addNewline();
    md.addText(`剩余：${roundInfo.countdown}`);
    format.addMarkdown(md);
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
    const payload = await fetchRocomMerchantInfo(true);
    const { products } = extractMerchantProducts(payload);
    const roundInfo = getCurrentMerchantRound();
    if (!roundInfo.isOpen || products.length === 0) {
        return;
    }
    const productNameSet = new Set(products.map(item => normalizeText(item.name)).filter(Boolean));
    for (const [key, subscription] of entries) {
        const configuredItems = subscription.items.length > 0 ? subscription.items : await getDefaultMerchantItems();
        const matchedItems = configuredItems.filter(item => productNameSet.has(normalizeText(item)));
        if (matchedItems.length === 0) {
            continue;
        }
        if (normalizeText(subscription.last_push_round) === roundInfo.roundId) {
            continue;
        }
        try {
            await sendMerchantSubscriptionMessage(subscription, matchedItems, roundInfo);
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

export { buildMerchantSubscriptionKey, checkRocomMerchantSubscriptions, getAllMerchantSubscriptions, getMerchantSubscriptionCron, parseMerchantSubscriptionArgs, subscribeRocomMerchant, unsubscribeRocomMerchant, upsertMerchantSubscription };
