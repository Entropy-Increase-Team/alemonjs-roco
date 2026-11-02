import { buildWeGameModuleManagementDisabledText } from "../model/wegame.js";
import { Format, useMessage } from "alemonjs";

// src/response/wegameUpdate.ts
var wegameUpdate_default = () => {
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	md.addText(buildWeGameModuleManagementDisabledText("update"));
	format.addMarkdown(md);
	message.send({ format });
};

export { wegameUpdate_default as default };