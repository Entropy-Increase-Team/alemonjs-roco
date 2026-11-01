/*
 * 说明：后端 payload 字段大量为 unknown，字符串兜底链刻意使用 ||（空字符串同样视为缺失），
 * 因此关闭 prefer-nullish-coalescing 检查。
 */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { getWeGameRuntimeConfig, requestWeGame } from '@src/model/wegameAccount';
import { getPetMeta } from '@src/model/rocomHomePets';
import natureMapRaw from '@src/data/rocom/nature_map.json';

const ELEMENT_COLORS: Record<string, string> = {
  草: '#4ebc73',
  火: '#db5525',
  水: '#3f89b4',
  光: '#6aa9fe',
  地: '#9a7e3f',
  冰: '#63aeda',
  龙: '#ed4962',
  电: '#e7c506',
  毒: '#ba62e0',
  虫: '#96ca0f',
  武: '#ff9636',
  翼: '#3ec7ca',
  萌: '#fc74a7',
  幽: '#9446ec',
  恶: '#cf467a',
  机械: '#40cba9',
  幻: '#9fa7f8',
  普通: '#babbc6',
  无: '#babbc6'
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);

  return Number.isFinite(num) ? num : fallback;
}

function normalizeResourceUrl(value: unknown = '', baseUrl = ''): string {
  const text = normalizeText(value);

  if (!text) {
    return '';
  }

  if (/^data:image\//u.test(text)) {
    return text;
  }

  if (text.startsWith('//')) {
    return `https:${text}`;
  }

  if (/^https?:\/\//u.test(text)) {
    return text;
  }

  const normalizedBaseUrl = normalizeText(baseUrl).replace(/\/+$/u, '');

  if (text.startsWith('/') && normalizedBaseUrl) {
    return `${normalizedBaseUrl}${text}`;
  }

  return '';
}

export type ShareCodePet = {
  slot: number;
  slotText: string;
  color: string;
  pet: { id: string; name: string; icon: string };
  typeIcons: Array<{ name: string }>;
  bloodline: { name: string; element: string; icon: string };
  personality: { id: string; name: string; up: string; down: string };
  ivs_detail: Array<{ name: string }>;
  skills: Array<{ name: string; icon: string }>;
};

export type ShareCodeTeam = {
  share_code: string;
  mode_name: string;
  magic_icon: string;
  sprite_count: number;
  count_label: string;
  teams: ShareCodePet[];
};

export function parseRocomShareCode(shareCode: string, userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/tools/share-code/parse', {
    method: 'POST',
    data: { share_code: shareCode },
    headers: {
      'X-User-Identifier': userIdentifier,
      'Content-Type': 'application/json'
    }
  });
}

const natureMap = natureMapRaw as unknown as Record<string, { name?: string; up?: string; down?: string }>;

function getNatureEntry(natureId: string): { name?: string; up?: string; down?: string } {
  return natureMap[normalizeText(natureId)] || {};
}

export function normalizeShareCodeTeam(payload: Record<string, unknown> = {}, baseUrl = ''): ShareCodeTeam {
  const data = payload.data && typeof payload.data === 'object' ? (payload.data as Record<string, unknown>) : payload;
  const teams = Array.isArray(data.teams) ? data.teams : [];
  const spriteCount = toNumber(data.sprite_count ?? data.spriteCount, teams.length) || teams.length;

  return {
    share_code: normalizeText(data.share_code || data.shareCode),
    mode_name: normalizeText((data.mode as Record<string, unknown>)?.name) || '阵容分享',
    magic_icon: normalizeResourceUrl((data.magic as Record<string, unknown>)?.icon, baseUrl),
    sprite_count: spriteCount,
    count_label: `/ ${spriteCount} 精灵`,
    teams: teams
      .map(raw => raw as Record<string, unknown>)
      .slice()
      .sort((a, b) => toNumber(a.slot, 0) - toNumber(b.slot, 0))
      .map((team, index) => normalizeShareCodePet(team, index, baseUrl))
  };
}

function normalizeShareCodePet(team: Record<string, unknown> = {}, index = 0, baseUrl = ''): ShareCodePet {
  const pet = (team.pet && typeof team.pet === 'object' ? team.pet : {}) as Record<string, unknown>;
  const petId = normalizeText(pet.id || team.pet_id || team.id);
  const petMeta = getPetMeta(petId);
  const bloodline = (team.bloodline && typeof team.bloodline === 'object' ? team.bloodline : {}) as Record<string, unknown>;
  const bloodlineName = normalizeText(bloodline.name);
  const bloodlineElement = bloodlineName.replace(/系血脉$/u, '').replace(/血脉$/u, '') || '普通';
  const personality = (team.personality && typeof team.personality === 'object' ? team.personality : {}) as Record<string, unknown>;
  const nature = getNatureEntry(normalizeText(personality.id));
  const typeNames = Array.isArray(pet.type_names) ? pet.type_names : Array.isArray(petMeta.unit_type) ? petMeta.unit_type : [];
  const slot = toNumber(team.slot, index + 1);

  return {
    slot,
    slotText: String(slot).padStart(2, '0'),
    color: ELEMENT_COLORS[bloodlineElement] || '#a687d5',
    pet: {
      id: petId,
      name: normalizeText(pet.name) || normalizeText(petMeta.name) || `精灵 ${index + 1}`,
      icon: normalizeResourceUrl(pet.icon || pet.pet_img_url || team.pet_img_url, baseUrl) || buildPetFallbackIcon(petId)
    },
    typeIcons: typeNames.map(name => ({ name: normalizeText(name) })).filter(item => item.name),
    bloodline: {
      name: bloodlineName || `${bloodlineElement}系血脉`,
      element: bloodlineElement,
      icon: normalizeResourceUrl(bloodline.icon, baseUrl)
    },
    personality: {
      id: normalizeText(personality.id),
      name: normalizeText(personality.name) || normalizeText(nature.name) || '未知',
      up: normalizeText(nature.up),
      down: normalizeText(nature.down)
    },
    ivs_detail: (Array.isArray(team.ivs_detail) ? team.ivs_detail : [])
      .map(raw => ({
        name: normalizeText((raw && typeof raw === 'object' ? (raw as Record<string, unknown>).name || (raw as Record<string, unknown>).label : raw) ?? '')
      }))
      .filter(item => item.name),
    skills: (Array.isArray(team.skills) ? team.skills : []).map(raw => {
      const skill = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

      return {
        name: normalizeText(skill.name || skill.skill_name) || '未知技能',
        icon: normalizeResourceUrl(skill.icon || skill.skill_img_url, baseUrl)
      };
    })
  };
}

function buildPetFallbackIcon(petId: string): string {
  const numeric = Number(petId);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '';
  }

  const id = numeric >= 3000 ? String(numeric) : String(numeric + 3000);

  return `https://game.gtimg.cn/images/rocom/rocodata/jingling/${id}/icon.png`;
}

export async function getShareCodeBaseUrl(): Promise<string> {
  const config = await getWeGameRuntimeConfig();

  return config.base_url.replace(/\/+$/u, '');
}
