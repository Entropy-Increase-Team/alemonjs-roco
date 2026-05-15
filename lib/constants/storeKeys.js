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
        merchantSubscriptions: buildDataStoreKey('json', 'rocom', 'merchant-subscriptions')
    }
};

export { buildDataStoreKey, getStoreKeyFormat, storeKeys };
