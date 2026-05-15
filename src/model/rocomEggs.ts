import petsData from '@src/data/rocom/Pets.json';
import { requestWeGame } from '@src/model/wegameAccount';

type PetData = Record<string, unknown>;
type SearchResult =
  | { matchType: 'exact' | 'fuzzy'; pet: PetData; candidates: [] }
  | { matchType: 'multi'; pet: null; candidates: PetData[] }
  | { matchType: 'not_found'; pet: null; candidates: [] };

const EGG_GROUP_META: Record<number, string> = {
  1: '未发现',
  2: '怪兽',
  3: '两栖',
  4: '虫',
  5: '飞行',
  6: '陆上',
  7: '妖精',
  8: '植物',
  9: '人型',
  10: '软体',
  11: '矿物',
  12: '不定形',
  13: '鱼',
  14: '龙',
  15: '机械'
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function getPets(): PetData[] {
  return Array.isArray(petsData) ? (petsData as PetData[]) : [];
}

function getPetName(pet: PetData): string {
  const localized = pet.localized;
  const zh = localized && typeof localized === 'object' && !Array.isArray(localized) ? (localized as Record<string, unknown>).zh : undefined;
  const zhName = zh && typeof zh === 'object' && !Array.isArray(zh) ? normalizeText((zh as Record<string, unknown>).name) : '';

  return zhName || normalizeText(pet.name) || '未知精灵';
}

function getPetType(pet: PetData): string {
  const mainType = pet.main_type && typeof pet.main_type === 'object' && !Array.isArray(pet.main_type) ? (pet.main_type as Record<string, unknown>) : {};
  const subType = pet.sub_type && typeof pet.sub_type === 'object' && !Array.isArray(pet.sub_type) ? (pet.sub_type as Record<string, unknown>) : {};
  const values = [mainType.localized, subType.localized]
    .map(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return '';
      }

      return normalizeText((item as Record<string, unknown>).zh);
    })
    .filter(Boolean);

  return values.length > 0 ? values.join(' / ') : '未知';
}

function getEggGroups(pet: PetData): number[] {
  const profile =
    pet.breeding_profile && typeof pet.breeding_profile === 'object' && !Array.isArray(pet.breeding_profile)
      ? (pet.breeding_profile as Record<string, unknown>)
      : {};
  const groups = Array.isArray(profile.egg_groups) ? profile.egg_groups : [];

  return groups.map(item => Number(item)).filter(item => Number.isFinite(item));
}

function formatEggGroups(groups: number[]): string {
  if (groups.length === 0) {
    return '暂无蛋组数据';
  }

  return groups.map(item => EGG_GROUP_META[item] || `蛋组${item}`).join(' / ');
}

function searchPet(keyword: string): SearchResult {
  const normalized = normalizeText(keyword);

  if (!normalized) {
    return {
      matchType: 'not_found',
      pet: null,
      candidates: []
    };
  }

  const pets = getPets();
  const exact = pets.find(
    item => getPetName(item) === normalized || normalizeText(item.name).toLowerCase() === normalized.toLowerCase() || String(item.id) === normalized
  );

  if (exact) {
    return {
      matchType: 'exact',
      pet: exact,
      candidates: []
    };
  }

  const keywordLower = normalized.toLowerCase();
  const hits = pets.filter(item => {
    const zhName = getPetName(item).toLowerCase();
    const enName = normalizeText(item.name).toLowerCase();

    return zhName.includes(keywordLower) || enName.includes(keywordLower);
  });

  if (hits.length === 1) {
    return {
      matchType: 'fuzzy',
      pet: hits[0],
      candidates: []
    };
  }

  if (hits.length > 1) {
    return {
      matchType: 'multi',
      pet: null,
      candidates: hits.slice(0, 20)
    };
  }

  return {
    matchType: 'not_found',
    pet: null,
    candidates: []
  };
}

function getCompatiblePets(pet: PetData): PetData[] {
  const pets = getPets();
  const petId = Number(pet.id);
  const groups = new Set(getEggGroups(pet));

  if (!groups.size || groups.has(1)) {
    return [];
  }

  return pets.filter(item => {
    const currentId = Number(item.id);

    if (Number.isFinite(petId) && Number.isFinite(currentId) && petId === currentId) {
      return false;
    }

    const targetGroups = new Set(getEggGroups(item));

    if (!targetGroups.size || targetGroups.has(1)) {
      return false;
    }

    return [...groups].some(groupId => targetGroups.has(groupId));
  });
}

