import { buildRocomExchangeText, getRocomExchangeHall } from "../model/rocomExchange.js";
import RocomExchangeCard from "../img/views/RocomExchangeCard.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage, useRoute } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/rocomExchange.ts
var rocomExchange_default = async () => {
	const [event] = useEvent({ selects: [
		"private.message.create",
		"message.create",
		"interaction.create",
		"private.interaction.create"
	] });
	const [route] = useRoute();
	const [message] = useMessage();
	const statusFormat = Format.create();
	const statusMarkdown = Format.createMarkdown();
	const format = Format.create();
	const md = Format.createMarkdown();
	const rawArgs = String(route.rawArgs ?? "").trim();
	try {
		statusMarkdown.addText("正在查询交换大厅，请稍后...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		const result = await getRocomExchangeHall(context, rawArgs);
		const img = await renderComponentIsHtmlToBuffer(RocomExchangeCard, { data: result });
		if (typeof img === "boolean") {
			md.addText(buildRocomExchangeText(result));
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		format.addImage(img);
	} catch (error) {
		md.addText(`查询交换大厅失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	message.send({ format });
};

export { rocomExchange_default as default };