const appName = 'alemonjs-roco';
const dataPrefix = `data:${appName}`;
function normalizeSegments(segments) {
    return segments.map(item => String(item).trim()).filter(Boolean);
}
function buildDataStoreKey(format, ...segments) {
    const suffix = normalizeSegments(segments).join(':');
    return suffix ? `${dataPrefix}:${suffix}.${format}` : `${dataPrefix}.${format}`;
}
function getStoreKeyFormat(key) {
    return key.endsWith('.yaml') ? 'yaml' : 'json';
}
const storeKeys = {
    config: {
        wegameCore: buildDataStoreKey('yaml', 'config', 'wegame-core'),
        rocom: buildDataStoreKey('yaml', 'config', 'rocom')
    },
    wegame: {
        users: buildDataStoreKey('json', 'wegame', 'users')
    },
    rocom: {
        merchantSubscriptions: buildDataStoreKey('json', 'rocom', 'merchant-subscriptions'),
        merchantCatalog: buildDataStoreKey('json', 'rocom', 'merchant-catalog'),
        merchantPriceLog: buildDataStoreKey('json', 'rocom', 'merchant-price-log'),
        eggSubscriptions: buildDataStoreKey('json', 'rocom', 'egg-subscriptions'),
        eggExchangeSubscriptions: buildDataStoreKey('json', 'rocom', 'egg-exchange-subscriptions'),
        bindUid: buildDataStoreKey('json', 'rocom', 'bind-uid')
    }
};

export { buildDataStoreKey, getStoreKeyFormat, storeKeys };
