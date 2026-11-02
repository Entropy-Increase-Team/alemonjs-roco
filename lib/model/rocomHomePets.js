import petMetaRaw from '../data/rocom/pet_meta.json.js';
import skillListRaw from '../data/rocom/skill_list.json.js';
import natureMapRaw from '../data/rocom/nature_map.json.js';
import { requestWeGame, resolveActiveWeGameCredential } from './wegameAccount.js';
import { getRocomAccounts } from './rocomAccount.js';

const petMeta = petMetaRaw;
const skillList = skillListRaw;
const natureMap = natureMapRaw;
const ROCOM_HEADICON_BASE_URL = 'https://silverwing.elysia.beauty/RocomUID/resource/headicon';
const ROCOM_ICON_BASE_URL = 'https://silverwing.elysia.beauty/RocomUID/resource/rocomicon';
const ROCOM_SKILLICON_BASE_URL = 'https://silverwing.elysia.beauty/RocomUID/resource/skillicon';
const ROCOM_FEATUREICON_BASE_URL = 'https://silverwing.elysia.beauty/RocomUID/resource/characteristicicon';
const TYPE_COLORS = {
    普通: 'rgb(63, 137, 180)',
    草: 'rgb(78, 188, 115)',
    火: 'rgb(219, 85, 37)',
    水: 'rgb(106, 169, 254)',
    冰: 'rgb(95, 173, 221)',
    电: 'rgb(231, 197, 6)',
    毒: 'rgb(186, 98, 224)',
    恶: 'rgb(207, 70, 122)',
    光: 'rgb(79, 192, 255)',
    幻: 'rgb(159, 167, 248)',
    虫: 'rgb(158, 206, 33)',
    地: 'rgb(154, 126, 63)',
    机械: 'rgb(64, 203, 169)',
    龙: 'rgb(237, 73, 98)',
    萌: 'rgb(252, 124, 172)',
    武: 'rgb(255, 150, 54)',
    翼: 'rgb(62, 199, 202)',
    幽: 'rgb(148, 70, 236)',
    无: 'rgb(186, 187, 198)',
    污染: 'rgb(186, 187, 198)',
    首领: 'rgb(219, 85, 37)',
    奇异: 'rgb(232, 202, 49)'
};
const BLOOD_COLORS = {
    1: 'rgb(63, 137, 180)',
    2: 'rgb(78, 188, 115)',
    3: 'rgb(219, 85, 37)',
    4: 'rgb(106, 169, 254)',
    5: 'rgb(79, 192, 255)',
    6: 'rgb(154, 126, 63)',
    7: 'rgb(95, 173, 221)',
    8: 'rgb(237, 73, 98)',
    9: 'rgb(231, 197, 6)',
    10: 'rgb(186, 98, 224)',
    11: 'rgb(158, 206, 33)',
    12: 'rgb(255, 150, 54)',
    13: 'rgb(62, 199, 202)',
    14: 'rgb(252, 124, 172)',
    15: 'rgb(148, 70, 236)',
    16: 'rgb(207, 70, 122)',
    17: 'rgb(64, 203, 169)',
    18: 'rgb(159, 167, 248)',
    19: 'rgb(197, 66, 84)',
    21: 'rgb(219, 85, 37)',
    23: 'rgb(186, 187, 198)',
    24: 'rgb(232, 202, 49)'
};
const BLOOD_NAMES = {
    1: '普通',
    2: '草',
    3: '火',
    4: '水',
    5: '光',
    6: '地',
    7: '冰',
    8: '龙',
    9: '电',
    10: '毒',
    11: '虫',
    12: '武',
    13: '翼',
    14: '萌',
    15: '幽',
    16: '恶',
    17: '机械',
    18: '幻',
    19: '首领',
    21: '首领',
    23: '污染',
    24: '奇异'
};
const TYPE_ID_MAP = {
    2: '普通',
    3: '草',
    4: '火',
    5: '水',
    6: '光',
    7: '冰',
    8: '地',
    9: '冰',
    10: '龙',
    11: '电',
    12: '毒',
    13: '虫',
    14: '武',
    15: '翼',
    16: '萌',
    17: '幽',
    18: '恶',
    19: '机械',
    20: '幻',
    23: '污染'
};
const SKILL_FAMILY_ALIAS = {
    SDT_NONE: '无',
    SDT_RELAX: '无',
    NONE: '无',
    RELAX: '无',
    无属性: '无'
};
const ATTRIBUTE_ADD_TYPE_MAP = {
    1: 'hp',
    2: 'attack',
    3: 'special_attack',
    4: 'defense',
    5: 'special_defense',
    6: 'speed'
};
function normalizeText(value) {
    return String(value ?? '').trim();
}
function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}
function toRecord(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}
function normalizeTimestampSeconds(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) {
        return 0;
    }
    if (num > 1e14) {
        return Math.floor(num / 1000000);
    }
    if (num > 1e11) {
        return Math.floor(num / 1000);
    }
    return Math.floor(num);
}
function formatEggRemaining(targetTime, now = Math.floor(Date.now() / 1000)) {
    const target = normalizeTimestampSeconds(targetTime);
    if (!target || now >= target) {
        return '0分钟';
    }
    const remain = Math.max(0, target - now);
    const totalHours = Math.floor(remain / 3600);
    const minutes = Math.floor((remain % 3600) / 60);
    return `${totalHours}小时${minutes}分钟`;
}
function assetPetId(petId) {
    const numeric = Number(petId);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return '';
    }
    return numeric >= 3000 ? String(numeric) : String(numeric + 3000);
}
function buildPetIconUrl(petId) {
    const id = assetPetId(petId);
    if (!id) {
        return '';
    }
    return `https://game.gtimg.cn/images/rocom/rocodata/jingling/${id}/icon.png`;
}
function buildHeadIconUrl(petId, mutationType = 0) {
    const id = assetPetId(petId);
    if (!id) {
        return '';
    }
    const suffix = [1, 9].includes(toNumber(mutationType, 0)) ? '_1' : '';
    return `${ROCOM_HEADICON_BASE_URL}/${id}${suffix}.png`;
}
function buildRocomIconCandidates(iconName = '', mutationType = 0) {
    const name = normalizeText(iconName);
    if (!name) {
        return [];
    }
    const result = [];
    const suffix = [1, 9].includes(toNumber(mutationType, 0)) ? '_yise' : '';
    const yiseUrl = `${ROCOM_ICON_BASE_URL}/${encodeURIComponent(`${name}${suffix}`)}.png`;
    const normalUrl = `${ROCOM_ICON_BASE_URL}/${encodeURIComponent(name)}.png`;
    if (yiseUrl) {
        result.push(yiseUrl);
    }
    if (!result.includes(normalUrl)) {
        result.push(normalUrl);
    }
    return result;
}
function buildSkillIconUrl(iconId = '') {
    const id = normalizeText(iconId);
    if (!id) {
        return '';
    }
    return `${ROCOM_SKILLICON_BASE_URL}/${encodeURIComponent(id)}.png`;
}
function getTypeColor(name) {
    return TYPE_COLORS[name] || 'rgb(150,150,150)';
}
function getPetMeta(petId) {
    const key = normalizeText(petId);
    return petMeta[key] || petMeta[assetPetId(key)] || {};
}
function getSkillMeta(skillId) {
    return skillList[normalizeText(skillId)] || {};
}
function getNatureEntry(natureId) {
    return natureMap[normalizeText(natureId)] || {};
}
function pickPetDetailPayload(payload = {}) {
    const candidates = [payload.data, payload.result, toRecord(payload.data).data, toRecord(payload.result).data, payload];
    for (const candidate of candidates) {
        const record = toRecord(candidate);
        if (!record || Object.keys(record).length === 0) {
            continue;
        }
        if (record.home_info !== undefined || record.npc_pets !== undefined || record.rows !== undefined || record.uin !== undefined) {
            return record;
        }
    }
    return payload;
}
function collectHomePets(data) {
    const homeInfo = toRecord(data.home_info);
    const containers = [toRecord(homeInfo.friend_cell_home_brief_info), toRecord(homeInfo.cell_info), homeInfo, toRecord(data.friend_cell_home_brief_info)];
    const result = [];
    const seen = new Set();
    for (const container of containers) {
        const homePets = Array.isArray(container.home_pets) ? container.home_pets : [];
        for (const item of homePets) {
            const info = toRecord(toRecord(item).home_pet_info);
            const key = normalizeText(info.pet_gid || info.furniture_guid || `${info.pet_cfg_id || ''}:${info.name || ''}`);
            if (key && seen.has(key)) {
                continue;
            }
            if (key) {
                seen.add(key);
            }
            result.push(item);
        }
    }
    return result;
}
function pickObject(...items) {
    for (const item of items) {
        const record = toRecord(item);
        if (Object.keys(record).length > 0) {
            return record;
        }
    }
    return {};
}
function extractNpcFullPet(raw) {
    const npcPet = pickObject(raw.npc_pet, raw.npcPet);
    return pickObject(npcPet.pet, raw.pet, raw.detail, raw.display_info);
}
function extractNpcPetGid(raw) {
    const npcPet = pickObject(raw.npc_pet, raw.npcPet);
    const pet = pickObject(npcPet.pet, raw.pet);
    return normalizeText(raw.pet_gid || raw.petGid || npcPet.pet_gid || pet.pet_gid);
}
function buildHomePetFromNpc(raw) {
    const pet = extractNpcFullPet(raw);
    const petId = raw.pet_cfg_id || raw.pet_id || pet.base_conf_id || pet.pet_id || pet.id;
    return {
        home_pet_info: {
            pet_gid: raw.pet_gid || pet.pet_gid,
            npc_id: raw.npc_id || raw.npcId,
            pet_cfg_id: petId,
            furniture_guid: raw.furniture_guid,
            name: raw.name || pet.name,
            pet_default_name: raw.pet_default_name || pet.pet_default_name,
            speciality_id: raw.speciality_id || pet.speciality_id,
            real_speciality_ids: raw.real_speciality_ids || pet.real_speciality_ids || []
        },
        display_info: pet
    };
}
function isHomeGuardPet(homePetInfo, displayInfo, pet) {
    const status = homePetInfo.status ?? pet.status ?? displayInfo.status;
    const normalizedStatus = normalizeText(status).toLowerCase();
    const zeroCfgWithName = normalizeText(homePetInfo.pet_cfg_id || '0') === '0' && Boolean(normalizeText(homePetInfo.name || homePetInfo.pet_name));
    return (zeroCfgWithName ||
        Boolean(homePetInfo.is_guard || homePetInfo.guard || pet.is_guard || pet.guard || displayInfo.is_guard || displayInfo.guard) ||
        normalizedStatus === '2' ||
        normalizedStatus === 'guard');
}
function normalizeTypeName(value) {
    const text = normalizeText(value);
    if (!text) {
        return '';
    }
    return TYPE_ID_MAP[text] || SKILL_FAMILY_ALIAS[text] || text;
}
function normalizeSkillTypeName(value) {
    const name = normalizeTypeName(value);
    if (!name) {
        return '无';
    }
    return TYPE_COLORS[name] ? name : '无';
}
function buildTypeTags(meta, pet, displayInfo) {
    const petTypes = [];
    for (const key of ['main_type', 'sub_type']) {
        const entry = toRecord(pet[key]);
        const zh = toRecord(entry.localized).zh;
        if (normalizeText(zh)) {
            petTypes.push(zh);
        }
    }
    const rawTypes = Array.isArray(meta.unit_type) && meta.unit_type.length > 0
        ? meta.unit_type
        : Array.isArray(pet.unit_type)
            ? pet.unit_type
            : Array.isArray(displayInfo.unit_type)
                ? displayInfo.unit_type
                : petTypes;
    const result = [];
    const seen = new Set();
    for (const rawType of rawTypes) {
        const name = normalizeTypeName(rawType);
        if (!name || seen.has(name)) {
            continue;
        }
        seen.add(name);
        result.push({ name, color: TYPE_COLORS[name] || 'rgb(150,150,150)' });
    }
    return result;
}
function getSkillDetail(skill) {
    return pickObject(skill.skill, skill.skill_info, skill.skillInfo, skill.skill_conf, skill.skillConf, skill.conf, skill.config, skill.data);
}
function getSkillRawType(skill, detail) {
    return toNumber(skill.type ?? skill.skill_type ?? skill.skillType ?? detail.type ?? detail.skill_type ?? detail.skillType, 0);
}
function getSkillId(skill, detail) {
    return toNumber(skill.id ?? skill.skill_id ?? skill.skillId ?? detail.id ?? detail.skill_id ?? detail.skillId, 0);
}
function collectSkillDataLists(source) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
        return [];
    }
    const skill = pickObject(source.skill, source.skill_info, source.skillInfo);
    return [skill.skill_data, skill.skillData, source.skill_data, source.skillData, source.skill_list, source.skillList, source.skills].filter((item) => Array.isArray(item));
}
function pickPetSkillData(...sources) {
    for (const source of sources) {
        for (const list of collectSkillDataLists(toRecord(source))) {
            if (list.length > 0) {
                return list;
            }
        }
    }
    return [];
}
function findMappedSkillFamilies(meta, skillId) {
    return normalizeText(meta.skill_families?.[normalizeText(skillId)]);
}
function buildAttributeAddMap(...sources) {
    const result = {};
    for (const source of sources) {
        const record = toRecord(source);
        if (Object.keys(record).length === 0) {
            continue;
        }
        const attrNew = pickObject(record.attribute_new_info, record.attributeNewInfo);
        const list = Array.isArray(attrNew.addi_attr_data) ? attrNew.addi_attr_data : Array.isArray(attrNew.addiAttrData) ? attrNew.addiAttrData : [];
        for (const item of list) {
            const entry = toRecord(item);
            const key = ATTRIBUTE_ADD_TYPE_MAP[toNumber(entry.type, 0)];
            if (!key || result[key] !== undefined) {
                continue;
            }
            result[key] = toNumber(entry.addi_attr ?? entry.addiAttr ?? entry.value, 0);
        }
    }
    return result;
}
function pickFeatureObject(...sources) {
    for (const source of sources) {
        const record = toRecord(source);
        if (Object.keys(record).length === 0) {
            continue;
        }
        const feature = pickObject(record.feature, record.feature_info, record.featureInfo, record.speciality, record.speciality_info, record.specialityInfo, record.characteristic, record.characteristic_info, record.characteristicInfo);
        if (Object.keys(feature).length > 0) {
            return feature;
        }
    }
    return {};
}
function normalizeFeatureInfo(raw, rawId, meta) {
    const id = toNumber(rawId ||
        raw.id ||
        raw.skill_id ||
        raw.skillId ||
        raw.feature_id ||
        raw.featureId ||
        raw.speciality_id ||
        raw.specialityId ||
        raw.characteristic_id ||
        raw.characteristicId ||
        meta.speciality_id ||
        (Array.isArray(meta.real_speciality_ids) ? meta.real_speciality_ids[0] : 0), 0);
    if (!id && Object.keys(raw).length === 0) {
        return null;
    }
    const mappedSkill = id ? skillList[String(id)] || {} : {};
    const mappedFeature = toRecord(meta.feature);
    const name = normalizeText(raw.name ||
        raw.feature_name ||
        raw.featureName ||
        raw.speciality_name ||
        raw.specialityName ||
        raw.characteristic_name ||
        raw.characteristicName ||
        mappedFeature.name ||
        mappedSkill.name);
    const desc = normalizeText(raw.desc ||
        raw.description ||
        raw.feature_desc ||
        raw.featureDesc ||
        raw.speciality_desc ||
        raw.specialityDesc ||
        raw.characteristic_desc ||
        raw.characteristicDesc ||
        mappedFeature.desc ||
        mappedSkill.desc);
    return {
        id,
        name: name || (id ? `特性 ${id}` : '精灵特性'),
        desc
    };
}
function buildFeatureInfo(meta, pet, displayInfo, homePetInfo, skillSource) {
    const featureSkill = skillSource.find(skill => {
        const record = toRecord(skill);
        const detail = getSkillDetail(record);
        return getSkillRawType(record, detail) === 2;
    });
    if (featureSkill) {
        const record = toRecord(featureSkill);
        const detail = getSkillDetail(record);
        const id = getSkillId(record, detail);
        const feature = normalizeFeatureInfo({ ...detail, ...record }, id, meta);
        if (feature) {
            return feature;
        }
    }
    const apiFeature = pickFeatureObject(pet, displayInfo, homePetInfo);
    const apiFeatureId = pet.feature_id ??
        pet.featureId ??
        pet.speciality_id ??
        pet.specialityId ??
        pet.characteristic_id ??
        pet.characteristicId ??
        displayInfo.feature_id ??
        displayInfo.speciality_id ??
        displayInfo.characteristic_id ??
        homePetInfo.feature_id ??
        homePetInfo.speciality_id ??
        homePetInfo.characteristic_id;
    const apiFeatureInfo = normalizeFeatureInfo(apiFeature, apiFeatureId, meta);
    if (apiFeatureInfo && (apiFeatureInfo.id || apiFeatureInfo.name !== '精灵特性')) {
        return apiFeatureInfo;
    }
    const mappedFeatureInfo = normalizeFeatureInfo(toRecord(meta.feature), meta.feature?.id, meta);
    if (mappedFeatureInfo && (mappedFeatureInfo.id || mappedFeatureInfo.name !== '精灵特性')) {
        return mappedFeatureInfo;
    }
    const featureIds = [
        pet.speciality_id,
        displayInfo.speciality_id,
        homePetInfo.speciality_id,
        ...(Array.isArray(pet.real_speciality_ids) ? pet.real_speciality_ids : []),
        ...(Array.isArray(homePetInfo.real_speciality_ids) ? homePetInfo.real_speciality_ids : []),
        ...(Array.isArray(meta.real_speciality_ids) ? meta.real_speciality_ids : [])
    ];
    for (const rawId of featureIds) {
        const id = toNumber(rawId, 0);
        if (!id) {
            continue;
        }
        return normalizeFeatureInfo({}, id, meta);
    }
    return null;
}
function buildHomePetsRenderData(payload, uid) {
    const data = pickPetDetailPayload(payload);
    const homePets = collectHomePets(data);
    const npcPets = Array.isArray(data.npc_pets) ? data.npc_pets : [];
    const now = Math.floor(Date.now() / 1000);
    const npcMap = new Map();
    for (const raw of npcPets) {
        const record = toRecord(raw);
        const gid = extractNpcPetGid(record);
        if (gid) {
            npcMap.set(gid, record);
        }
    }
    const petSources = homePets.length > 0 ? homePets : npcPets.map(raw => buildHomePetFromNpc(toRecord(raw)));
    const pets = [];
    for (const source of petSources) {
        const hp = toRecord(source);
        const di = pickObject(hp.display_info, hp.displayInfo);
        const hi = pickObject(hp.home_pet_info, hp.homePetInfo, hp);
        const petGid = normalizeText(hi.pet_gid || di.pet_gid);
        const npcRaw = npcMap.get(petGid) ?? {};
        const npcFullPet = extractNpcFullPet(npcRaw);
        const npcStatus = normalizeText(npcRaw.status);
        const hasFull = Object.keys(npcFullPet).length > 0 && npcStatus !== 'error';
        const pet = hasFull ? npcFullPet : di;
        const petId = toNumber(pet.base_conf_id || pet.pet_id || pet.id || di.base_conf_id || hi.pet_cfg_id, 0);
        if (isHomeGuardPet(hi, di, pet) || !petId) {
            continue;
        }
        const meta = getPetMeta(petId);
        const petName = normalizeText(pet.name || hi.name || meta.name) || `精灵 ${petId || petGid}`.trim();
        const gender = toNumber(pet.gender ?? di.gender, 0);
        const genderText = gender === 1 ? '♂ 雄性' : gender === 2 ? '♀ 雌性' : '未知';
        const mutationType = toNumber(pet.mutation_type ?? di.mutation_type, 0);
        const variantText = normalizeText(pet.mutation_name || di.mutation_name) ||
            (mutationType === 9 ? '异色炫彩' : mutationType === 1 ? '异色' : mutationType === 8 ? '炫彩' : '');
        const starIconUrl = [1, 8, 9].includes(mutationType) ? `star_${mutationType}` : '';
        const rawWeight = pet.weight ?? di.weight ?? hi.weight ?? pet.pet_weight;
        const weightValue = Number(rawWeight);
        const weightText = Number.isFinite(weightValue) && weightValue > 0 ? `${weightValue}kg` : '--';
        const rawVoice = pet.voice ?? di.voice ?? hi.voice;
        const voiceText = rawVoice === undefined || rawVoice === null || rawVoice === '' ? '--' : String(rawVoice);
        const hasEgg = Boolean(hp.have_egg ?? pet.have_egg);
        const predictedEggTime = normalizeTimestampSeconds(hp.predicted_egg_time ?? pet.predicted_egg_time);
        const eggReady = hasEgg || (predictedEggTime > 0 && now >= predictedEggTime);
        const eggText = eggReady ? '可收蛋' : predictedEggTime > 0 ? `${formatEggRemaining(predictedEggTime, now)}后生蛋` : '';
        pets.push({
            id: String(petId || ''),
            name: petName,
            level: normalizeText(pet.level ?? di.level) || '--',
            iconUrl: buildHeadIconUrl(petId, mutationType) || buildPetIconUrl(petId),
            fallbackIconUrl: buildPetIconUrl(petId),
            starIconUrl,
            genderText,
            weightText,
            voiceText,
            variantText,
            eggReady,
            eggText
        });
    }
    pets.sort((a, b) => {
        if (a.eggReady !== b.eggReady) {
            return a.eggReady ? -1 : 1;
        }
        return 0;
    });
    const homeInfo = toRecord(data.home_info);
    const brief = toRecord(homeInfo.friend_home_brief_info) || toRecord(homeInfo.home_brief_info) || homeInfo;
    const homeName = normalizeText(brief.home_name || brief.name) || '洛克玩家';
    return {
        title: '家园精灵',
        subtitle: 'Home Pets',
        homeName,
        uid,
        pets,
        total: pets.length,
        eggCount: pets.filter(item => item.eggReady).length,
        emptyText: '未获取到家园精灵信息。请确认目标玩家在线、家园可访问，或稍后重试。',
        updatedAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };
}
function buildPetDetailRenderData(payload, uid) {
    const data = pickPetDetailPayload(payload);
    const npcPets = Array.isArray(data.npc_pets) ? data.npc_pets : [];
    const homePets = collectHomePets(data);
    const npcMap = new Map();
    for (const raw of npcPets) {
        const record = toRecord(raw);
        const gid = extractNpcPetGid(record);
        if (gid) {
            npcMap.set(gid, record);
        }
    }
    const petSources = homePets.length > 0 ? homePets : npcPets.map(raw => buildHomePetFromNpc(toRecord(raw)));
    const pets = [];
    for (const source of petSources) {
        const hp = toRecord(source);
        const di = pickObject(hp.display_info, hp.displayInfo);
        const hi = pickObject(hp.home_pet_info, hp.homePetInfo, hp);
        const petGid = normalizeText(hi.pet_gid || di.pet_gid);
        const npcRaw = npcMap.get(petGid) ?? {};
        const npcFullPet = extractNpcFullPet(npcRaw);
        const npcStatus = normalizeText(npcRaw.status);
        const hasFull = Object.keys(npcFullPet).length > 0 && npcStatus !== 'error';
        const pet = hasFull ? npcFullPet : di;
        const petId = toNumber(pet.base_conf_id || pet.pet_id || pet.id || di.base_conf_id || hi.pet_cfg_id, 0);
        if (isHomeGuardPet(hi, di, pet) || !petId) {
            continue;
        }
        const meta = getPetMeta(petId);
        const status = hasFull ? 'ok' : npcStatus === 'error' && Object.keys(di).length > 0 ? 'fallback' : npcStatus || 'fallback';
        const petName = normalizeText(pet.name || hi.name || meta.name) || `精灵 ${petId || petGid}`.trim();
        const defaultName = normalizeText(meta.form) || normalizeText(hi.pet_default_name || pet.pet_default_name || meta.name);
        const displayDefault = defaultName && defaultName !== petName ? defaultName : '';
        const gender = toNumber(pet.gender ?? di.gender, 0);
        const genderText = gender === 1 ? '♂ 雄性' : gender === 2 ? '♀ 雌性' : '未知';
        const mutationType = toNumber(pet.mutation_type ?? di.mutation_type, 0);
        const variantText = normalizeText(pet.mutation_name || di.mutation_name) ||
            (mutationType === 9 ? '异色炫彩' : mutationType === 1 ? '异色' : mutationType === 8 ? '炫彩' : '');
        const nature = toNumber(pet.nature ?? di.nature, 0);
        const natureEntry = getNatureEntry(nature);
        const natureText = normalizeText(natureEntry.name) || (nature ? `性格 ${nature}` : '');
        const rawVoice = pet.voice ?? di.voice;
        const voiceText = rawVoice === undefined || rawVoice === null || rawVoice === '' ? '' : normalizeText(rawVoice);
        const voiceValue = toNumber(rawVoice, 0);
        const voiceLabel = voiceText ? (voiceValue >= 96 && voiceValue <= 100 ? '婉转声' : voiceValue <= -96 && voiceValue >= -100 ? '粗嗓门' : '') : '';
        const bloodId = toNumber(pet.blood_id ?? di.blood_id, 0);
        const bloodText = BLOOD_NAMES[bloodId] || '';
        const bloodColor = BLOOD_COLORS[bloodId] || 'rgb(150,150,150)';
        const typeTags = buildTypeTags(meta, pet, di);
        const typeColor = typeTags.length > 0 ? typeTags[0].color : bloodColor;
        const attrSource = pickObject(pet.attribute_info, di.attribute_info);
        const attrAddMap = buildAttributeAddMap(pet, di);
        const attrKeys = ['hp', 'attack', 'special_attack', 'defense', 'special_defense', 'speed'];
        const attrLabels = ['HP', '物攻', '魔攻', '物防', '魔防', '速度'];
        const attributes = attrKeys.map((key, index) => {
            const attr = toRecord(attrSource[key]);
            return {
                label: attrLabels[index],
                value: attrAddMap[key] ?? toNumber(attr.value ?? attr.addi_attr ?? attr.base_value, 0),
                talent: toNumber(attr.talent, 0),
                effort: toNumber(attr.effort_add, 0)
            };
        });
        const skillSource = pickPetSkillData(pet, di, hi);
        const feature = buildFeatureInfo(meta, pet, di, hi, skillSource);
        const equipSkills = [];
        const learnedSkills = [];
        for (const rawSkill of skillSource) {
            const s = toRecord(rawSkill);
            const skillDetail = getSkillDetail(s);
            const skillType = getSkillRawType(s, skillDetail);
            if (skillType === 2 || (skillType && skillType !== 1)) {
                continue;
            }
            const skillId = getSkillId(s, skillDetail);
            if (!skillId) {
                continue;
            }
            const mappedSkill = skillList[String(skillId)] || {};
            const mappedFamilies = findMappedSkillFamilies(meta, skillId);
            const families = normalizeSkillTypeName(skillDetail.families || s.families || mappedFamilies || mappedSkill.families);
            const skillIconId = normalizeText(s.iconid ?? s.icon_id ?? s.iconId ?? skillDetail.iconid ?? skillDetail.icon_id ?? skillDetail.iconId ?? skillId) || String(skillId);
            const skillInfo = {
                id: skillId,
                pos: toNumber(s.pos ?? skillDetail.pos, 0),
                name: normalizeText(s.name || skillDetail.name || mappedSkill.name) || `技能 ${skillId}`,
                cost: normalizeText(s.cost ?? skillDetail.cost ?? mappedSkill.cost) || '--',
                power: normalizeText(s.power ?? skillDetail.power ?? mappedSkill.power) || '0',
                families,
                iconUrl: buildSkillIconUrl(skillIconId),
                fallbackIconUrl: buildSkillIconUrl('img_linshi'),
                typeColor: TYPE_COLORS[families] || 'rgb(150,150,150)'
            };
            const isEquipped = Boolean(s.is_equipped ?? s.isEquipped ?? s.equipped ?? skillDetail.is_equipped ?? skillDetail.isEquipped ?? skillDetail.equipped);
            if (isEquipped) {
                equipSkills.push(skillInfo);
            }
            learnedSkills.push(skillInfo);
        }
        equipSkills.sort((a, b) => (a.pos || 999) - (b.pos || 999));
        learnedSkills.sort((a, b) => (a.pos || 999) - (b.pos || 999));
        const bloodTag = bloodText ? { name: bloodText, icon: String(bloodId), color: bloodColor } : null;
        const petIconCandidates = buildRocomIconCandidates(meta.icon, mutationType);
        const featureIcon = feature?.id ? `${ROCOM_FEATUREICON_BASE_URL}/${feature.id}.png` : '';
        pets.push({
            status,
            petId: String(petId || ''),
            petGid,
            npcId: normalizeText(hi.npc_id || npcRaw.npc_id || npcRaw.npcId),
            name: petName,
            defaultName: displayDefault,
            level: normalizeText(pet.level ?? di.level) || '--',
            genderText,
            natureText,
            voiceText,
            voiceLabel,
            bloodText,
            bloodColor,
            typeTags,
            typeColor,
            bloodTag,
            iconUrl: petIconCandidates[0] || buildHeadIconUrl(petId, mutationType) || buildPetIconUrl(petId),
            fallbackIconUrl: petIconCandidates[1] || buildPetIconUrl(petId),
            variantText,
            starIconUrl: [1, 8, 9].includes(mutationType) ? `star_${mutationType}` : '',
            featureIcon,
            feature,
            attributes,
            equipSkills,
            learnedSkills,
            errorText: status === 'error' ? normalizeText(npcRaw.error || npcRaw.message || toRecord(npcRaw.npc_pet).error_message) : ''
        });
    }
    return {
        title: '精灵状态',
        subtitle: 'Ingame Pet Data',
        uid: normalizeText(data.uin || uid) || '--',
        pets,
        emptyText: '未获取到家园精灵完整数据。请确认目标玩家在线、家园可访问，或稍后重试。',
        updatedAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };
}
async function resolveHomeUid(context, rawArgs) {
    const uid = normalizeText(rawArgs);
    if (uid) {
        return uid;
    }
    try {
        const data = await getRocomAccounts(context);
        const primary = data.accounts.find(item => item.isPrimary) ?? data.accounts[0];
        if (primary?.roleId) {
            return normalizeText(primary.roleId);
        }
    }
    catch {
    }
    const { credential } = await resolveActiveWeGameCredential(context);
    const credentialUid = normalizeText(credential?.role?.id);
    if (credentialUid) {
        return credentialUid;
    }
    throw new Error('未提供 UID，且当前没有可用的已绑定洛克角色。请先发送 +账号列表 或 +家园精灵 <UID>');
}
function hasPetDetailContent(payload) {
    const data = pickPetDetailPayload(payload);
    return Array.isArray(data.npc_pets) || collectHomePets(data).length > 0;
}
function isPendingTaskStatus(status) {
    return ['queued', 'pending', 'running', 'processing', 'accepted'].includes(status);
}
function isFailedTaskStatus(status) {
    return ['failed', 'error', 'timeout', 'cancelled', 'canceled'].includes(status);
}
function fetchIngameTask(taskId) {
    return requestWeGame(`/api/v1/games/rocom/ingame/tasks/${encodeURIComponent(taskId)}`, {
        method: 'GET'
    });
}
async function resolveIngamePetPayload(urlPath, params, options = {}) {
    let payload = await requestWeGame(urlPath, {
        method: options.method ?? 'GET',
        params: Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
        data: options.method === 'POST' ? params : undefined
    });
    if (hasPetDetailContent(payload)) {
        return payload;
    }
    let taskId = normalizeText(payload.task_id ?? payload.taskId);
    let queuedNotified = false;
    while (taskId) {
        if (!queuedNotified) {
            queuedNotified = true;
            await options.onQueued?.();
        }
        const startedAt = Date.now();
        const timeoutMs = 3 * 60 * 1000;
        const intervalMs = 5000;
        let status = normalizeText(payload.status).toLowerCase();
        while (Date.now() - startedAt < timeoutMs) {
            if (isFailedTaskStatus(status)) {
                throw new Error(`Ingame 任务失败：${normalizeText(payload.message || payload.error || status) || status}`);
            }
            if (!isPendingTaskStatus(status)) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, intervalMs));
            payload = await fetchIngameTask(taskId);
            if (hasPetDetailContent(payload)) {
                return payload;
            }
            const resultPayload = toRecord(payload.result);
            if (hasPetDetailContent(resultPayload)) {
                return resultPayload;
            }
            const dataPayload = toRecord(payload.data);
            if (hasPetDetailContent(dataPayload)) {
                return dataPayload;
            }
            status = normalizeText(payload.status).toLowerCase();
        }
        const nextTaskId = normalizeText(payload.task_id ?? payload.taskId);
        if (!nextTaskId || nextTaskId === taskId) {
            break;
        }
        taskId = nextTaskId;
    }
    return payload;
}
async function getRocomHomePets(context, rawUid, options = {}) {
    const uid = normalizeText(rawUid) || (await resolveHomeUid(context, ''));
    const payload = await resolveIngamePetPayload('/api/v1/games/rocom/ingame/home/pet-data', {
        uid,
        user_identifier: context.userIdentifier,
        wait_ms: 20000
    }, options);
    return {
        payload,
        renderData: buildHomePetsRenderData(payload, uid)
    };
}
async function getRocomHomePetDetail(context, uid, petGid = 0, npcId = 0, options = {}) {
    const data = {
        user_identifier: context.userIdentifier,
        wait_ms: 20000
    };
    if (petGid) {
        data.pet_gid = petGid;
    }
    if (npcId) {
        data.npc_id = npcId;
    }
    if (uid) {
        data.target_uin = uid;
    }
    const payload = await resolveIngamePetPayload('/api/v1/games/rocom/ingame/pet/data', data, options);
    const renderData = buildPetDetailRenderData(payload, uid);
    if (petGid || npcId) {
        const targetPetGid = String(petGid || '');
        const targetNpcId = String(npcId || '');
        const pickedPets = renderData.pets.filter(pet => (targetPetGid && pet.petGid === targetPetGid) || (targetNpcId && pet.npcId === targetNpcId));
        if (pickedPets.length > 0) {
            renderData.pets = pickedPets;
        }
    }
    return {
        payload,
        renderData
    };
}

export { buildHomePetsRenderData, formatEggRemaining, getPetMeta, getRocomHomePetDetail, getRocomHomePets, getSkillMeta, getTypeColor, hasPetDetailContent, normalizeTimestampSeconds };
