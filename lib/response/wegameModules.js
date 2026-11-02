import { buildWeGameCatalogText } from "../model/wegame.js";
import { Format, useMessage } from "alemonjs";

// src/response/wegameModules.ts
var wegameModules_default = () => {
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	md.addText(buildWeGameCatalogText());
	format.addMarkdown(md);
	message.send({ format });
};

export { wegameModules_default as default };