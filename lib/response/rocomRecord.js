import { buildRocomRecordCardData, buildRocomRecordText, getRocomRecord } from "../model/rocomExtraQuery.js";
import RocomRecordCard from "../img/views/RocomRecordCard.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage, useRoute } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/rocomRecord.ts
var rocomRecord_default = async () => {
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
		statusMarkdown.addText("正在查询闪耀大赛战绩，请稍后...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		const result = await getRocomRecord(context, rawArgs);
		const img = await renderComponentIsHtmlToBuffer(RocomRecordCard, { data: buildRocomRecordCardData(result) });
		if (typeof img === "boolean") {
			md.addText(buildRocomRecordText(result));
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		format.addImage(img);
	} catch (error) {
		md.addText(`查询大赛战绩失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	message.send({ format });
};

export { rocomRecord_default as default };