function evaluatePair(mother: PetData, father: PetData): { compatible: boolean; reasons: string[]; sharedGroups: number[] } {
  const motherGroups = new Set(getEggGroups(mother));
  const fatherGroups = new Set(getEggGroups(father));
  const sharedGroups = [...motherGroups].filter(item => fatherGroups.has(item)).sort((a, b) => a - b);
  const reasons: string[] = [];

  if (!motherGroups.size) {
    reasons.push(`${getPetName(mother)} 暂无蛋组数据`);
  }

  if (!fatherGroups.size) {
    reasons.push(`${getPetName(father)} 暂无蛋组数据`);
  }

  if (motherGroups.has(1)) {
    reasons.push(`${getPetName(mother)} 属于「未发现」蛋组`);
  }

  if (fatherGroups.has(1)) {
    reasons.push(`${getPetName(father)} 属于「未发现」蛋组`);
  }

  if (sharedGroups.length === 0 && reasons.length === 0) {
    reasons.push('蛋组不相同，无法配种');
  }

  return {
    compatible: reasons.length === 0 && sharedGroups.length > 0,
    reasons,
    sharedGroups
  };
}

function tryParseNumber(value: string): number | null {
  const numeric = Number(value);

  return Number.isFinite(numeric) ? numeric : null;
}

function parsePrefixedNumber(value: string, prefixes: string[]): number | null {
  const text = normalizeText(value);

  for (const prefix of prefixes) {
    if (!text.startsWith(prefix)) {
      continue;
    }

    return tryParseNumber(text.slice(prefix.length));
  }

  return null;
}

function parseEggArgs(rawText: string): { name: string; height: number | null; weight: number | null } {
  const raw = normalizeText(rawText);
  const tokens = raw.split(/\s+/u).filter(Boolean);
  const nameParts: string[] = [];
  const numericParts: number[] = [];
  let height: number | null = null;
  let weight: number | null = null;

  for (const token of tokens) {
    const parsedHeight = parsePrefixedNumber(token, ['身高', 'h', 'H']);

    if (parsedHeight !== null) {
      height = parsedHeight;
      continue;
    }

    const parsedWeight = parsePrefixedNumber(token, ['体重', 'w', 'W']);

    if (parsedWeight !== null) {
      weight = parsedWeight;
      continue;
    }

    const numeric = tryParseNumber(token);

    if (numeric !== null) {
      numericParts.push(numeric);
      continue;
    }

    nameParts.push(token);
  }

  if (height === null && numericParts.length > 0) {
    height = numericParts[0];
  }

  if (weight === null && numericParts.length > 1) {
    weight = numericParts[1];
  }

  return {
    name: nameParts.join(' ').trim(),
    height,
    weight
  };
}

export async function getRocomEggQuery(rawText: string) {
  const parsed = parseEggArgs(rawText);

  if (parsed.height !== null || parsed.weight !== null) {
    const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/pet/size-query', {
      method: 'GET',
      params: {
        diameter: parsed.height !== null ? String(parsed.height / 100) : '',
        weight: parsed.weight !== null ? String(parsed.weight) : ''
      }
    });

    return {
      mode: 'size' as const,
      parsed,
      payload
    };
  }

  if (!parsed.name) {
    throw new Error('格式：#洛克查蛋 <精灵名> 或 +查蛋 <身高cm> <体重kg>');
  }

  const result = searchPet(parsed.name);

  if (result.matchType === 'multi') {
    return {
      mode: 'multi' as const,
      keyword: parsed.name,
      candidates: result.candidates
    };
  }

  if (result.matchType === 'not_found' || !result.pet) {
    throw new Error(`未找到名为「${parsed.name}」的精灵`);
  }

  return {
    mode: 'pet' as const,
    keyword: parsed.name,
    matchType: result.matchType,
    pet: result.pet,
    compatiblePets: getCompatiblePets(result.pet)
  };
}

export function buildRocomEggQueryText(
  result:
    | { mode: 'size'; parsed: { height: number | null; weight: number | null }; payload: Record<string, unknown> }
    | { mode: 'multi'; keyword: string; candidates: PetData[] }
    | { mode: 'pet'; keyword: string; matchType: 'exact' | 'fuzzy'; pet: PetData; compatiblePets: PetData[] }
): string {
  if (result.mode === 'size') {
    const exact = Array.isArray(result.payload.exactResults) ? (result.payload.exactResults as Array<Record<string, unknown>>) : [];
    const candidates = Array.isArray(result.payload.candidates) ? (result.payload.candidates as Array<Record<string, unknown>>) : [];
    const lines = [
      '查蛋尺寸反查',
      result.parsed.height !== null ? `身高：${result.parsed.height} cm` : '',
      result.parsed.weight !== null ? `体重：${result.parsed.weight} kg` : '',
      ''
    ].filter(Boolean);

    if (exact.length === 0 && candidates.length === 0) {
      lines.push('未找到符合条件的精灵。');

      return lines.join('\n');
    }

    if (exact.length > 0) {
      lines.push(`完美匹配：${exact.length} 只`);
      exact.slice(0, 10).forEach((item, index) => {
        lines.push(`${index + 1}. ${normalizeText(item.pet)} (#${normalizeText(item.petId) || '-'})`);
      });
      lines.push('');
    }

    if (candidates.length > 0) {
      lines.push(`范围匹配：${candidates.length} 只`);
      candidates.slice(0, 10).forEach((item, index) => {
        lines.push(`${index + 1}. ${normalizeText(item.pet)} (#${normalizeText(item.petId) || '-'})`);
      });
    }

    return lines.join('\n').trim();
  }

  if (result.mode === 'multi') {
    return [
      `「${result.keyword}」匹配到 ${result.candidates.length} 只精灵，请精确输入：`,
      ...result.candidates.slice(0, 10).map((item, index) => {
        return `${index + 1}. ${getPetName(item)} (#${normalizeText(item.id) || '-'}) - ${getPetType(item)} · ${formatEggGroups(getEggGroups(item))}`;
      })
    ].join('\n');
  }

  const lines = [
    result.matchType === 'fuzzy' ? `模糊匹配到「${getPetName(result.pet)}」` : '',
    `${getPetName(result.pet)} (#${normalizeText(result.pet.id) || '-'})`,
    `属性：${getPetType(result.pet)}`,
    `蛋组：${formatEggGroups(getEggGroups(result.pet))}`,
    `可配种候选：${result.compatiblePets.length} 只`,
    ''
  ].filter(Boolean);

  result.compatiblePets.slice(0, 15).forEach((item, index) => {
    lines.push(`${index + 1}. ${getPetName(item)} - ${formatEggGroups(getEggGroups(item))}`);
  });

  if (result.compatiblePets.length === 0) {
    lines.push('当前没有可配种候选，或该精灵属于未发现蛋组。');
  }

  return lines.join('\n');
}

