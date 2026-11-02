import { TARGET_GROUP, TARGET_PRIVATE, getEggSubscriptionsByTarget } from "../model/rocomEggSubscription.js";
import { Format, useEvent, useMessage } from "alemonjs";

// src/response/rocomHomeSubscriptionList.ts
function getEventValue(event, keys) {
	for (const key of keys) {
		const value = String(event.current[key] ?? "").trim();
		if (value) return value;
	}
	return "";
}
var rocomHomeSubscriptionList_default = async () => {
	const [event] = useEvent({ selects: [
		"private.message.create",
		"message.create",
		"interaction.create",
		"private.interaction.create"
	] });
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	try {
		const userId = getEventValue(event, ["UserId", "user_id"]);
		const botId = getEventValue(event, [
			"BotId",
			"SelfId",
			"bot_id",
			"self_id"
		]) || "bot";
		const groupId = getEventValue(event, [
			"GroupId",
			"ChannelId",
			"GuildId",
			"group_id",
			"channel_id",
			"guild_id"
		]);
		const isGroup = Boolean(groupId && groupId !== userId);
		const subs = await getEggSubscriptionsByTarget(botId, isGroup ? groupId : userId, isGroup ? TARGET_GROUP : TARGET_PRIVATE);
		if (subs.length === 0) {
			md.addText(isGroup ? "本群当前没有家园蛋状态订阅。" : "你当前没有家园蛋状态订阅。");
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		const lines = [`当前家园蛋状态订阅（共 ${subs.length} 个）：`, ""];
		for (const sub of subs) {
			const lastCheck = sub.last_check_time || "从未检查";
			const lastPush = sub.last_push_time || "从未推送";
			lines.push(`UID ${sub.target_uid}：上次检查 ${lastCheck}，上次推送 ${lastPush}`);
		}
		lines.push("");
		lines.push("发送 +取消订阅家园 <UID> 取消单个订阅");
		lines.push("发送 +取消订阅家园 取消全部订阅");
		md.addText(lines.join("\n"));
		format.addMarkdown(md);
		message.send({ format });
	} catch (error) {
		md.addText(`查看家园蛋订阅列表失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomHomeSubscriptionList_default as default };