import { storeKeys } from '../constants/storeKeys.js';
import { requestJson, isHttpOk } from './http.js';
import crypto from 'node:crypto';
import os from 'node:os';
import { writeRuntimeStore, readRuntimeStore } from './runtimeStore.js';
import { readWeGameCoreConfig } from './wegameResource.js';

const storeKey = storeKeys.wegame.users;
const storeFileName = 'wegame-users.json';
function normalizeText(value) {
    return String(value ?? '').trim();
}
async function readWeGameConfig() {
    const merged = await readWeGameCoreConfig();
    const wegame = merged.wegame ?? {};
    return {
        base_url: normalizeText(wegame.base_url),
        api_key: normalizeText(wegame.api_key),
        client_type: normalizeText(wegame.client_type ?? 'bot'),
        client_id: normalizeText(wegame.client_id),
        device_fingerprint: normalizeText(wegame.device_fingerprint),
        request_timeout_ms: Number(wegame.request_timeout_ms ?? 15000),
        login_poll_interval_ms: Number(wegame.login_poll_interval_ms ?? 2000),
        login_timeout_ms: Number(wegame.login_timeout_ms ?? 180000)
    };
}
function getDeviceFingerprint(config) {
    if (config.device_fingerprint) {
        return config.device_fingerprint;
    }
    return crypto.createHash('sha256').update(`${os.hostname()}:alemonjs-roco:wegame`).digest('hex').slice(0, 32);
}
async function getStore() {
    const payload = await readRuntimeStore(storeKey, storeFileName, { users: {} });
    return {
        users: payload.users ?? {}
    };
}
function normalizeRole(role) {
    if (!role || typeof role !== 'object') {
        return null;
    }
    const payload = role;
    return {
        id: normalizeText(payload.id),
        openid: normalizeText(payload.openid),
        name: normalizeText(payload.name),
        avatar: normalizeText(payload.avatar),
        create_time: normalizeText(payload.create_time),
        is_online: typeof payload.is_online === 'boolean' ? payload.is_online : undefined,
        level: typeof payload.level === 'number' ? payload.level : undefined,
        star: typeof payload.star === 'number' ? payload.star : undefined
    };
}
function normalizeCredential(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }
    const data = payload;
    const frameworkToken = normalizeText(data.frameworkToken ?? data.framework_token);
    if (!frameworkToken) {
        return null;
    }
    return {
        frameworkToken,
        isValid: data.isValid !== false && data.is_valid !== false,
        isBind: data.isBind !== false && data.is_bind !== false,
        updatedAt: normalizeText(data.updatedAt ?? data.updated_at ?? new Date().toISOString()),
        credentialProvider: normalizeText(data.credentialProvider ?? data.credential_provider),
        tgpId: normalizeText(data.tgpId ?? data.tgp_id),
        loginType: normalizeText(data.loginType ?? data.login_type),
        role: normalizeRole(data.role)
    };
}
function normalizeBinding(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }
    const data = payload;
    const id = normalizeText(data.id);
    const frameworkToken = normalizeText(data.frameworkToken ?? data.framework_token);
    if (!id && !frameworkToken) {
        return null;
    }
    return {
        id,
        frameworkToken,
        tokenType: normalizeText(data.tokenType ?? data.token_type),
        loginType: normalizeText(data.loginType ?? data.login_type),
        credentialProvider: normalizeText(data.credentialProvider ?? data.credential_provider),
        clientType: normalizeText(data.clientType ?? data.client_type),
        tgpId: normalizeText(data.tgpId ?? data.tgp_id),
        roleId: normalizeText(data.roleId ?? data.role_id),
        roleOpenid: normalizeText(data.roleOpenid ?? data.role_openid),
        nickname: normalizeText(data.nickname),
        avatar: normalizeText(data.avatar),
        isPrimary: data.isPrimary === true || data.is_primary === true,
        isValid: data.isValid !== false && data.is_valid !== false,
        createdAt: normalizeText(data.createdAt ?? data.created_at),
        updatedAt: normalizeText(data.updatedAt ?? data.updated_at)
    };
}
async function getUserState(userKey) {
    const store = await getStore();
    return (store.users[userKey] ?? {
        lastCredential: null,
        updatedAt: ''
    });
}
async function setUserState(userKey, state) {
    const store = await getStore();
    const current = store.users[userKey] ?? {
        lastCredential: null,
        updatedAt: ''
    };
    const next = {
        ...current,
        ...state,
        updatedAt: new Date().toISOString()
    };
    store.users[userKey] = next;
    await writeRuntimeStore(storeKey, storeFileName, store);
    return next;
}
function createRequestError(message) {
    return new Error(message);
}
async function request(urlPath, options = {}) {
    const config = await readWeGameConfig();
    if (!config.base_url) {
        throw createRequestError('缺少 WeGame 后端地址，请写入 WeGame 运行配置 wegame.base_url，或设置环境变量 WEGAME_BASE_URL');
    }
    const url = new URL(`${config.base_url}${urlPath}`);
    const params = {
        device_fingerprint: getDeviceFingerprint(config),
        ...(options.params ?? {})
    };
    for (const [key, value] of Object.entries(params)) {
        if (normalizeText(value)) {
            url.searchParams.set(key, value);
        }
    }
    const headers = {
        'Content-Type': 'application/json',
        'X-Device-Fingerprint': getDeviceFingerprint(config),
        'X-Device-Id': getDeviceFingerprint(config),
        ...(options.headers ?? {})
    };
    if (config.api_key) {
        headers['X-API-Key'] = config.api_key;
    }
    const response = await requestJson({
        url: String(url),
        method: options.method ?? 'GET',
        headers,
        data: options.data ? { device_fingerprint: getDeviceFingerprint(config), ...options.data } : undefined,
        timeout: config.request_timeout_ms
    });
    const body = response.data ?? null;
    if (!isHttpOk(response.status)) {
        throw createRequestError(body?.message ?? `请求失败：HTTP ${response.status}`);
    }
    if (!body || typeof body !== 'object') {
        throw createRequestError('接口返回为空');
    }
    if (Number(body.code) !== 0) {
        throw createRequestError(body.message ?? `请求失败：业务码 ${body.code ?? 'unknown'}`);
    }
    return (body.data ?? {});
}
function getUserScopedHeaders(userIdentifier) {
    const headers = {};
    if (userIdentifier) {
        headers['X-User-Identifier'] = userIdentifier;
    }
    return headers;
}
function getClientScopeParams(config) {
    const params = {};
    if (config.client_type) {
        params.client_type = config.client_type;
    }
    if (config.client_id) {
        params.client_id = config.client_id;
    }
    return params;
}
function bindingToCredential(binding) {
    if (!binding?.frameworkToken) {
        return null;
    }
    return normalizeCredential({
        frameworkToken: binding.frameworkToken,
        tgpId: binding.tgpId,
        isValid: binding.isValid,
        loginType: binding.loginType,
        credentialProvider: binding.credentialProvider,
        updatedAt: binding.updatedAt,
        role: {
            id: binding.roleId,
            openid: binding.roleOpenid,
            name: binding.nickname,
            avatar: binding.avatar
        }
    });
}
function mergeCredential(baseCredential, overrideCredential) {
    if (!baseCredential && !overrideCredential) {
        return null;
    }
    if (!baseCredential) {
        return overrideCredential;
    }
    if (!overrideCredential) {
        return baseCredential;
    }
    return normalizeCredential({
        ...baseCredential,
        ...overrideCredential,
        role: {
            ...(baseCredential.role ?? {}),
            ...(overrideCredential.role ?? {})
        }
    });
}
function getWeGameUserContext(event) {
    const platform = normalizeText(event.current.Platform ?? 'unknown');
    const botId = normalizeText(event.current.BotId ?? 'bot');
    const userId = normalizeText(event.current.UserId);
    return {
        userKey: `${platform}:${botId}:${userId}`,
        userIdentifier: userId
    };
}
async function getWeGameRuntimeConfig() {
    return await readWeGameConfig();
}
function requestWeGame(urlPath, options = {}) {
    return request(urlPath, options);
}
async function createWeGameLogin(userIdentifier, platform) {
    const config = await readWeGameConfig();
    if (!config.api_key) {
        throw new Error('请先在 alemon.config.yaml 的 alemonjs-roco.wegame.api_key 中写入 WeGame API Key');
    }
    const pathName = platform === 'wechat' ? '/api/v1/login/wegame/wechat/qr' : '/api/v1/login/wegame/qr';
    return request(pathName, {
        method: 'GET',
        headers: getUserScopedHeaders(userIdentifier),
        params: {
            user_identifier: userIdentifier,
            ...getClientScopeParams(config)
        }
    });
}
async function waitWeGameLogin(userIdentifier, userKey, platform, frameworkToken, options = {}) {
    const config = await readWeGameConfig();
    const statusPath = platform === 'wechat' ? '/api/v1/login/wegame/wechat/status' : '/api/v1/login/wegame/status';
    const tokenPath = platform === 'wechat' ? '/api/v1/login/wegame/wechat/token' : '/api/v1/login/wegame/token';
    const startedAt = Date.now();
    let lastStatus = '';
    while (Date.now() - startedAt < config.login_timeout_ms) {
        const statusPayload = await request(statusPath, {
            method: 'GET',
            headers: {
                'X-Framework-Token': frameworkToken,
                ...getUserScopedHeaders(userIdentifier)
            },
            params: {
                user_identifier: userIdentifier,
                ...getClientScopeParams(config)
            }
        });
        const status = normalizeText(statusPayload.status).toLowerCase();
        if (status && status !== lastStatus) {
            lastStatus = status;
            await options.onStatusChange?.(status);
        }
        if (status === 'done' || Number(statusPayload.code) === 0) {
            const credentialPayload = await request(tokenPath, {
                method: 'GET',
                headers: {
                    'X-Framework-Token': frameworkToken,
                    ...getUserScopedHeaders(userIdentifier)
                },
                params: {
                    user_identifier: userIdentifier,
                    ...getClientScopeParams(config)
                }
            });
            const credential = normalizeCredential(credentialPayload);
            if (!credential) {
                throw new Error('登录成功，但凭证数据不完整');
            }
            await setUserState(userKey, { lastCredential: credential });
            return credential;
        }
        if (status === 'expired') {
            throw new Error('二维码已过期，请重新发送登录指令');
        }
        await new Promise(resolve => setTimeout(resolve, config.login_poll_interval_ms));
    }
    throw new Error('等待扫码结果超时，请重新发送登录指令');
}
async function getWeGameBindings(userIdentifier) {
    const config = await readWeGameConfig();
    if (!config.api_key) {
        throw new Error('缺少 WeGame API Key，请检查 alemon.config.yaml -> alemonjs-roco.wegame.api_key');
    }
    const payload = await request('/api/v1/user/bindings', {
        method: 'GET',
        headers: getUserScopedHeaders(userIdentifier),
        params: {
            user_identifier: userIdentifier,
            ...getClientScopeParams(config)
        }
    });
    return (payload.bindings ?? []).map(item => normalizeBinding(item)).filter((item) => Boolean(item));
}
function pickActiveBinding(bindings) {
    return (bindings.find(item => item.isPrimary && item.isValid) ?? bindings.find(item => item.isValid) ?? bindings.find(item => item.isPrimary) ?? bindings[0] ?? null);
}
async function syncWeGameBindings(context) {
    const bindings = await getWeGameBindings(context.userIdentifier);
    const active = pickActiveBinding(bindings);
    const currentState = await getUserState(context.userKey);
    await setUserState(context.userKey, {
        lastCredential: mergeCredential(currentState.lastCredential, bindingToCredential(active))
    });
    return bindings;
}
async function setPrimaryWeGameBinding(userIdentifier, bindingId) {
    const config = await readWeGameConfig();
    await request(`/api/v1/user/bindings/${encodeURIComponent(bindingId)}/primary`, {
        method: 'POST',
        headers: getUserScopedHeaders(userIdentifier),
        params: {
            user_identifier: userIdentifier,
            ...getClientScopeParams(config)
        }
    });
}
async function deleteWeGameBinding(userIdentifier, bindingId) {
    const config = await readWeGameConfig();
    await request(`/api/v1/user/bindings/${encodeURIComponent(bindingId)}`, {
        method: 'DELETE',
        headers: getUserScopedHeaders(userIdentifier),
        params: {
            user_identifier: userIdentifier,
            ...getClientScopeParams(config)
        }
    });
}
function formatLoginType(loginType) {
    const value = normalizeText(loginType).toLowerCase();
    if (value === 'qq') {
        return 'QQ扫码';
    }
    if (value === 'wechat') {
        return '微信扫码';
    }
    if (value === 'manual') {
        return '手动导入';
    }
    return value || '未返回';
}
function getBindingName(binding) {
    return binding.nickname || binding.roleId || binding.tgpId || '未命名账号';
}
function formatBindingTime(value) {
    const text = normalizeText(value);
    if (!text) {
        return '未返回';
    }
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
        return text;
    }
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
function buildBindingsText(bindings) {
    return bindings
        .map((binding, index) => {
        const tags = [];
        if (binding.isPrimary) {
            tags.push('主账号');
        }
        tags.push(binding.isValid ? '有效' : '失效');
        return [
            `${index + 1}. ${getBindingName(binding)}`,
            `状态：${tags.join(' | ')}`,
            `登录方式：${formatLoginType(binding.loginType)}`,
            `TGP ID：${binding.tgpId || '未返回'}`,
            `更新时间：${formatBindingTime(binding.updatedAt)}`,
            binding.roleId ? `角色ID：${binding.roleId}` : ''
        ]
            .filter(Boolean)
            .join('\n');
    })
        .join('\n\n');
}
function buildBindingBadges(binding) {
    const badges = [];
    if (binding.isPrimary) {
        badges.push({ text: '主账号', type: 'primary' });
    }
    badges.push({
        text: binding.isValid ? '有效' : '失效',
        type: binding.isValid ? 'valid' : 'invalid'
    });
    return badges;
}
function buildWeGameBindingListCardData(bindings) {
    if (bindings.length === 0) {
        return {
            title: 'WeGame 绑定列表',
            subtitle: '当前还没有已绑定的 WeGame 账号',
            bindings: [],
            emptyText: '暂无已绑定的 WeGame 账号',
            tip: '请先发送 #wgqq登陆 或 #wgwx登陆 绑定账号',
            copyright: 'alemonjs-roco · WeGame'
        };
    }
    return {
        title: 'WeGame 绑定列表',
        subtitle: `当前共 ${bindings.length} 个已绑定账号`,
        bindings: bindings.map((binding, index) => ({
            index: index + 1,
            total: bindings.length,
            nickname: getBindingName(binding),
            statusText: `${binding.isPrimary ? '主账号 | ' : ''}${binding.isValid ? '有效' : '失效'}`,
            loginType: formatLoginType(binding.loginType),
            tgpId: binding.tgpId || '未返回',
            updatedAt: formatBindingTime(binding.updatedAt),
            roleId: binding.roleId || '',
            isPrimary: binding.isPrimary,
            badges: buildBindingBadges(binding)
        })),
        emptyText: '',
        tip: '切换：#wg切换账号 <序号>    删除：#wg删除账号 <序号>',
        copyright: 'alemonjs-roco · WeGame'
    };
}
async function getSavedCredential(userKey) {
    return (await getUserState(userKey)).lastCredential;
}
function buildWeGameLoginSuccessText(binding, credential) {
    const role = credential?.role ?? null;
    const lines = ['登录成功。'];
    const nickname = binding?.nickname ?? role?.name ?? '';
    const wegameId = binding?.tgpId ?? credential?.tgpId ?? '未返回';
    const tags = [];
    if (binding?.isPrimary) {
        tags.push('主账号');
    }
    tags.push(binding?.isValid !== false && credential?.isValid !== false ? '有效' : '失效');
    if (nickname) {
        lines.push(`昵称：${nickname}`);
    }
    else {
        lines.push(`WeGameID：${wegameId}`);
    }
    lines.push(`状态：${tags.join(' | ')}`);
    lines.push(`登录方式：${formatLoginType(binding?.loginType ?? credential?.loginType ?? '')}`);
    const roleId = role?.id ?? binding?.roleId ?? '';
    if (roleId) {
        lines.push(`角色ID：${roleId}`);
    }
    lines.push('可发送 #wg账号列表 查看已绑定账号。');
    return lines.join('\n');
}
async function resolveActiveWeGameCredential(context) {
    const bindings = await getWeGameBindings(context.userIdentifier).catch(() => []);
    const binding = pickActiveBinding(bindings);
    const saved = await getSavedCredential(context.userKey);
    const credential = mergeCredential(saved, bindingToCredential(binding));
    if (credential) {
        await setUserState(context.userKey, { lastCredential: credential });
    }
    return {
        credential,
        binding
    };
}

export { buildBindingsText, buildWeGameBindingListCardData, buildWeGameLoginSuccessText, createWeGameLogin, deleteWeGameBinding, formatBindingTime, formatLoginType, getBindingName, getSavedCredential, getWeGameBindings, getWeGameRuntimeConfig, getWeGameUserContext, pickActiveBinding, requestWeGame, resolveActiveWeGameCredential, setPrimaryWeGameBinding, syncWeGameBindings, waitWeGameLogin };
