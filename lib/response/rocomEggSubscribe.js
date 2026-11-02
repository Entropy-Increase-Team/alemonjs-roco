import { createEggExchangeSubscription, parseSubscribeFilters } from "../model/rocomEggExchange.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage, useRoute } from "alemonjs";

// src/response/rocomEggSubscribe.ts
var rocomEggSubscribe_default = async () => {
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
		const filters = parseSubscribeFilters(String(route.rawArgs ?? ""));
		if (Object.keys(filters).length === 0) throw new Error("格式：+订阅换蛋 想要:上岸蛙 补充:固执\n支持的筛选键：想要、我有、补充、学号、搜索");
		statusMarkdown.addText("正在创建换蛋订阅...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		const data = await createEggExchangeSubscription(filters, context.userIdentifier);
		const subscription = data.subscription && typeof data.subscription === "object" ? data.subscription : {};
		const subscriptionId = String(subscription.subscription_id ?? "").trim();
		const lines = ["✅ 换蛋订阅创建成功！", `筛选条件：${Object.entries(filters).map(([key, value]) => `${key}=${value}`).join("、")}`];
		if (subscriptionId) lines.push(`订阅 ID：${subscriptionId}`);
		lines.push("", "当有符合条件的新帖审核通过时，系统会推送通知。");
		md.addText(lines.join("\n"));
		format.addMarkdown(md);
		message.send({ format });
	} catch (error) {
		md.addText(`订阅换蛋失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomEggSubscribe_default as default };