export function getRocomBreedingQuery(rawText: string): string {
  const raw = normalizeText(rawText);

  if (!raw) {
    throw new Error('格式：#洛克配种 <精灵名> 或 +配种 <父体> <母体>');
  }

  const names = raw.split(/\s+/u).filter(Boolean);

  if (names.length === 1) {
    const result = searchPet(names[0]);

    if (result.matchType === 'multi') {
      return [
        `「${names[0]}」匹配到 ${result.candidates.length} 只精灵，请精确输入：`,
        ...result.candidates.slice(0, 10).map((item, index) => `${index + 1}. ${getPetName(item)} (#${normalizeText(item.id) || '-'})`)
      ].join('\n');
    }

    if (result.matchType === 'not_found' || !result.pet) {
      throw new Error(`未找到名为「${names[0]}」的精灵`);
    }

    const fathers = getCompatiblePets(result.pet);
    const lines = [`想要孵出「${getPetName(result.pet)}」：`, `蛋组：${formatEggGroups(getEggGroups(result.pet))}`, ''];

    if (getEggGroups(result.pet).includes(1)) {
      lines.push('该精灵属于「未发现」蛋组，无法通过配种获得。');

      return lines.join('\n');
    }

    lines.push(`母体必须是「${getPetName(result.pet)}」`);
    fathers.slice(0, 15).forEach((item, index) => {
      lines.push(`${index + 1}. ${getPetName(item)} - ${formatEggGroups(getEggGroups(item))}`);
    });

    return lines.join('\n');
  }

  const fatherName = names[0];
  const motherName = names.slice(1).join(' ');
  const fatherResult = searchPet(fatherName);
  const motherResult = searchPet(motherName);

  if (fatherResult.matchType === 'multi') {
    return [
      `「${fatherName}」匹配到 ${fatherResult.candidates.length} 只精灵，请精确输入：`,
      ...fatherResult.candidates.slice(0, 10).map((item, index) => `${index + 1}. ${getPetName(item)} (#${normalizeText(item.id) || '-'})`)
    ].join('\n');
  }

  if (fatherResult.matchType === 'not_found' || !fatherResult.pet) {
    throw new Error(`未找到名为「${fatherName}」的精灵`);
  }

  if (motherResult.matchType === 'multi') {
    return [
      `「${motherName}」匹配到 ${motherResult.candidates.length} 只精灵，请精确输入：`,
      ...motherResult.candidates.slice(0, 10).map((item, index) => `${index + 1}. ${getPetName(item)} (#${normalizeText(item.id) || '-'})`)
    ].join('\n');
  }

  if (motherResult.matchType === 'not_found' || !motherResult.pet) {
    throw new Error(`未找到名为「${motherName}」的精灵`);
  }

  const pair = evaluatePair(motherResult.pet, fatherResult.pet);
  const lines = [
    `父体：${getPetName(fatherResult.pet)} - ${formatEggGroups(getEggGroups(fatherResult.pet))}`,
    `母体：${getPetName(motherResult.pet)} - ${formatEggGroups(getEggGroups(motherResult.pet))}`,
    '',
    pair.compatible ? '可以配种。' : '无法配种。'
  ];

  if (pair.sharedGroups.length > 0) {
    lines.push(`共同蛋组：${formatEggGroups(pair.sharedGroups)}`);
  }

  if (pair.reasons.length > 0) {
    lines.push(...pair.reasons.map(item => `- ${item}`));
  }

  lines.push('', '提示：默认前父后母，孵蛋结果跟随后者。');

  return lines.join('\n');
}
