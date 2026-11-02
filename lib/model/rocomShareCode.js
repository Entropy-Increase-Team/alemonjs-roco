import { getWeGameRuntimeConfig, requestWeGame } from './wegameAccount.js';
import { getPetMeta } from './rocomHomePets.js';
import natureMapRaw from '../data/rocom/nature_map.json.js';

const ELEMENT_COLORS = {
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
function normalizeText(value) {
    return String(value ?? '').trim();
}
function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}
function normalizeResourceUrl(value = '', baseUrl = '') {
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
function parseRocomShareCode(shareCode, userIdentifier = '') {
    return requestWeGame('/api/v1/games/rocom/tools/share-code/parse', {
        method: 'POST',
        data: { share_code: shareCode },
        headers: {
            'X-User-Identifier': userIdentifier,
            'Content-Type': 'application/json'
        }
    });
}
const natureMap = natureMapRaw;
function getNatureEntry(natureId) {
    return natureMap[normalizeText(natureId)] || {};
}
function normalizeShareCodeTeam(payload = {}, baseUrl = '') {
    const data = payload.data && typeof payload.data === 'object' ? payload.data : payload;
    const teams = Array.isArray(data.teams) ? data.teams : [];
    const spriteCount = toNumber(data.sprite_count ?? data.spriteCount, teams.length) || teams.length;
    return {
        share_code: normalizeText(data.share_code || data.shareCode),
        mode_name: normalizeText(data.mode?.name) || '阵容分享',
        magic_icon: normalizeResourceUrl(data.magic?.icon, baseUrl),
        sprite_count: spriteCount,
        count_label: `/ ${spriteCount} 精灵`,
        teams: teams
            .map(raw => raw)
            .slice()
            .sort((a, b) => toNumber(a.slot, 0) - toNumber(b.slot, 0))
            .map((team, index) => normalizeShareCodePet(team, index, baseUrl))
    };
}
function normalizeShareCodePet(team = {}, index = 0, baseUrl = '') {
    const pet = (team.pet && typeof team.pet === 'object' ? team.pet : {});
    const petId = normalizeText(pet.id || team.pet_id || team.id);
    const petMeta = getPetMeta(petId);
    const bloodline = (team.bloodline && typeof team.bloodline === 'object' ? team.bloodline : {});
    const bloodlineName = normalizeText(bloodline.name);
    const bloodlineElement = bloodlineName.replace(/系血脉$/u, '').replace(/血脉$/u, '') || '普通';
    const personality = (team.personality && typeof team.personality === 'object' ? team.personality : {});
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
            name: normalizeText((raw && typeof raw === 'object' ? raw.name || raw.label : raw) ?? '')
        }))
            .filter(item => item.name),
        skills: (Array.isArray(team.skills) ? team.skills : []).map(raw => {
            const skill = (raw && typeof raw === 'object' ? raw : {});
            return {
                name: normalizeText(skill.name || skill.skill_name) || '未知技能',
                icon: normalizeResourceUrl(skill.icon || skill.skill_img_url, baseUrl)
            };
        })
    };
}
function buildPetFallbackIcon(petId) {
    const numeric = Number(petId);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return '';
    }
    const id = numeric >= 3000 ? String(numeric) : String(numeric + 3000);
    return `https://game.gtimg.cn/images/rocom/rocodata/jingling/${id}/icon.png`;
}
async function getShareCodeBaseUrl() {
    const config = await getWeGameRuntimeConfig();
    return config.base_url.replace(/\/+$/u, '');
}

export { getShareCodeBaseUrl, normalizeShareCodeTeam, parseRocomShareCode };
