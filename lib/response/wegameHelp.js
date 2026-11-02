import WeGameHelpCard from "../img/views/WeGameHelp.js";
import { buildWeGameHelpText, getWeGameHelpCardData } from "../model/wegame.js";
import { Format, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/wegameHelp.ts
var wegameHelp_default = async () => {
	const [message] = useMessage();
	const data = getWeGameHelpCardData();
	if (!(Array.isArray(data.categories) && data.categories.some((group) => Array.isArray(group.items) && group.items.length > 0))) {
		const format = Format.create();
		const md = Format.createMarkdown();
		md.addText(buildWeGameHelpText());
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const img = await renderComponentIsHtmlToBuffer(WeGameHelpCard, { data });
	if (typeof img === "boolean") {
		const format = Format.create();
		const md = Format.createMarkdown();
		md.addText(buildWeGameHelpText());
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const format = Format.create();
	format.addImage(img);
	message.send({ format });
};

export { wegameHelp_default as default };