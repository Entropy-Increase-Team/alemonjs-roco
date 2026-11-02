import { petSchema, projectPet, skillSchema } from "./schemas.js";
import { array, booleanSchema, dataQuery, emptyInput, keywordInput, numberSchema, object, query, record, stringSchema, text, uid } from "./shared.js";
import { findPetByName, searchSkill } from "../data/index.js";
import { queryActions } from "./queries.js";
import { writeActions } from "./writes.js";
import { accountActions } from "./accounts.js";
import { subscriptionActions } from "./subscriptions.js";
import "../model/api.js";
import { buildRocoMainHelpText } from "../model/rocom.js";
import { buildRocomAccountsText, getRocomAccounts } from "../model/rocomAccount.js";
import { buildRocomProfileText, getRocomProfile } from "../model/rocomQuery.js";
import { buildRocomHomeText, buildRocomRecordText, getRocomHome, getRocomRecord } from "../model/rocomExtraQuery.js";
import { Expose, ExposeError } from "alemonjs";

// src/expose/index.ts
const rocoExpose = Expose.create().provide({
	name: "roco",
	version: "2.0.0",
	description: "洛克王国资料查询、账号管理、交换及订阅操作；身份来自当前消息，管理接口校验机器人管理员。",
	actions: {
		...queryActions,
		...writeActions,
		...accountActions,
		...subscriptionActions,
		get_help: query("查询洛克帮助与指令说明", emptyInput, () => buildRocoMainHelpText()),
		get_accounts: query("查询当前消息用户的洛克角色列表", emptyInput, async (_input, user) => {
			const result = await getRocomAccounts(user);
			return buildRocomAccountsText(result.accounts, result.bindingsTotal);
		}),
		get_profile: query("查询当前消息用户已登录角色的档案", emptyInput, async (_input, user) => buildRocomProfileText(await getRocomProfile(user))),
		get_home: query("查询家园，省略 UID 时使用当前绑定角色", object({ uid: text }), async (input, user) => buildRocomHomeText(await getRocomHome(user, input.uid ? uid(input.uid) : ""))),
		get_record: query("分页查询当前消息用户的大赛战绩", {
			type: "object",
			properties: { page: {
				type: "integer",
				minimum: 1,
				maximum: 100
			} },
			additionalProperties: false
		}, async (input, user) => buildRocomRecordText(await getRocomRecord(user, String(input.page ?? 1)))),
		find_pet: dataQuery("按名称查询本地精灵图鉴", {
			...keywordInput,
			required: ["keyword"]
		}, record({
			found: booleanSchema,
			pets: array(petSchema)
		}), (input) => {
			const keyword = input.keyword.trim();
			if (!keyword) throw new ExposeError("INVALID_INPUT", "精灵名称不能为空");
			const pet = findPetByName(keyword);
			return {
				found: Boolean(pet),
				pets: pet ? [projectPet(pet)] : []
			};
		}),
		find_skill: dataQuery("按名称查询本地技能及学习精灵，最多返回 50 项", {
			...keywordInput,
			required: ["keyword"]
		}, record({
			total: numberSchema,
			matches: array(record({
				petName: stringSchema,
				skill: skillSchema
			}))
		}), (input) => {
			const keyword = input.keyword.trim();
			if (!keyword) throw new ExposeError("INVALID_INPUT", "技能名称不能为空");
			const matches = searchSkill(keyword);
			return {
				total: matches.length,
				matches: matches.slice(0, 50).map(({ pet, skill }) => ({
					petName: pet.name,
					skill
				}))
			};
		})
	}
});

export { rocoExpose };