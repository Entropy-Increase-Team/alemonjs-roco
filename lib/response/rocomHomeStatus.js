import { queryRocomEggStatus } from "../model/rocomEggSubscription.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage, useRoute } from "alemonjs";

// src/response/rocomHomeStatus.ts
var rocomHomeStatus_default = async () => {
	const [event] = useEvent({ selects: [
		"private.message.create",
		"message.create",
		"interaction.create",
		"private.interaction.create"
	] });
	const [message] = useMessage();
	const [route] = useRoute();
	const statusFormat = Format.create();
	const statusMarkdown = Format.createMarkdown();
	const format = Format.create();
	const md = Format.createMarkdown();
	const targetUid = String(route.rawArgs ?? "").trim();
	try {
		if (!targetUid) throw new Error("格式：+家园状态 <UID>  查询家园蛋状态");
		statusMarkdown.addText(`正在查询 UID ${targetUid} 的家园蛋状态，请稍后...`);
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		let queuedNotified = false;
		const text = await queryRocomEggStatus(targetUid, context.userIdentifier, { onQueued: () => {
			if (queuedNotified) return;
			queuedNotified = true;
			statusMarkdown.addText(`UID ${targetUid} 的家园蛋状态查询已进入队列，正在等待游戏侧返回...`);
			statusFormat.addMarkdown(statusMarkdown);
			message.send({ format: statusFormat });
		} });
		md.addText(text);
		format.addMarkdown(md);
		message.send({ format });
	} catch (error) {
		md.addText(`查询家园蛋状态失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomHomeStatus_default as default };