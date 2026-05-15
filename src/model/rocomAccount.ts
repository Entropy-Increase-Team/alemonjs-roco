import { isHttpOk, requestJson } from '@src/model/http';
import { getWeGameBindings, getWeGameUserContext, pickActiveBinding } from '@src/model/wegameAccount';

type RocomAccount = {
  id: string;
  bindingId: string;
  bindingIndex: number;
  loginType: string;
  tgpId: string;
  isPrimary: boolean;
  isValid: boolean;
  updatedAt: string;
  roleId: string;
  roleName: string;
  level: unknown;
  starName: string;
  enrollDays: unknown;
  isOnline: unknown;
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function createRequestError(message: string): Error {
  return new Error(message);
}

function normalizeRocomAccount(payload: unknown): RocomAccount | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as Record<string, unknown>;
  const binding = data.binding && typeof data.binding === 'object' ? (data.binding as Record<string, unknown>) : {};
  const role = data.role && typeof data.role === 'object' ? (data.role as Record<string, unknown>) : {};
  const bindingId = normalizeText(binding.id);
  const roleId = normalizeText(role.id);

  if (!bindingId && !roleId) {
    return null;
  }

  return {
    id: bindingId || roleId,
    bindingId,
    bindingIndex: 0,
    loginType: normalizeText(binding.loginType ?? binding.login_type),
    tgpId: normalizeText(binding.tgpId ?? binding.tgp_id),
    isPrimary: binding.isPrimary === true || binding.is_primary === true,
    isValid: binding.isValid !== false && binding.is_valid !== false,
    updatedAt: normalizeText(binding.updatedAt ?? binding.updated_at),
    roleId,
    roleName: normalizeText(role.name),
    level: role.level,
    starName: normalizeText(role.star_name),
    enrollDays: role.enroll_days,
    isOnline: role.is_online
  };
}

function formatLoginType(loginType: string): string {
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

function getAccountName(account: RocomAccount): string {
  return account.roleName || account.roleId || account.tgpId || '未命名角色';
}

function formatDateTime(value: unknown): string {
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

async function fetchRocomAccounts(userIdentifier: string): Promise<Record<string, unknown>> {
  const url = new URL('/api/v1/games/rocom/accounts', process.env.WEGAME_BASE_URL ?? 'https://wegame.shallow.ink');

  url.searchParams.set('user_identifier', userIdentifier);
  url.searchParams.set('device_fingerprint', 'alemonjs-roco');

  const headers: Record<string, string> = {};

  if (process.env.WEGAME_API_KEY) {
    headers['X-API-Key'] = process.env.WEGAME_API_KEY;
  }
  headers['X-User-Identifier'] = userIdentifier;

  const response = await requestJson<{ code?: number; message?: string; data?: Record<string, unknown> }>({
    url: String(url),
    method: 'GET',
    headers,
    timeout: 15000
  });

  const body = response.data ?? null;

  if (!isHttpOk(response.status)) {
    throw createRequestError(body?.message ?? `请求失败：HTTP ${response.status}`);
  }

  if (!body || Number(body.code) !== 0) {
    throw createRequestError(body?.message ?? '洛克账号列表请求失败');
  }

  return body.data ?? {};
}

export async function getRocomAccounts(event: { current: { Platform?: string; BotId?: string; UserId?: string } }) {
  const context = getWeGameUserContext(event);
  const bindings = await getWeGameBindings(context.userIdentifier);
  const bindingIndexMap = new Map(bindings.map((binding, index) => [binding.id, index + 1]));
  const data = await fetchRocomAccounts(context.userIdentifier);
  const accounts = (Array.isArray(data.accounts) ? data.accounts : [])
    .map(item => {
      const account = normalizeRocomAccount(item);

      if (!account) {
        return null;
      }

      return {
        ...account,
        bindingIndex: bindingIndexMap.get(account.bindingId) ?? 0
      };
    })
    .filter((item): item is RocomAccount => Boolean(item));

  return {
    accounts,
    bindingsTotal: Math.max(Number(data.bindings_total ?? 0), bindings.length),
    activeBinding: pickActiveBinding(bindings)
  };
}

export function buildRocomAccountsText(accounts: RocomAccount[], bindingsTotal: number): string {
  if (accounts.length === 0) {
    return [
      '洛克账号列表',
      bindingsTotal > 0 ? `当前已绑定 ${bindingsTotal} 个 WeGame 账号，但还没有识别到可用洛克角色` : '当前还没有已绑定的 WeGame 账号'
    ].join('\n');
  }

  const lines = ['洛克账号列表', `当前共识别到 ${accounts.length} 个可用洛克角色`, ''];

  for (const account of accounts) {
    const tags: string[] = [];

    if (account.isPrimary) {
      tags.push('主账号');
    }
    tags.push(account.isValid ? '有效' : '失效');
    if (account.isOnline !== undefined) {
      tags.push(Number(account.isOnline) === 1 ? '在线' : '离线');
    }

    lines.push(`绑定序号：${account.bindingIndex || '未返回'}`);
    lines.push(`角色昵称：${getAccountName(account)}`);
    lines.push(`状态：${tags.join(' | ')}`);
    lines.push(`登录方式：${formatLoginType(account.loginType)}`);
    lines.push(`角色ID：${account.roleId || '未返回'}`);
    lines.push(`WeGameID：${account.tgpId || '未返回'}`);
    lines.push(`更新时间：${formatDateTime(account.updatedAt)}`);
    lines.push('');
  }

  lines.push('切换默认账号：#wg切换账号 <绑定序号>');

  return lines.join('\n').trim();
}
