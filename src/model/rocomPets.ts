import petsData from '@src/data/rocom/Pets.json';
import { requestWeGame, resolveActiveWeGameCredential, type WeGameContext } from '@src/model/wegameAccount';
import { readRocomConfig } from '@src/model/wegameResource';

type LocalPet = Record<string, unknown>;
type PetListItem = {
  name: string;
  level: string;
  types: string;
  rarity: string;
  imageUrl: string;
};

const PET_SUBSETS: Record<string, number> = {
  全部: 0,
  了不起: 1,
  异色: 2,
  炫彩: 3
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);

  return Number.isFinite(num) ? num : fallback;
}

function normalizeUrl(value: unknown): string {
  const text = normalizeText(value);

  if (!text) {
    return '';
  }

  if (text.startsWith('//')) {
    return `https:${text}`;
  }

  return text;
}

async function getPageSize(): Promise<number> {
  const rocom = (await readRocomConfig()).rocom as Record<string, unknown> | undefined;

  return Math.max(1, toNumber(rocom?.page_size, 10) || 10);
}

async function getMaxPage(): Promise<number> {
  const rocom = (await readRocomConfig()).rocom as Record<string, unknown> | undefined;

  return Math.max(1, toNumber(rocom?.max_page, 5) || 5);
}

function getPetSubsetLabel(value: number): string {
  return Object.keys(PET_SUBSETS).find(key => PET_SUBSETS[key] === value) ?? '全部';
}

function getPetsData(): LocalPet[] {
  return Array.isArray(petsData) ? (petsData as LocalPet[]) : [];
}

function getLocalPetName(pet: LocalPet): string {
  const localized = pet.localized;
  const zh = localized && typeof localized === 'object' && !Array.isArray(localized) ? (localized as Record<string, unknown>).zh : undefined;
  const zhName = zh && typeof zh === 'object' && !Array.isArray(zh) ? normalizeText((zh as Record<string, unknown>).name) : '';

  return zhName || normalizeText(pet.name);
}

function getLocalPetTypes(pet: LocalPet): string {
  const values = [pet.main_type, pet.sub_type]
    .map(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return '';
      }

      const localized = (item as Record<string, unknown>).localized;

      if (!localized || typeof localized !== 'object' || Array.isArray(localized)) {
        return '';
      }

      return normalizeText((localized as Record<string, unknown>).zh);
    })
    .filter(Boolean);

  return values.length > 0 ? values.join(' / ') : '';
}

function resolveLocalPetByIdOrName(value: unknown): LocalPet | null {
  const text = normalizeText(value);

  if (!text) {
    return null;
  }

  const pets = getPetsData();

  return (
    pets.find(item => String(item.id) === text) ??
    pets.find(item => getLocalPetName(item) === text) ??
    pets.find(item => normalizeText(item.name).toLowerCase() === text.toLowerCase()) ??
    null
  );
}

function resolveZone(loginType?: string): string | undefined {
  const normalized = normalizeText(loginType).toLowerCase();

  if (normalized === 'qq') {
    return '0';
  }

  if (normalized === 'wechat') {
    return '1';
  }

  return undefined;
}

async function parsePetListArgs(text: string): Promise<{ petSubset: number; pageNo: number }> {
  const raw = normalizeText(text);

  if (!raw) {
    return {
      petSubset: 0,
      pageNo: 1
    };
  }

  const tokens = raw.split(/\s+/u).filter(Boolean);
  let petSubset = 0;
  let pageNo = 1;

  for (const token of tokens) {
    if (PET_SUBSETS[token] !== undefined) {
      petSubset = PET_SUBSETS[token];
      continue;
    }

    if (/^\d+$/u.test(token)) {
      pageNo = Number(token);
      continue;
    }

    throw new Error('格式：+精灵列表 <了不起|异色|炫彩> <页码>');
  }

  const maxPage = await getMaxPage();

  if (pageNo < 1 || pageNo > maxPage) {
    throw new Error(`页码仅支持 1-${maxPage}`);
  }

  return {
    petSubset,
    pageNo
  };
}

function extractPetList(payload: Record<string, unknown>, depth = 0): Array<Record<string, unknown>> {
  if (!payload || typeof payload !== 'object' || depth > 2) {
    return [];
  }

  const directKeys = ['pets', 'pet_list', 'list', 'records', 'items', 'rows'];

  for (const key of directKeys) {
    if (Array.isArray(payload[key])) {
      return payload[key] as Array<Record<string, unknown>>;
    }
  }

  for (const value of Object.values(payload)) {
    if (Array.isArray(value) && value.some(item => item && typeof item === 'object')) {
      return value as Array<Record<string, unknown>>;
    }
  }

  for (const value of Object.values(payload)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const rows = extractPetList(value as Record<string, unknown>, depth + 1);

      if (rows.length > 0) {
        return rows;
      }
    }
  }

  return [];
}

