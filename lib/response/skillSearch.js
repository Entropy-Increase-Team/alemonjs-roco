import { searchSkill } from "../data/index.js";
import SkillWikiCard from "../img/views/SkillWikiCard.js";
import { Format, useMessage, useRoute } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/skillSearch.ts
var skillSearch_default = async () => {
	const [route] = useRoute();
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	const skillName = String(route.param("keyword") ?? "").trim();
	if (!skillName) {
		md.addText("[洛克王国] 请输入技能名，例如: #洛克技能 闪光冲击");
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const results = searchSkill(skillName);
	if (results.length === 0) {
		md.addText(`[洛克王国] 未找到技能「${skillName}」`);
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const primary = results[0];
	const img = await renderComponentIsHtmlToBuffer(SkillWikiCard, { data: {
		name: primary.skill.name,
		attribute: `${primary.skill.element}系`,
		category: primary.skill.type,
		cost: String(primary.skill.cost),
		power: String(primary.skill.power),
		description: primary.skill.desc || "暂无描述",
		commandHint: "#洛克技能 <技能名>",
		updatedAt: "--",
		resultHint: results.length > 1 ? `匹配结果：共 ${results.length} 条，当前展示第 1 条` : "匹配结果：共 1 条",
		copyright: "WeGame-plugin · RoCom Wiki"
	} });
	if (typeof img !== "boolean") {
		format.addImage(img);
		message.send({ format });
		return;
	}
	const lines = results.slice(0, 10).map(({ pet, skill }) => {
		return `【${pet.name}】${skill.name} | ${skill.element}系 | ${skill.type} | 威力:${skill.power} | 耗能:${skill.cost}\n  ${skill.desc}`;
	});
	const header = `[洛克王国] 技能搜索「${skillName}」找到 ${results.length} 条结果${results.length > 10 ? "（仅显示前10条）" : ""}:\n\n`;
	md.addText(header + lines.join("\n\n"));
	format.addMarkdown(md);
	message.send({ format });
};

export { skillSearch_default as default };