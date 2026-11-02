import { announcementDetailSchema, catalogSchema, merchantTodaySchema, teamSchema, homeDetailSchema, homePetsSchema, projectPet, announcementSchema, petSchema } from './schemas.js';
import { object, text, dataQuery, record, page, emptyInput, query, uid, numberSchema, array } from './shared.js';
import { filterPetsByElement, allPets } from '../data/index.js';
import { buildRocomPetListText, getRocomPetList } from '../model/rocomPets.js';
import { getRocomHomePetDetail, getRocomHomePets } from '../model/rocomHomePets.js';
import { buildRocomLineupDetailText, getRocomLineupDetail, buildRocomLineupListText, getRocomLineupList } from '../model/rocomLineup.js';
import { normalizeShareCodeTeam, getShareCodeBaseUrl, parseRocomShareCode } from '../model/rocomShareCode.js';
import { searchRocomPlayer, buildRocomSearchText } from '../model/rocomQuery.js';
import { getRocomCommandPrefixes } from '../model/rocom.js';
import { buildRocomSizeText, getRocomSizeQuery } from '../model/rocomExtraQuery.js';
import { getRocomBreedingQuery, buildRocomEggQueryText, getRocomEggQuery } from '../model/rocomEggs.js';
import { buildRocomExchangeText, getRocomExchangeHall } from '../model/rocomExchange.js';
import { buildActivityCalendarText, fetchActivitiesInfo } from '../model/rocomActivities.js';
import { buildRocomMerchantText, fetchRocomMerchantInfo } from '../model/rocomMerchant.js';
import { buildRocomMerchantTodayCardData, fetchRocomMerchantMergedInfo } from '../model/rocomMerchantRealtime.js';
import { getMerchantCatalog } from '../model/rocomMerchantCatalog.js';
import { fetchAnnouncementDetail, fetchAnnouncements, CATEGORY_TAG_MAP } from '../data/announcement.js';

const argsInput = object({ args: { ...text, description: '与对应聊天指令的参数一致，不含指令前缀；省略则使用业务默认值' } });
const queryActions = {
    list_pet_wiki: dataQuery('分页查询本地精灵图鉴，可按属性筛选，每页 20 项', object({ element: text, page }), record({ total: numberSchema, page: numberSchema, pets: array(petSchema) }), (input) => {
        const pets = input.element ? filterPetsByElement(input.element) : allPets;
        const current = input.page ?? 1;
        return { total: pets.length, page: current, pets: pets.slice((current - 1) * 20, current * 20).map(projectPet) };
    }),
    get_pets: query('查询当前角色精灵列表；args 为分类和页码，沿用精灵列表指令', argsInput, async (input, user) => buildRocomPetListText(await getRocomPetList(user, input.args ?? ''))),
    search_player: query('按 UID 查询玩家公开信息', object({ uid: text }, ['uid']), async (input, user) => {
        const result = await searchRocomPlayer(user, `${getRocomCommandPrefixes()[0]}uid ${uid(input.uid)}`);
        return buildRocomSearchText(result.uid, result.rows);
    }),
    get_home_pets: dataQuery('查询家园精灵，UID 省略时使用当前绑定角色', object({ uid: text }), homePetsSchema, async (input, user) => (await getRocomHomePets(user, input.uid ? uid(input.uid) : '')).renderData),
    get_home_pet_detail: dataQuery('查询目标家园精灵详情，目标玩家需要在线', object({
        uid: text,
        petGid: { type: 'integer', minimum: 1, maximum: Number.MAX_SAFE_INTEGER },
        npcId: { type: 'integer', minimum: 1, maximum: Number.MAX_SAFE_INTEGER }
    }, ['uid']), homeDetailSchema, async (input, user) => {
        const result = (await getRocomHomePetDetail(user, uid(input.uid), input.petGid, input.npcId)).renderData;
        return {
            uid: result.uid,
            updatedAt: result.updatedAt,
            pets: result.pets.map(({ status, petId, petGid, npcId, name, defaultName, level, genderText, natureText, voiceText, bloodText, variantText, errorText, attributes, equipSkills, learnedSkills }) => ({
                status,
                petId,
                petGid,
                npcId,
                name,
                defaultName,
                level,
                genderText,
                natureText,
                voiceText,
                bloodText,
                variantText,
                errorText,
                attributes,
                equipSkills,
                learnedSkills
            }))
        };
    }),
    get_lineups: query('查询阵容列表；args 为分类和页码', argsInput, async (input, user) => buildRocomLineupListText(await getRocomLineupList(user, input.args ?? ''))),
    get_lineup_detail: query('按阵容码查询阵容详情', object({ id: text }, ['id']), async (input, user) => buildRocomLineupDetailText(await getRocomLineupDetail(user, input.id))),
    parse_lineup: dataQuery('解析阵容分享码', object({ code: text }, ['code']), teamSchema, async (input, user) => normalizeShareCodeTeam(await parseRocomShareCode(input.code, user.userIdentifier), await getShareCodeBaseUrl())),
    query_egg: query('查蛋：args 为精灵名，或身高厘米与体重千克', object({ args: text }, ['args']), async (input) => buildRocomEggQueryText(await getRocomEggQuery(input.args))),
    query_breeding: query('配种资料查询：args 为精灵名，或父体名与母体名，以空格分隔', object({ args: text }, ['args']), input => getRocomBreedingQuery(input.args)),
    query_size: query('按直径米、重量千克反查精灵尺寸', object({ diameter: { type: 'number', minimum: 0 }, weight: { type: 'number', minimum: 0 } }, ['diameter', 'weight']), async (input) => buildRocomSizeText(await getRocomSizeQuery(`${input.diameter} ${input.weight}`))),
    get_exchange_hall: query('查询交换大厅；args 沿用交换大厅的页码、刷新参数', argsInput, async (input, user) => buildRocomExchangeText(await getRocomExchangeHall(user, input.args ?? ''))),
    get_calendar: query('查询活动日历', emptyInput, async (_input, user) => buildActivityCalendarText(await fetchActivitiesInfo(false, user.userIdentifier))),
    get_activity_image: query('获取活动指令使用的官方活动图片地址', emptyInput, () => 'https://game.gtimg.cn/images/rocom/act/a20250812preview/web/part4-avif/part4-img.avif'),
    get_merchant: query('查询远行商人信息', emptyInput, async () => buildRocomMerchantText(await fetchRocomMerchantInfo())),
    get_merchant_today: dataQuery('查询今日商人商品及价格', emptyInput, merchantTodaySchema, async (_input, user) => buildRocomMerchantTodayCardData(await fetchRocomMerchantMergedInfo(user.userIdentifier))),
    get_merchant_catalog: dataQuery('查询可订阅商人商品目录', emptyInput, catalogSchema, () => getMerchantCatalog()),
    get_announcements: dataQuery('查询公告、资讯或活动列表', object({ category: { type: 'string', enum: ['最新', '公告', '资讯', '活动'] }, page }), record({ items: array(announcementSchema), total: numberSchema, totalPages: numberSchema }), (input) => fetchAnnouncements(CATEGORY_TAG_MAP[input.category ?? '最新'], input.page ?? 1)),
    get_announcement_detail: dataQuery('按公告列表返回的 ID 查询正文', object({ id: { type: 'integer', minimum: 1 } }, ['id']), announcementDetailSchema, (input) => fetchAnnouncementDetail(input.id))
};

export { queryActions };
