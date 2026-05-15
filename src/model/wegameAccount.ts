import { storeKeys } from '@src/constants/storeKeys';
import { isHttpOk, requestJson } from '@src/model/http';
import crypto from 'node:crypto';
import os from 'node:os';
import { readRuntimeStore, writeRuntimeStore } from '@src/model/runtimeStore';
import { readWeGameCoreConfig } from '@src/model/wegameResource';

type WeGameConfig = {
  base_url: string;
  api_key: string;
  client_type: string;
  client_id: string;
  device_fingerprint: string;
  request_timeout_ms: number;
  login_poll_interval_ms: number;
  login_timeout_ms: number;
};

type WeGameCredential = {
  frameworkToken: string;
  isValid: boolean;
  isBind: boolean;
  updatedAt: string;
  credentialProvider?: string;
  tgpId?: string;
  loginType?: string;
  role?: {
    id?: string;
    openid?: string;
    name?: string;
    avatar?: string;
    create_time?: string;
    is_online?: boolean;
    level?: number;
    star?: number;
  } | null;
};

export type WeGameBinding = {
  id: string;
  frameworkToken: string;
  tokenType: string;
  loginType: string;
  credentialProvider: string;
  clientType: string;
  tgpId: string;
  roleId: string;
  roleOpenid: string;
  nickname: string;
  avatar: string;
  isPrimary: boolean;
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
};

type WeGameBindingCardBadge = {
  text: string;
  type: 'primary' | 'valid' | 'invalid';
};

export type WeGameBindingCardItem = {
  index: number;
  total: number;
  nickname: string;
  statusText: string;
  loginType: string;
  tgpId: string;
  updatedAt: string;
  roleId: string;
  isPrimary: boolean;
  badges: WeGameBindingCardBadge[];
};

export type WeGameBindingListCardData = {
  title: string;
  subtitle: string;
  bindings: WeGameBindingCardItem[];
  emptyText: string;
  tip: string;
  copyright: string;
};

type WeGameUserState = {
  lastCredential: WeGameCredential | null;
  updatedAt: string;
};

type WeGameStore = {
  users: Record<string, WeGameUserState>;
};

type WeGameContext = {
  userKey: string;
  userIdentifier: string;
};

const storeKey = storeKeys.wegame.users;
const storeFileName = 'wegame-users.json';

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

