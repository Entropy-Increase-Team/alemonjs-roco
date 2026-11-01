import { requestWeGame, resolveActiveWeGameCredential, type WeGameContext } from '@src/model/wegameAccount';
import { readRuntimeStore, writeRuntimeStore } from '@src/model/runtimeStore';
import { storeKeys } from '@src/constants/storeKeys';

type BindUidStore = {
  users: Record<string, { uid: string; frameworkToken: string; updatedAt: string }>;
};

const storeKey = storeKeys.rocom.bindUid;
const uidStoreFileName = 'rocom-bind-uid.json';

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

export function parseBindUidArgs(rawArgs: string): string {
  const uid = normalizeText(rawArgs);

  if (!uid) {
    throw new Error('格式：+绑定UID <UID>\nUID 即角色资料中的 role.id');
  }

  if (!/^\d+$/u.test(uid)) {
    throw new Error('UID 必须为纯数字');
  }

  return uid;
}

export async function bindRocomUid(context: WeGameContext, uid: string): Promise<string> {
  const data = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/uid/bind', {
    method: 'POST',
    data: { uid },
    headers: {
      'X-User-Identifier': context.userIdentifier,
      'Content-Type': 'application/json'
    }
  });

  const frameworkToken = normalizeText(data.frameworkToken);
  const binding = (data.binding && typeof data.binding === 'object' ? data.binding : {}) as Record<string, unknown>;
  const isPrimary = binding.is_primary === true;
  const source = normalizeText(binding.source);

  // 保存凭证到本地，供后续 ingame 查询解析 UID
  if (frameworkToken) {
    const store = await readRuntimeStore<BindUidStore>(storeKey, uidStoreFileName, { users: {} });

    store.users = store.users ?? {};
    store.users[context.userKey] = {
      uid,
      frameworkToken,
      updatedAt: new Date().toISOString()
    };
    await writeRuntimeStore(storeKey, uidStoreFileName, store).catch(() => undefined);
  }

  const lines = ['✅ UID 绑定成功！', `UID：${uid}`, isPrimary ? '状态：主账号（首次绑定）' : '状态：已绑定'];

  if (source) {
    lines.push(`来源：${source}`);
  }

  if (frameworkToken) {
    lines.push('', '已生成凭证，后续 ingame 查询可直接使用。');
  }

  return lines.join('\n');
}

/** 绑定 UID 兜底：从本地绑定记录里取 UID */
export async function getBoundUid(context: WeGameContext): Promise<string> {
  const store = await readRuntimeStore<BindUidStore>(storeKey, uidStoreFileName, { users: {} });
  const entry = store.users?.[context.userKey];

  if (entry?.uid) {
    return normalizeText(entry.uid);
  }

  const { credential } = await resolveActiveWeGameCredential(context);

  return normalizeText(credential?.role?.id);
}

export async function hasBindUidRecord(context: WeGameContext): Promise<boolean> {
  const store = await readRuntimeStore<BindUidStore>(storeKey, uidStoreFileName, { users: {} });

  return Boolean(store.users?.[context.userKey]?.uid);
}
