import { storeKeys } from '../constants/storeKeys.js';
import { readRuntimeStore } from './runtimeStore.js';
import { getWeGameCoreConfigSource, getRocomConfigSource, readWeGameCoreConfig, readRocomConfig } from './wegameResource.js';

const runtimeSubscriptionStoreKey = storeKeys.rocom.merchantSubscriptions;
const runtimeSubscriptionStoreFileName = 'rocom-merchant-subscriptions.json';
function normalizeText(value) {
    return String(value ?? '').trim();
}
function getValueByPath(payload, pathText) {
    const segments = pathText.split('.').filter(Boolean);
    let current = payload;
    for (const segment of segments) {
        if (!current || typeof current !== 'object' || Array.isArray(current)) {
            return undefined;
        }
        current = current[segment];
    }
    return current;
}
function formatValue(value) {
    if (Array.isArray(value)) {
        return value.length > 0
            ? value
                .map(item => normalizeText(item))
                .filter(Boolean)
                .join('、')
            : '[]';
    }
    if (value && typeof value === 'object') {
        return JSON.stringify(value);
    }
    const text = normalizeText(value);
    return text || '未设置';
}
async function getCoreWeGameConfig() {
    const values = await readWeGameCoreConfig();
    return {
        code: 'wegame-core',
        title: 'WeGame 主插件',
        source: getWeGameCoreConfigSource(),
        fields: [
            { field: 'wegame.base_url', label: '后端地址', help: 'WeGame 后端 base_url' },
            { field: 'wegame.api_key', label: 'API Key', help: '开发者 WeGame API Key' },
            { field: 'wegame.client_type', label: '客户端类型', help: 'bot / app / web' },
            { field: 'wegame.client_id', label: '客户端实例 ID', help: '多实例区分字段' },
            { field: 'wegame.device_fingerprint', label: '设备指纹', help: '留空时自动生成' },
            { field: 'wegame.request_timeout_ms', label: '请求超时', help: 'HTTP 请求超时时间，毫秒' },
            { field: 'wegame.login_poll_interval_ms', label: '登录轮询间隔', help: '扫码登录轮询间隔，毫秒' },
            { field: 'wegame.login_timeout_ms', label: '登录超时', help: '等待扫码总超时，毫秒' }
        ],
        values
    };
}
async function getRocomConfig() {
    const values = await readRocomConfig();
    return {
        code: 'rocom',
        title: '洛克模块',
        source: getRocomConfigSource(),
        fields: [
            { field: 'rocom.page_size', label: '精灵列表每页数量', help: '精灵列表分页大小' },
            { field: 'rocom.max_page', label: '最大页码', help: '允许查询的最大页码' },
            { field: 'lineup.detail_search_pages', label: '阵容详情翻页上限', help: '查看阵容详情时最多翻找页数' },
            { field: 'merchant.subscription_cron', label: '远行商人订阅 Cron', help: '订阅轮询 cron 表达式' },
            { field: 'merchant.subscription_default_items', label: '默认监听商品', help: '未自定义时使用的默认商品列表' }
        ],
        values
    };
}
async function getRocomMerchantRuntimeSummary() {
    const payload = await readRuntimeStore(runtimeSubscriptionStoreKey, runtimeSubscriptionStoreFileName, {});
    const rows = Object.values(payload);
    const first = rows[0] && typeof rows[0] === 'object' ? rows[0] : null;
    return {
        code: 'rocom-merchant-runtime',
        title: 'rocom 远行商人订阅运行数据',
        source: `${runtimeSubscriptionStoreKey}（回退：.data/runtime-store/${runtimeSubscriptionStoreFileName}）`,
        fields: [
            { field: 'count', label: '订阅数量', help: '当前已保存的群订阅总数' },
            { field: 'sample.bot_id', label: '示例机器人 ID', help: '首条订阅样本的 bot_id' },
            { field: 'sample.group_id', label: '示例群号', help: '首条订阅样本的 group_id' },
            { field: 'sample.items', label: '示例监听商品', help: '首条订阅样本的商品列表' }
        ],
        values: {
            count: rows.length,
            sample: {
                bot_id: first?.bot_id ?? '',
                group_id: first?.group_id ?? '',
                items: Array.isArray(first?.items) ? first?.items : []
            }
        }
    };
}
function getWeGameConfigRegistry() {
    return [
        {
            code: 'wegame-core',
            title: 'WeGame 主插件',
            source: getWeGameCoreConfigSource(),
            fields: [
                { field: 'wegame.base_url', label: '后端地址', help: 'WeGame 后端 base_url' },
                { field: 'wegame.api_key', label: 'API Key', help: '开发者 WeGame API Key' },
                { field: 'wegame.client_type', label: '客户端类型', help: 'bot / app / web' },
                { field: 'wegame.client_id', label: '客户端实例 ID', help: '多实例区分字段' },
                { field: 'wegame.device_fingerprint', label: '设备指纹', help: '留空时自动生成' },
                { field: 'wegame.request_timeout_ms', label: '请求超时', help: 'HTTP 请求超时时间，毫秒' },
                { field: 'wegame.login_poll_interval_ms', label: '登录轮询间隔', help: '扫码登录轮询间隔，毫秒' },
                { field: 'wegame.login_timeout_ms', label: '登录超时', help: '等待扫码总超时，毫秒' }
            ],
            values: {}
        },
        {
            code: 'rocom',
            title: '洛克模块',
            source: getRocomConfigSource(),
            fields: [
                { field: 'rocom.page_size', label: '精灵列表每页数量', help: '精灵列表分页大小' },
                { field: 'rocom.max_page', label: '最大页码', help: '允许查询的最大页码' },
                { field: 'lineup.detail_search_pages', label: '阵容详情翻页上限', help: '查看阵容详情时最多翻找页数' },
                { field: 'merchant.subscription_cron', label: '远行商人订阅 Cron', help: '订阅轮询 cron 表达式' },
                { field: 'merchant.subscription_default_items', label: '默认监听商品', help: '未自定义时使用的默认商品列表' }
            ],
            values: {}
        },
        {
            code: 'rocom-merchant-runtime',
            title: 'rocom 远行商人订阅运行数据',
            source: `${runtimeSubscriptionStoreKey}（回退：.data/runtime-store/${runtimeSubscriptionStoreFileName}）`,
            fields: [
                { field: 'count', label: '订阅数量', help: '当前已保存的群订阅总数' },
                { field: 'sample.bot_id', label: '示例机器人 ID', help: '首条订阅样本的 bot_id' },
                { field: 'sample.group_id', label: '示例群号', help: '首条订阅样本的 group_id' },
                { field: 'sample.items', label: '示例监听商品', help: '首条订阅样本的商品列表' }
            ],
            values: {}
        }
    ];
}
async function buildWeGameConfigSummary(code) {
    const sections = getWeGameConfigRegistry();
    sections[0] = await getCoreWeGameConfig();
    sections[1] = await getRocomConfig();
    const runtimeSection = code === 'rocom-merchant-runtime' ? await getRocomMerchantRuntimeSummary() : null;
    const targets = code ? sections.filter(item => item.code === code) : sections;
    const resolvedTargets = targets.map(item => (item.code === 'rocom-merchant-runtime' && runtimeSection ? runtimeSection : item));
    if (resolvedTargets.length === 0) {
        return `未找到配置模块：${code}`;
    }
    return resolvedTargets
        .map(section => {
        const lines = [`${section.title}`, `来源：${section.source}`];
        for (const field of section.fields) {
            lines.push(`- ${field.label}：${formatValue(getValueByPath(section.values, field.field))}`);
        }
        return lines.join('\n');
    })
        .join('\n\n');
}
function buildWeGameConfigRegistryText() {
    return getWeGameConfigRegistry()
        .map(section => `- ${section.code} | ${section.title} | ${section.source}`)
        .join('\n');
}

export { buildWeGameConfigRegistryText, buildWeGameConfigSummary, getWeGameConfigRegistry };
