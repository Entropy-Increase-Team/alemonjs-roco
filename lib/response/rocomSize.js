import RocomEggSizeCard from "../img/views/RocomEggSizeCard.js";
import { buildRocomSizeCardData, buildRocomSizeText, getRocomSizeQuery } from "../model/rocomExtraQuery.js";
import { Format, useMessage, useRoute } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/rocomSize.ts
var rocomSize_default = async () => {
	const [route] = useRoute();
	const [message] = useMessage();
	const statusFormat = Format.create();
	const statusMarkdown = Format.createMarkdown();
	const format = Format.create();
	const md = Format.createMarkdown();
	const rawArgs = String(route.rawArgs ?? "").trim();
	try {
		statusMarkdown.addText("正在查询精灵尺寸，请稍后...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const result = await getRocomSizeQuery(rawArgs);
		const img = await renderComponentIsHtmlToBuffer(RocomEggSizeCard, { data: buildRocomSizeCardData(result) });
		if (typeof img !== "boolean") {
			format.addImage(img);
			message.send({ format });
			return;
		}
		md.addText(buildRocomSizeText(result));
	} catch (error) {
		md.addText(error instanceof Error ? error.message : "工具查询失败");
	}
	format.addMarkdown(md);
	message.send({ format });
};

export { rocomSize_default as default };