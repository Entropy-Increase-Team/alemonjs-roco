import RocomMerchantRoundCard from "../img/views/RocomMerchantRoundCard.js";
import { buildRocomMerchantRoundCardData, fetchRocomMerchantMergedInfo } from "../model/rocomMerchantRealtime.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/rocomMerchant.ts
var rocomMerchant_default = async () => {
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
		statusMarkdown.addText("正在查询远行商人信息...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		const payload = await fetchRocomMerchantMergedInfo(context.userIdentifier);
		const img = await renderComponentIsHtmlToBuffer(RocomMerchantRoundCard, { data: buildRocomMerchantRoundCardData(payload) });
		if (typeof img === "boolean") {
			md.addText("远行商人图片加载失败，请稍后重试");
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		format.addImage(img);
		message.send({ format });
	} catch (error) {
		md.addText(error instanceof Error ? error.message : "工具查询失败");
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomMerchant_default as default };