function extractTypesFromPayload(pet: Record<string, unknown>): string {
  const candidates = [pet.pet_types_info, pet.types_info, pet.element_info, pet.attribute_info];

  for (const value of candidates) {
    if (!Array.isArray(value)) {
      continue;
    }

    const names = value
      .map(item => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          return '';
        }

        const row = item as Record<string, unknown>;

        return normalizeText(row.name ?? row.label);
      })
      .filter(Boolean);

    if (names.length > 0) {
      return names.slice(0, 2).join(' / ');
    }
  }

  return '';
}

function getPetRarityLabel(subset: number): string {
  return subset === 0 ? '常规' : getPetSubsetLabel(subset);
}

function getRoleProfile(payload: Record<string, unknown>): Record<string, unknown> {
  return payload.role && typeof payload.role === 'object' && !Array.isArray(payload.role) ? (payload.role as Record<string, unknown>) : {};
}

function buildPetListItem(pet: Record<string, unknown>, index: number, pageNo: number, petSubset: number, pageSize: number): PetListItem {
  const resolvedName = normalizeText(pet.pet_name ?? pet.name ?? pet.nickname ?? pet.pet_nick);
  const fallbackLocal = resolveLocalPetByIdOrName(pet.pet_id ?? pet.id ?? resolvedName);
  const name = resolvedName || (fallbackLocal ? getLocalPetName(fallbackLocal) : `第 ${(pageNo - 1) * pageSize + index + 1} 个精灵`);
  const types = extractTypesFromPayload(pet) || (fallbackLocal ? getLocalPetTypes(fallbackLocal) : '') || '未知';
  const imageUrl =
    normalizeUrl(
      pet.pet_img_url ?? pet.image_url ?? pet.img_url ?? pet.pet_image ?? pet.pet_img ?? pet.avatar ?? pet.icon ?? pet.icon_url ?? pet.cover ?? pet.pic
    ) || '';

  return {
    name,
    level: normalizeText(pet.pet_level ?? pet.level) || '--',
    types,
    rarity: getPetRarityLabel(petSubset),
    imageUrl
  };
}

export async function getRocomPetList(context: WeGameContext, rawArgs = '') {
  const args = await parsePetListArgs(rawArgs);
  const pageSize = await getPageSize();
  const { credential, binding } = await resolveActiveWeGameCredential(context);

  if (!credential?.frameworkToken) {
    throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
  }

  const params: Record<string, string> = {
    pet_subset: String(args.petSubset),
    page_no: String(args.pageNo),
    page_size: String(pageSize)
  };
  const zone = resolveZone(binding?.loginType ?? credential.loginType);

  if (zone !== undefined) {
    params.zone = zone;
  }

  const [petData, roleProfile] = await Promise.all([
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/battle/pets', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      },
      params
    }),
    requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/profile/role', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      }
    }).catch(() => ({}))
  ]);

  const pets = extractPetList(petData);
  const role = getRoleProfile(roleProfile);

  if (pets.length === 0) {
    throw new Error(args.pageNo > 1 ? '该页没有更多精灵数据了' : '当前没有可用的精灵数据');
  }

  return {
    currentTab: getPetSubsetLabel(args.petSubset),
    userName: normalizeText(role.name) || '洛克玩家',
    userLevel: normalizeText(role.level) || '--',
    userUid: normalizeText(role.id) || normalizeText(role.openid) || normalizeText(credential.tgpId),
    accountLabel: normalizeText(binding?.loginType ?? credential.loginType) || '未知',
    totalCount: toNumber(petData.total ?? petData.total_count ?? petData.totalCount ?? petData.count, pets.length),
    currentPage: toNumber(petData.page_no ?? petData.pageNo ?? petData.page, args.pageNo) || args.pageNo,
    totalPages: Math.max(
      1,
      toNumber(
        petData.total_pages ?? petData.totalPages ?? petData.page_count ?? petData.pageCount,
        Math.ceil(toNumber(petData.total ?? petData.total_count ?? pets.length, pets.length) / pageSize) || 1
      )
    ),
    pageSize,
    pets: pets.map((item, index) => buildPetListItem(item, index, args.pageNo, args.petSubset, pageSize))
  };
}

export function buildRocomPetListText(payload: {
  currentTab: string;
  userName: string;
  userLevel: string;
  userUid: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  accountLabel: string;
  pageSize: number;
  pets: PetListItem[];
}): string {
  const lines = [
    '我的精灵',
    `玩家：${payload.userName} Lv.${payload.userLevel}`,
    `ID：${payload.userUid || '未返回'}`,
    `分类：${payload.currentTab}`,
    `账号：${payload.accountLabel}`,
    `数量：${payload.totalCount}`,
    `页码：${payload.currentPage} / ${payload.totalPages}`,
    ''
  ];

  payload.pets.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name} Lv.${item.level}`);
    lines.push(`属性：${item.types}`);
    lines.push(`分类：${item.rarity}`);
    if (item.imageUrl) {
      lines.push(`图片：${item.imageUrl}`);
    }
    lines.push('');
  });

  lines.push('翻页：+精灵列表 <了不起|异色|炫彩> <页码>');

  return lines.join('\n').trim();
}
