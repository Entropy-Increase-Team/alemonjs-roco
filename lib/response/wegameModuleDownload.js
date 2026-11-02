import { buildWeGameModuleManagementDisabledText } from "../model/wegame.js";
import { Format, useMessage } from "alemonjs";

// src/response/wegameModuleDownload.ts
var wegameModuleDownload_default = () => {
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	md.addText(buildWeGameModuleManagementDisabledText("download"));
	format.addMarkdown(md);
	message.send({ format });
};

export { wegameModuleDownload_default as default };