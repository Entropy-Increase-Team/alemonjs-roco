import petsData from '../data/rocom/Pets.json.js';
import { requestWeGame } from './wegameAccount.js';

const EGG_GROUP_META = {
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
const PRECIOUS_EGG_META = {
    1: '金蛋',
    2: '银蛋',
    3: '铜蛋',
    4: '彩蛋',
    5: '特典蛋',
    6: '活动蛋',
    7: '异种蛋'
};
function normalizeText(value) {
    return String(value ?? '').trim();
}
function getPets() {
    return Array.isArray(petsData) ? petsData : [];
}
function getPetName(pet) {
    const localized = pet.localized;
    const zh = localized && typeof localized === 'object' && !Array.isArray(localized) ? localized.zh : undefined;
    const zhName = zh && typeof zh === 'object' && !Array.isArray(zh) ? normalizeText(zh.name) : '';
    return zhName || normalizeText(pet.name) || '未知精灵';
}
function getPetIcon(pet) {
    const direct = normalizeText(pet.icon_url ?? pet.avatar ?? pet.image);
    if (/^https?:\/\//u.test(direct)) {
        return direct;
    }
    const id = Number(pet.id);
    if (!Number.isFinite(id)) {
        return '';
    }
    const assetId = id >= 3000 ? id : id + 3000;
    return `https://game.gtimg.cn/images/rocom/rocodata/jingling/${assetId}/icon.png`;
}
function getPetType(pet) {
    const mainType = pet.main_type && typeof pet.main_type === 'object' && !Array.isArray(pet.main_type) ? pet.main_type : {};
    const subType = pet.sub_type && typeof pet.sub_type === 'object' && !Array.isArray(pet.sub_type) ? pet.sub_type : {};
    const values = [mainType.localized, subType.localized]
        .map(item => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            return '';
        }
        return normalizeText(item.zh);
    })
        .filter(Boolean);
    return values.length > 0 ? values.join(' / ') : '未知';
}
function getEggGroups(pet) {
    const profile = pet.breeding_profile && typeof pet.breeding_profile === 'object' && !Array.isArray(pet.breeding_profile)
        ? pet.breeding_profile
        : {};
    const groups = Array.isArray(profile.egg_groups) ? profile.egg_groups : [];
    return groups.map(item => Number(item)).filter(item => Number.isFinite(item));
}
function formatPercentArray(value) {
    if (!Array.isArray(value) || value.length < 2) {
        return '--';
    }
    return `${normalizeText(value[0])}/${normalizeText(value[1])}`;
}
function formatEggHatch(value) {
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds <= 0) {
        return '--';
    }
    if (seconds % 3600 === 0) {
        return `${seconds / 3600} 小时`;
    }
    if (seconds % 60 === 0) {
        return `${seconds / 60} 分钟`;
    }
    return `${seconds} 秒`;
}
function formatRange(low, high, unit) {
    const lowNum = Number(low);
    const highNum = Number(high);
    if (!Number.isFinite(lowNum) || !Number.isFinite(highNum)) {
        return '--';
    }
    return `${lowNum}-${highNum}${unit}`;
}
function getTotalStats(pet) {
    const stats = [
        Number(pet.base_hp),
        Number(pet.base_phy_atk),
        Number(pet.base_mag_atk),
        Number(pet.base_phy_def),
        Number(pet.base_mag_def),
        Number(pet.base_spd)
    ];
    if (stats.some(item => !Number.isFinite(item))) {
        return '--';
    }
    return String(stats.reduce((sum, item) => sum + item, 0));
}
function formatEggGroups(groups) {
    if (groups.length === 0) {
        return '暂无蛋组数据';
    }
    return groups.map(item => EGG_GROUP_META[item] || `蛋组${item}`).join(' / ');
}
function formatCandidateCard(pet) {
    const breeding = pet.breeding && typeof pet.breeding === 'object' && !Array.isArray(pet.breeding) ? pet.breeding : {};
    return {
        id: normalizeText(pet.id) || '-',
        name: getPetName(pet),
        typeLabel: getPetType(pet),
        eggGroupsLabel: formatEggGroups(getEggGroups(pet)),
        heightLabel: formatRange(breeding.height_low, breeding.height_high, ' cm'),
        weightLabel: formatRange(breeding.weight_low, breeding.weight_high, ' g')
    };
}
function formatRateLabel(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return '--';
    }
    return numeric
        .toFixed(2)
        .replace(/\.00$/u, '')
        .replace(/(\.\d)0$/u, '$1');
}
function searchPet(keyword) {
    const normalized = normalizeText(keyword);
    if (!normalized) {
        return {
            matchType: 'not_found',
            pet: null,
            candidates: []
        };
    }
    const pets = getPets();
    const exact = pets.find(item => getPetName(item) === normalized || normalizeText(item.name).toLowerCase() === normalized.toLowerCase() || String(item.id) === normalized);
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
function getCompatiblePets(pet) {
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
function evaluatePair(mother, father) {
    const motherGroups = new Set(getEggGroups(mother));
    const fatherGroups = new Set(getEggGroups(father));
    const sharedGroups = [...motherGroups].filter(item => fatherGroups.has(item)).sort((a, b) => a - b);
    const reasons = [];
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
function tryParseNumber(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
}
function parsePrefixedNumber(value, prefixes) {
    const text = normalizeText(value);
    for (const prefix of prefixes) {
        if (!text.startsWith(prefix)) {
            continue;
        }
        return tryParseNumber(text.slice(prefix.length));
    }
    return null;
}
function parseEggArgs(rawText) {
    const raw = normalizeText(rawText);
    const tokens = raw.split(/\s+/u).filter(Boolean);
    const nameParts = [];
    const numericParts = [];
    let height = null;
    let weight = null;
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
async function getRocomEggQuery(rawText) {
    const parsed = parseEggArgs(rawText);
    if (parsed.height !== null || parsed.weight !== null) {
        const payload = await requestWeGame('/api/v1/games/rocom/pet/size-query', {
            method: 'GET',
            params: {
                diameter: parsed.height !== null ? String(parsed.height / 100) : '',
                weight: parsed.weight !== null ? String(parsed.weight) : ''
            }
        });
        return {
            mode: 'size',
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
            mode: 'multi',
            keyword: parsed.name,
            candidates: result.candidates
        };
    }
    if (result.matchType === 'not_found' || !result.pet) {
        throw new Error(`未找到名为「${parsed.name}」的精灵`);
    }
    return {
        mode: 'pet',
        keyword: parsed.name,
        matchType: result.matchType,
        pet: result.pet,
        compatiblePets: getCompatiblePets(result.pet)
    };
}
function buildRocomEggCardData(result) {
    const pet = result.pet;
    const breeding = pet.breeding && typeof pet.breeding === 'object' && !Array.isArray(pet.breeding) ? pet.breeding : {};
    const profile = pet.breeding_profile && typeof pet.breeding_profile === 'object' && !Array.isArray(pet.breeding_profile)
        ? pet.breeding_profile
        : {};
    const groups = getEggGroups(pet);
    const isUndiscovered = groups.includes(1);
    const variants = Array.isArray(breeding.variants) ? breeding.variants : [];
    return {
        petName: getPetName(pet),
        petId: normalizeText(pet.id) || '-',
        petIcon: getPetIcon(pet),
        typeLabel: getPetType(pet),
        eggGroups: groups.map(item => EGG_GROUP_META[item] || `蛋组${item}`),
        eggGroupsLabel: formatEggGroups(groups),
        maleRate: Number.isFinite(Number(profile.male_rate)) ? Number(profile.male_rate) : null,
        femaleRate: Number.isFinite(Number(profile.female_rate)) ? Number(profile.female_rate) : null,
        hatchLabel: formatEggHatch(breeding.hatch_data),
        weightLabel: formatRange(breeding.weight_low, breeding.weight_high, ' g'),
        heightLabel: formatRange(breeding.height_low, breeding.height_high, ' cm'),
        totalStats: getTotalStats(pet),
        totalCompatible: String(result.compatiblePets.length),
        isUndiscovered,
        commandHint: '#洛克查蛋 <精灵名> / +查蛋 <精灵名>',
        copyright: 'WeGame-plugin · RoCom',
        sections: groups
            .filter(item => item !== 1)
            .map(groupId => {
            const members = result.compatiblePets.filter(item => getEggGroups(item).includes(groupId));
            return {
                id: String(groupId),
                label: EGG_GROUP_META[groupId] || `蛋组${groupId}`,
                count: String(members.length),
                members: members.slice(0, 30).map(item => ({
                    name: getPetName(item),
                    meta: `${getPetType(item)} · ${formatEggGroups(getEggGroups(item))}`
                })),
                hasMore: members.length > 30,
                remainCount: String(Math.max(0, members.length - 30))
            };
        }),
        eggDetails: Object.keys(breeding).length
            ? {
                preciousEggLabel: PRECIOUS_EGG_META[Number(breeding.precious_egg_type)] || '普通蛋',
                baseProbText: formatPercentArray(breeding.egg_base_glass_prob_array),
                addProbText: formatPercentArray(breeding.egg_add_glass_prob_array),
                contactAddText: breeding.is_contact_add_glass_prob ? '是' : '否',
                variantCount: String(variants.length)
            }
            : null
    };
}
function buildRocomEggCandidatesCardData(keyword, candidates) {
    return {
        keyword,
        count: String(candidates.length),
        candidates: candidates.slice(0, 20).map(formatCandidateCard),
        commandHint: '发送 #洛克查蛋 <精确名称> 或 +查蛋 <精确名称> 继续查询',
        copyright: 'WeGame-plugin · RoCom'
    };
}
function buildRocomBreedingWantCardData(target) {
    const profile = target.breeding_profile && typeof target.breeding_profile === 'object' && !Array.isArray(target.breeding_profile)
        ? target.breeding_profile
        : {};
    const groups = getEggGroups(target);
    const fathers = getCompatiblePets(target);
    return {
        target: {
            id: normalizeText(target.id) || '-',
            name: getPetName(target),
            typeLabel: getPetType(target)
        },
        eggGroupsLabel: formatEggGroups(groups),
        maleRateLabel: formatRateLabel(profile.male_rate),
        femaleRateLabel: formatRateLabel(profile.female_rate),
        isUndiscovered: groups.includes(1),
        fathers: fathers.slice(0, 20).map(formatCandidateCard),
        commandHint: '发送 #洛克配种 <父体> <母体> 或 +配种 <父体> <母体> 判断能否配种',
        copyright: 'WeGame-plugin · RoCom'
    };
}
function buildRocomEggQueryText(result) {
    if (result.mode === 'size') {
        const exact = Array.isArray(result.payload.exactResults) ? result.payload.exactResults : [];
        const candidates = Array.isArray(result.payload.candidates) ? result.payload.candidates : [];
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
function getRocomBreedingQuery(rawText) {
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
function getRocomBreedingResult(rawText) {
    const raw = normalizeText(rawText);
    if (!raw) {
        throw new Error('格式：#洛克配种 <精灵名> 或 +配种 <父体> <母体>');
    }
    const names = raw.split(/\s+/u).filter(Boolean);
    if (names.length === 1) {
        const result = searchPet(names[0]);
        if (result.matchType === 'exact' || result.matchType === 'fuzzy') {
            return {
                mode: 'want',
                text: getRocomBreedingQuery(rawText),
                data: buildRocomBreedingWantCardData(result.pet)
            };
        }
        return {
            mode: 'want',
            text: getRocomBreedingQuery(rawText),
            data: null
        };
    }
    const fatherName = names[0];
    const motherName = names.slice(1).join(' ');
    const fatherResult = searchPet(fatherName);
    if (fatherResult.matchType === 'multi') {
        return {
            mode: 'want',
            text: [
                `「${fatherName}」匹配到 ${fatherResult.candidates.length} 只精灵，请精确输入：`,
                ...fatherResult.candidates.slice(0, 10).map((item, index) => `${index + 1}. ${getPetName(item)} (#${normalizeText(item.id) || '-'})`)
            ].join('\n'),
            data: null
        };
    }
    if (fatherResult.matchType === 'not_found' || !fatherResult.pet) {
        throw new Error(`未找到名为「${fatherName}」的精灵`);
    }
    const motherResult = searchPet(motherName);
    if (motherResult.matchType === 'multi') {
        return {
            mode: 'want',
            text: [
                `「${motherName}」匹配到 ${motherResult.candidates.length} 只精灵，请精确输入：`,
                ...motherResult.candidates.slice(0, 10).map((item, index) => `${index + 1}. ${getPetName(item)} (#${normalizeText(item.id) || '-'})`)
            ].join('\n'),
            data: null
        };
    }
    if (motherResult.matchType === 'not_found' || !motherResult.pet) {
        throw new Error(`未找到名为「${motherName}」的精灵`);
    }
    const pair = evaluatePair(motherResult.pet, fatherResult.pet);
    const text = getRocomBreedingQuery(rawText);
    const breeding = motherResult.pet.breeding && typeof motherResult.pet.breeding === 'object' && !Array.isArray(motherResult.pet.breeding)
        ? motherResult.pet.breeding
        : {};
    return {
        mode: 'pair',
        text,
        data: {
            mother: {
                name: getPetName(motherResult.pet),
                typeLabel: getPetType(motherResult.pet),
                eggGroupsLabel: formatEggGroups(getEggGroups(motherResult.pet))
            },
            father: {
                name: getPetName(fatherResult.pet),
                typeLabel: getPetType(fatherResult.pet),
                eggGroupsLabel: formatEggGroups(getEggGroups(fatherResult.pet))
            },
            compatible: pair.compatible,
            reasons: pair.reasons,
            sharedEggGroupLabels: pair.sharedGroups.map(item => EGG_GROUP_META[item] || `蛋组${item}`),
            hatchLabel: formatEggHatch(breeding.hatch_data),
            weightLabel: formatRange(breeding.weight_low, breeding.weight_high, ' g'),
            heightLabel: formatRange(breeding.height_low, breeding.height_high, ' cm'),
            commandHint: '默认前父后母，孵蛋结果跟随后者；也可发送 #洛克配种 <精灵名> 查看目标方案',
            copyright: 'WeGame-plugin · RoCom'
        }
    };
}

export { buildRocomBreedingWantCardData, buildRocomEggCandidatesCardData, buildRocomEggCardData, buildRocomEggQueryText, getRocomBreedingQuery, getRocomBreedingResult, getRocomEggQuery };
