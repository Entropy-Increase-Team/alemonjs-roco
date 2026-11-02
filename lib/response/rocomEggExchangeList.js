import { buildExchangeListText, fetchEggExchanges, parseExchangePageArg } from "../model/rocomEggExchange.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage, useRoute } from "alemonjs";

// src/response/rocomEggExchangeList.ts
var rocomEggExchangeList_default = async () => {
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
	try {
		const pageNo = parseExchangePageArg(String(route.rawArgs ?? ""));
		statusMarkdown.addText(`正在查询换蛋广场，第 ${pageNo} 页...`);
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		const data = await fetchEggExchanges(pageNo, context.userIdentifier);
		const items = Array.isArray(data.items) ? data.items : [];
		if (items.length === 0) throw new Error(pageNo > 1 ? "该页没有更多换蛋帖了" : "当前换蛋广场暂无帖子");
		const pageInfo = {
			page_no: Number(data.page_no) || pageNo,
			total_pages: Number(data.total_pages) || 1,
			total: Number(data.total) || items.length
		};
		md.addText(buildExchangeListText(items, pageInfo));
		format.addMarkdown(md);
		message.send({ format });
	} catch (error) {
		md.addText(`换蛋广场查询失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomEggExchangeList_default as default };