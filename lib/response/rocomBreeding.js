import RocomBreedingPairCard from "../img/views/RocomBreedingPairCard.js";
import RocomBreedingWantCard from "../img/views/RocomBreedingWantCard.js";
import { getRocomBreedingQuery, getRocomBreedingResult } from "../model/rocomEggs.js";
import { Format, useMessage, useRoute } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/rocomBreeding.ts
var rocomBreeding_default = async () => {
	const [route] = useRoute();
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	const rawArgs = String(route.rawArgs ?? "").trim();
	try {
		const result = getRocomBreedingResult(rawArgs);
		if (result.mode === "pair") {
			const img = await renderComponentIsHtmlToBuffer(RocomBreedingPairCard, { data: result.data });
			if (typeof img !== "boolean") {
				format.addImage(img);
				message.send({ format });
				return;
			}
		}
		if (result.mode === "want" && result.data) {
			const img = await renderComponentIsHtmlToBuffer(RocomBreedingWantCard, { data: result.data });
			if (typeof img !== "boolean") {
				format.addImage(img);
				message.send({ format });
				return;
			}
		}
		md.addText(result.mode === "want" ? result.text : result.text || getRocomBreedingQuery(rawArgs));
	} catch (error) {
		md.addText(error instanceof Error ? error.message : "查蛋或配种失败");
	}
	format.addMarkdown(md);
	message.send({ format });
};

export { rocomBreeding_default as default };