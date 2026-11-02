import { petList1 } from "./pets1.js";
import { petList10 } from "./pets10.js";
import { petList2 } from "./pets2.js";
import { petList3 } from "./pets3.js";
import { petList4 } from "./pets4.js";
import { petList5 } from "./pets5.js";
import { petList6 } from "./pets6.js";
import { petList7 } from "./pets7.js";
import { petList8 } from "./pets8.js";
import { petList9 } from "./pets9.js";

// src/data/index.ts
/** 全部宠物列表 */
const allPets = [
	...petList1,
	...petList2,
	...petList3,
	...petList4,
	...petList5,
	...petList6,
	...petList7,
	...petList8,
	...petList9,
	...petList10
];
/** 按名称查找宠物 (模糊匹配) */
function findPetByName(name) {
	const trimmed = name.trim();
	const exact = allPets.find((p) => p.name === trimmed);
	if (exact) return exact;
	return allPets.find((p) => p.name.includes(trimmed) || trimmed.includes(p.name));
}
/** 按 ID 查找宠物 */
function findPetById(id) {
	return allPets.find((p) => p.id === id);
}
/** 按属性过滤宠物 */
function filterPetsByElement(element) {
	return allPets.filter((p) => {
		const el = p.element;
		return Array.isArray(el) ? el.includes(element) : el === element;
	});
}
/** 搜索技能 (按名称模糊匹配, 返回宠物+技能) */
function searchSkill(skillName) {
	const results = [];
	const trimmed = skillName.trim();
	for (const pet of allPets) for (const skill of pet.skills) if (skill.name === trimmed || skill.name.includes(trimmed)) results.push({
		pet,
		skill
	});
	return results;
}
/** 获取宠物属性列表 (统一为数组) */
function getPetElements(pet) {
	return Array.isArray(pet.element) ? pet.element : [pet.element];
}
/** 计算种族值总和 */
function getTotalStats(pet) {
	return pet.hp + pet.atk + pet.mat + pet.def + pet.mdf + pet.spd;
}

export { allPets, filterPetsByElement, findPetById, findPetByName, getPetElements, getTotalStats, searchSkill };