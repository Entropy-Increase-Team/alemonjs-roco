import ALemonJSHelpCard from "../img/views/Help.js";
import { buildRocoMainHelpText, getRocoMainHelpCardData } from "../model/rocom.js";
import { Format, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/rocomHelp.ts
var rocomHelp_default = async () => {
	const [message] = useMessage();
	const data = await getRocoMainHelpCardData();
	if (!(Array.isArray(data.categories) && data.categories.some((group) => Array.isArray(group.items) && group.items.length > 0))) {
		const format = Format.create();
		const md = Format.createMarkdown();
		md.addText(await buildRocoMainHelpText());
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const img = await renderComponentIsHtmlToBuffer(ALemonJSHelpCard, { data });
	if (typeof img === "boolean") {
		const format = Format.create();
		const md = Format.createMarkdown();
		md.addText(await buildRocoMainHelpText());
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const format = Format.create();
	format.addImage(img);
	message.send({ format });
};

export { rocomHelp_default as default };