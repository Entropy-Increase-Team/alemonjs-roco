import { updateModule } from "../model/rocomUpdate.js";
import { Format, useMessage } from "alemonjs";

// src/response/rocomUpdate.ts
var rocomUpdate_default = async () => {
	const [message] = useMessage();
	const statusFormat = Format.create();
	const statusMarkdown = Format.createMarkdown();
	const format = Format.create();
	const md = Format.createMarkdown();
	try {
		statusMarkdown.addText("正在更新洛克王国世界插件...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const result = await updateModule();
		md.addText(result.lines.join("\n"));
		format.addMarkdown(md);
		message.send({ format });
	} catch (error) {
		md.addText(error instanceof Error ? error.message : "更新失败");
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomUpdate_default as default };