async function readWeGameConfig(): Promise<WeGameConfig> {
  const merged = await readWeGameCoreConfig();
  const wegame = (merged.wegame as Record<string, unknown> | undefined) ?? {};

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

function getDeviceFingerprint(config: WeGameConfig): string {
  if (config.device_fingerprint) {
    return config.device_fingerprint;
  }

  return crypto.createHash('sha256').update(`${os.hostname()}:alemonjs-roco:wegame`).digest('hex').slice(0, 32);
}

async function getStore(): Promise<WeGameStore> {
  const payload = await readRuntimeStore<WeGameStore>(storeKey, storeFileName, { users: {} });

  return {
    users: payload.users ?? {}
  };
}

function normalizeRole(role: unknown): WeGameCredential['role'] {
  if (!role || typeof role !== 'object') {
    return null;
  }

  const payload = role as Record<string, unknown>;

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

function normalizeCredential(payload: unknown): WeGameCredential | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as Record<string, unknown>;
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

function normalizeBinding(payload: unknown): WeGameBinding | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as Record<string, unknown>;
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

async function getUserState(userKey: string): Promise<WeGameUserState> {
  const store = await getStore();

  return (
    store.users[userKey] ?? {
      lastCredential: null,
      updatedAt: ''
    }
  );
}

async function setUserState(userKey: string, state: Partial<WeGameUserState>): Promise<WeGameUserState> {
  const store = await getStore();
  const current = store.users[userKey] ?? {
    lastCredential: null,
    updatedAt: ''
  };
  const next: WeGameUserState = {
    ...current,
    ...state,
    updatedAt: new Date().toISOString()
  };

  store.users[userKey] = next;
  await writeRuntimeStore(storeKey, storeFileName, store);

  return next;
}

function createRequestError(message: string): Error {
  return new Error(message);
}

async function request<T>(
  urlPath: string,
  options: {
    method?: string;
    params?: Record<string, string>;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Device-Fingerprint': getDeviceFingerprint(config),
    'X-Device-Id': getDeviceFingerprint(config),
    ...(options.headers ?? {})
  };

  if (config.api_key) {
    headers['X-API-Key'] = config.api_key;
  }

  const response = await requestJson<{ code?: number; message?: string; data?: T }>({
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

  return (body.data ?? {}) as T;
}

function getUserScopedHeaders(userIdentifier: string): Record<string, string> {
  const headers: Record<string, string> = {};

  if (userIdentifier) {
    headers['X-User-Identifier'] = userIdentifier;
  }

  return headers;
}

function getClientScopeParams(config: WeGameConfig): Record<string, string> {
  const params: Record<string, string> = {};

  if (config.client_type) {
    params.client_type = config.client_type;
  }

  if (config.client_id) {
    params.client_id = config.client_id;
  }

  return params;
}

function bindingToCredential(binding: WeGameBinding | null): WeGameCredential | null {
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

function mergeCredential(baseCredential: WeGameCredential | null, overrideCredential: WeGameCredential | null): WeGameCredential | null {
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

export function getWeGameUserContext(event: { current: { Platform?: string; BotId?: string; UserId?: string } }): WeGameContext {
  const platform = normalizeText(event.current.Platform ?? 'unknown');
  const botId = normalizeText(event.current.BotId ?? 'bot');
  const userId = normalizeText(event.current.UserId);

  return {
    userKey: `${platform}:${botId}:${userId}`,
    userIdentifier: userId
  };
}

export async function getWeGameRuntimeConfig(): Promise<WeGameConfig> {
  return await readWeGameConfig();
}

export function requestWeGame<T>(
  urlPath: string,
  options: {
    method?: string;
    params?: Record<string, string>;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  return request<T>(urlPath, options);
}

export async function createWeGameLogin(userIdentifier: string, platform: 'qq' | 'wechat') {
  const config = await readWeGameConfig();

  if (!config.api_key) {
    throw new Error('请先在 alemon.config.yaml 的 alemonjs-roco.wegame.api_key 中写入 WeGame API Key');
  }

  const pathName = platform === 'wechat' ? '/api/v1/login/wegame/wechat/qr' : '/api/v1/login/wegame/qr';

  return request<{ frameworkToken?: string; qr_image?: string; expire?: string | number }>(pathName, {
    method: 'GET',
    headers: getUserScopedHeaders(userIdentifier),
    params: {
      user_identifier: userIdentifier,
      ...getClientScopeParams(config)
    }
  });
}

export async function waitWeGameLogin(
  userIdentifier: string,
  userKey: string,
  platform: 'qq' | 'wechat',
  frameworkToken: string,
  options: {
    onStatusChange?: (status: string) => void | Promise<void>;
  } = {}
) {
  const config = await readWeGameConfig();
  const statusPath = platform === 'wechat' ? '/api/v1/login/wegame/wechat/status' : '/api/v1/login/wegame/status';
  const tokenPath = platform === 'wechat' ? '/api/v1/login/wegame/wechat/token' : '/api/v1/login/wegame/token';
  const startedAt = Date.now();
  let lastStatus = '';

  while (Date.now() - startedAt < config.login_timeout_ms) {
    const statusPayload = await request<{ status?: string; code?: number }>(statusPath, {
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
      const credentialPayload = await request<unknown>(tokenPath, {
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

export async function getWeGameBindings(userIdentifier: string): Promise<WeGameBinding[]> {
  const config = await readWeGameConfig();

  if (!config.api_key) {
    throw new Error('缺少 WeGame API Key，请检查 alemon.config.yaml -> alemonjs-roco.wegame.api_key');
  }

  const payload = await request<{ bindings?: unknown[] }>('/api/v1/user/bindings', {
    method: 'GET',
    headers: getUserScopedHeaders(userIdentifier),
    params: {
      user_identifier: userIdentifier,
      ...getClientScopeParams(config)
    }
  });

  return (payload.bindings ?? []).map(item => normalizeBinding(item)).filter((item): item is WeGameBinding => Boolean(item));
}

export function pickActiveBinding(bindings: WeGameBinding[]): WeGameBinding | null {
  return (
    bindings.find(item => item.isPrimary && item.isValid) ?? bindings.find(item => item.isValid) ?? bindings.find(item => item.isPrimary) ?? bindings[0] ?? null
  );
}

export async function syncWeGameBindings(context: WeGameContext): Promise<WeGameBinding[]> {
  const bindings = await getWeGameBindings(context.userIdentifier);
  const active = pickActiveBinding(bindings);
  const currentState = await getUserState(context.userKey);

  await setUserState(context.userKey, {
    lastCredential: mergeCredential(currentState.lastCredential, bindingToCredential(active))
  });

  return bindings;
}

export async function setPrimaryWeGameBinding(userIdentifier: string, bindingId: string): Promise<void> {
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

export async function deleteWeGameBinding(userIdentifier: string, bindingId: string): Promise<void> {
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

export function formatLoginType(loginType: string): string {
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

export function getBindingName(binding: WeGameBinding): string {
  return binding.nickname || binding.roleId || binding.tgpId || '未命名账号';
}

export function formatBindingTime(value: string): string {
  const text = normalizeText(value);

  if (!text) {
    return '未返回';
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  const pad = (num: number) => String(num).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function buildBindingsText(bindings: WeGameBinding[]): string {
  return bindings
    .map((binding, index) => {
      const tags: string[] = [];

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

function buildBindingBadges(binding: WeGameBinding): WeGameBindingCardBadge[] {
  const badges: WeGameBindingCardBadge[] = [];

  if (binding.isPrimary) {
    badges.push({ text: '主账号', type: 'primary' });
  }

  badges.push({
    text: binding.isValid ? '有效' : '失效',
    type: binding.isValid ? 'valid' : 'invalid'
  });

  return badges;
}

export function buildWeGameBindingListCardData(bindings: WeGameBinding[]): WeGameBindingListCardData {
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

export async function getSavedCredential(userKey: string): Promise<WeGameCredential | null> {
  return (await getUserState(userKey)).lastCredential;
}

export function buildWeGameLoginSuccessText(binding: WeGameBinding | null, credential: WeGameCredential | null): string {
  const role = credential?.role ?? null;
  const lines = ['登录成功。'];
  const nickname = binding?.nickname ?? role?.name ?? '';
  const wegameId = binding?.tgpId ?? credential?.tgpId ?? '未返回';
  const tags: string[] = [];

  if (binding?.isPrimary) {
    tags.push('主账号');
  }

  tags.push(binding?.isValid !== false && credential?.isValid !== false ? '有效' : '失效');

  if (nickname) {
    lines.push(`昵称：${nickname}`);
  } else {
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

export async function resolveActiveWeGameCredential(context: WeGameContext): Promise<{
  credential: WeGameCredential | null;
  binding: WeGameBinding | null;
}> {
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
