import RocomActivityCalendarCard from "../img/views/RocomActivityCalendarCard.js";
import { buildActivityCalendarCardData, buildActivityCalendarText, fetchActivitiesInfo } from "../model/rocomActivities.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/rocomCalendar.ts
var rocomCalendar_default = async () => {
	const [event] = useEvent({ selects: [
		"private.message.create",
		"message.create",
		"interaction.create",
		"private.interaction.create"
	] });
	const [message] = useMessage();
	const statusFormat = Format.create();
	const statusMarkdown = Format.createMarkdown();
	const format = Format.create();
	const md = Format.createMarkdown();
	try {
		statusMarkdown.addText("正在查询活动日历...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		const payload = await fetchActivitiesInfo(false, context.userIdentifier);
		const cardData = buildActivityCalendarCardData(payload);
		const img = await renderComponentIsHtmlToBuffer(RocomActivityCalendarCard, { data: cardData });
		if (typeof img === "boolean") {
			md.addText(buildActivityCalendarText(payload));
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		format.addImage(img);
		message.send({ format });
	} catch (error) {
		md.addText(`活动日历查询失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomCalendar_default as default };