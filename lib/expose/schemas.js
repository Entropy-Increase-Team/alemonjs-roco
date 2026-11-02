import { array, booleanSchema, numberSchema, record, stringSchema, strings } from "./shared.js";

// src/expose/schemas.ts
const skillSchema = record({
	...strings("name", "element", "type", "desc"),
	cost: numberSchema,
	power: numberSchema
});
const petSchema = record({
	...strings("name", "avatar"),
	id: numberSchema,
	elements: array(stringSchema),
	hp: numberSchema,
	atk: numberSchema,
	mat: numberSchema,
	def: numberSchema,
	mdf: numberSchema,
	spd: numberSchema,
	trait: record(strings("name", "desc")),
	skills: array(skillSchema)
});
function projectPet(pet) {
	return {
		id: pet.id,
		name: pet.name,
		avatar: pet.avatar ?? "",
		elements: Array.isArray(pet.element) ? pet.element : [pet.element],
		hp: pet.hp,
		atk: pet.atk,
		mat: pet.mat,
		def: pet.def,
		mdf: pet.mdf,
		spd: pet.spd,
		trait: pet.trait,
		skills: pet.skills
	};
}
const homePet = record({
	...strings("id", "name", "level", "iconUrl", "fallbackIconUrl", "starIconUrl", "genderText", "weightText", "voiceText", "variantText", "eggText"),
	eggReady: booleanSchema
});
const homePetsSchema = record({
	...strings("title", "subtitle", "homeName", "uid", "emptyText", "updatedAt"),
	pets: array(homePet),
	total: numberSchema,
	eggCount: numberSchema
});
const homeSkill = record({
	...strings("name", "cost", "power", "families", "iconUrl", "fallbackIconUrl", "typeColor"),
	id: numberSchema,
	pos: numberSchema
});
const homeDetailPetSchema = record({
	...strings("status", "petId", "petGid", "npcId", "name", "defaultName", "level", "genderText", "natureText", "voiceText", "bloodText", "variantText", "errorText"),
	attributes: array(record({
		label: stringSchema,
		value: numberSchema,
		talent: numberSchema,
		effort: numberSchema
	})),
	equipSkills: array(homeSkill),
	learnedSkills: array(homeSkill)
});
const homeDetailSchema = record({
	uid: stringSchema,
	pets: array(homeDetailPetSchema),
	updatedAt: stringSchema
});
const teamSchema = record({
	...strings("share_code", "mode_name", "magic_icon", "count_label"),
	sprite_count: numberSchema,
	teams: array(record({
		slot: numberSchema,
		...strings("slotText", "color"),
		pet: record(strings("id", "name", "icon")),
		typeIcons: array(record(strings("name"))),
		bloodline: record(strings("name", "element", "icon")),
		personality: record(strings("id", "name", "up", "down")),
		ivs_detail: array(record(strings("name"))),
		skills: array(record(strings("name", "icon")))
	}))
});
const goods = record({
	...strings("goodsName", "iconUrl", "category", "remainingStr", "timeLabel"),
	price: numberSchema,
	limit: numberSchema,
	roundId: numberSchema,
	isHot: booleanSchema,
	isEnded: booleanSchema
});
const merchantTodaySchema = record({
	...strings("title", "subtitle", "dateStr", "currentRoundLabel", "currentCountdown"),
	totalProducts: numberSchema,
	rows: array(record({
		roundId: numberSchema,
		...strings("label", "timeLabel"),
		isCurrent: booleanSchema,
		items: array(goods)
	}))
});
const catalogSchema = array(record({
	index: numberSchema,
	name: stringSchema,
	goods_id: numberSchema,
	item_id: numberSchema,
	item_num: numberSchema
}));
const announcementSchema = record({
	id: numberSchema,
	...strings("title", "date", "category")
});
const announcementDetailSchema = record({
	id: numberSchema,
	...strings("title", "date", "author", "content", "coverUrl", "tagIds")
});
const eggPostSchema = record(strings("id", "have", "want", "note", "remark", "status", "reviewStatus", "createdAt"));
function projectPost(item) {
	return {
		id: String(item.post_id ?? item.id ?? ""),
		have: String(item.have_text ?? ""),
		want: String(item.want_text ?? ""),
		note: String(item.want_note ?? ""),
		remark: String(item.remark ?? ""),
		status: String(item.status ?? ""),
		reviewStatus: String(item.review_status ?? ""),
		createdAt: String(item.created_at ?? "")
	};
}
const eggFiltersSchema = record(strings("want_text", "have_text", "want_note", "id", "q"));
function projectFilters(value) {
	const data = value && typeof value === "object" ? value : {};
	return {
		want_text: String(data.want_text ?? ""),
		have_text: String(data.have_text ?? ""),
		want_note: String(data.want_note ?? ""),
		id: String(data.id ?? ""),
		q: String(data.q ?? "")
	};
}
const homeSubscriptionSchema = record({
	...strings("target_type", "bot_id", "group_id", "user_id", "target_uid", "last_push_time", "last_check_time", "updated_at"),
	mention_all: booleanSchema,
	last_egg_count: numberSchema,
	last_pushed_egg_count: numberSchema
});

export { announcementDetailSchema, announcementSchema, catalogSchema, eggFiltersSchema, eggPostSchema, homeDetailPetSchema, homeDetailSchema, homePetsSchema, homeSubscriptionSchema, merchantTodaySchema, petSchema, projectFilters, projectPet, projectPost, skillSchema, teamSchema };