import { Expose, getConfigValue, getCurrentEvent, ExposeError } from 'alemonjs';
import { getWeGameUserContext } from '../model/wegameAccount.js';

function currentUser(context) {
    const root = getConfigValue();
    const config = root['alemonjs-roco']?.expose;
    const allowed = config?.allowed_callers;
    const event = getCurrentEvent();
    if ((config !== undefined && (!config || typeof config !== 'object' || Array.isArray(config))) ||
        (config?.enabled !== undefined && config.enabled !== true) ||
        (allowed !== undefined && (!Array.isArray(allowed) || !allowed.every(item => typeof item === 'string' && item.length > 0 && item.trim() === item))) ||
        !context.callerApp ||
        (allowed !== undefined && !allowed.includes(context.callerApp)) ||
        !event ||
        !['message.create', 'private.message.create'].includes(event.name) ||
        ![event.Platform, event.BotId, event.UserId].every(value => typeof value === 'string' && value.trim().length > 0)) {
        throw new ExposeError('FORBIDDEN', '当前调用方或消息身份未获洛克查询授权');
    }
    context.signal.throwIfAborted();
    return getWeGameUserContext({ current: event });
}
const emptyInput = { type: 'object', properties: {}, additionalProperties: false };
const keywordInput = {
    type: 'object',
    properties: { keyword: { type: 'string', minLength: 1, maxLength: 100 } },
    required: ['keyword'],
    additionalProperties: false
};
function action(description, inputSchema, outputSchema, handler, effect = 'read') {
    return Expose.action({
        description,
        effect,
        inputSchema,
        outputSchema,
        authorize: (_input, context) => {
            currentUser(context);
            return true;
        },
        handler: (input, context) => handler(input, currentUser(context), context)
    });
}
function query(description, inputSchema, handler, effect = 'read') {
    return action(description, inputSchema, object({ status: { type: 'string', enum: ['success'] }, text: { type: 'string' } }, ['status', 'text']), async (input, user) => ({ status: 'success', text: await handler(input, user) }), effect);
}
function dataQuery(description, inputSchema, dataSchema, handler, effect = 'read') {
    return action(description, inputSchema, object({ status: { type: 'string', enum: ['success'] }, data: dataSchema }, ['status', 'data']), async (input, user, context) => ({ status: 'success', data: await handler(input, user, context) }), effect);
}
function object(properties, required = []) {
    return { type: 'object', properties, required, additionalProperties: false };
}
const text = { type: 'string', minLength: 1, maxLength: 2000 };
const page = { type: 'integer', minimum: 1, maximum: 50 };
function uid(value) {
    if (!/^\d+$/u.test(value)) {
        throw new ExposeError('INVALID_INPUT', 'UID 必须为纯数字');
    }
    return value;
}
const stringSchema = { type: 'string' };
const numberSchema = { type: 'number' };
const booleanSchema = { type: 'boolean' };
function array(items) {
    return { type: 'array', items };
}
function record(properties) {
    return object(properties, Object.keys(properties));
}
function strings(...keys) {
    return Object.fromEntries(keys.map(key => [key, stringSchema]));
}

export { action, array, booleanSchema, currentUser, dataQuery, emptyInput, keywordInput, numberSchema, object, page, query, record, stringSchema, strings, text, uid };
