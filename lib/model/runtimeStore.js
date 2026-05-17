import fs from 'node:fs';
import { getIoRedis } from '@alemonjs/db';
import { getStoreKeyFormat } from '../constants/storeKeys.js';
import YAML from 'yaml';

const runtimeStoreRoot = '.data/runtime-store';
const fallbackDir = runtimeStoreRoot;
let redisDisabledReason = '';
let redisFailureLogged = false;
function getRuntimeStoreFilePath(fileName) {
    return `${runtimeStoreRoot}/${fileName}`;
}
function normalizeText(value) {
    return String(value ?? '').trim();
}
function disableRedis(reason) {
    if (redisDisabledReason) {
        return;
    }
    redisDisabledReason = normalizeText(reason) || 'unknown';
    try {
        const redis = getIoRedis();
        redis.disconnect();
    }
    catch {
    }
    if (!redisFailureLogged) {
        logger.warn(`[runtime-store] Redis 不可用，已切换为文件存储：${redisDisabledReason}`);
        redisFailureLogged = true;
    }
}
function probeRedisConnection() {
    if (process.env.ALEMONJS_RUNTIME_STORE_DRIVER === 'file') {
        disableRedis('环境变量指定 file 模式');
        return false;
    }
    if (redisDisabledReason) {
        return false;
    }
    return true;
}
function inferStoreFormat(key, fileName) {
    if (key) {
        return getStoreKeyFormat(key);
    }
    return fileName.endsWith('.yaml') ? 'yaml' : 'json';
}
function deserializeStoreValue(content, format, defaultValue) {
    try {
        if (format === 'yaml') {
            const parsed = YAML.parse(content);
            return (parsed ?? defaultValue);
        }
        return JSON.parse(content);
    }
    catch {
        return defaultValue;
    }
}
function serializeStoreValue(value, format) {
    return format === 'yaml' ? YAML.stringify(value) : JSON.stringify(value, null, 2);
}
function readStructuredFile(filePath, defaultValue, format) {
    if (!fs.existsSync(filePath)) {
        return defaultValue;
    }
    try {
        return deserializeStoreValue(fs.readFileSync(filePath, 'utf8'), format, defaultValue);
    }
    catch {
        return defaultValue;
    }
}
function readFallbackFile(key, fileName, defaultValue) {
    return readStructuredFile(getRuntimeStoreFilePath(fileName), defaultValue, inferStoreFormat(key, fileName));
}
function writeFallbackFile(key, fileName, value) {
    const filePath = getRuntimeStoreFilePath(fileName);
    fs.mkdirSync(fallbackDir, { recursive: true });
    fs.writeFileSync(filePath, serializeStoreValue(value, inferStoreFormat(key, fileName)), 'utf8');
}
async function getRedisValue(key) {
    if (redisDisabledReason) {
        return null;
    }
    if (!probeRedisConnection()) {
        return null;
    }
    try {
        const redis = getIoRedis();
        return await redis.get(key);
    }
    catch (error) {
        disableRedis(`${key} ${error instanceof Error ? error.message : error}`);
        return null;
    }
}
async function setRedisValue(key, value) {
    if (redisDisabledReason) {
        return false;
    }
    if (!probeRedisConnection()) {
        return false;
    }
    try {
        const redis = getIoRedis();
        await redis.set(key, value);
        return true;
    }
    catch (error) {
        disableRedis(`${key} ${error instanceof Error ? error.message : error}`);
        return false;
    }
}
async function readRuntimeStore(key, fileName, defaultValue) {
    const redisValue = await getRedisValue(key);
    const format = inferStoreFormat(key, fileName);
    if (redisValue) {
        try {
            return deserializeStoreValue(redisValue, format, defaultValue);
        }
        catch {
            logger.warn(`[runtime-store] Redis 数据格式不合法，改用文件回退：${key}`);
        }
    }
    const fallbackValue = readFallbackFile(key, fileName, defaultValue);
    if (JSON.stringify(fallbackValue) !== JSON.stringify(defaultValue)) {
        return fallbackValue;
    }
    return defaultValue;
}
async function writeRuntimeStore(key, fileName, value) {
    const payload = serializeStoreValue(value, inferStoreFormat(key, fileName));
    const stored = await setRedisValue(key, payload);
    if (stored) {
        return;
    }
    writeFallbackFile(key, fileName, value);
}

export { readRuntimeStore, writeRuntimeStore };
