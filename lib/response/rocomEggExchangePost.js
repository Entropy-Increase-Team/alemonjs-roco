import { postEggExchange } from "../model/rocomEggExchange.js";
import { getWeGameUserContext } from "../model/wegameAccount.js";
import { Format, useEvent, useMessage, useRoute } from "alemonjs";

// src/response/rocomEggExchangePost.ts
var rocomEggExchangePost_default = async () => {
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
		const raw = String(route.rawArgs ?? "").trim();
		if (!raw) throw new Error("格式：+发布换蛋帖 <我有>|<想要>\n用「|」分隔\"我有\"和\"想要\"");
		const parts = raw.split(/[/|｜]/u).map((item) => item.trim()).filter(Boolean);
		if (parts.length < 2) throw new Error("格式：+发布换蛋帖 <我有>|<想要>\n用「|」分隔\"我有\"和\"想要\"");
		const haveText = parts[0];
		const wantText = parts[1];
		const remark = parts[2] || "";
		statusMarkdown.addText("正在发布换蛋帖...");
		statusFormat.addMarkdown(statusMarkdown);
		message.send({ format: statusFormat });
		const context = getWeGameUserContext(event);
		const data = await postEggExchange({
			have_text: haveText,
			want_text: wantText,
			remark
		}, context.userIdentifier);
		const postId = String(data.post_id ?? data.id ?? "").trim();
		const similarPosts = Array.isArray(data.similar_posts) ? data.similar_posts : [];
		const lines = [
			"✅ 换蛋帖发布成功！",
			`我有：${haveText}`,
			`想要：${wantText}`
		];
		if (remark) lines.push(`备注：${remark}`);
		if (postId) lines.push(`帖子 ID：${postId}`);
		lines.push("", "帖子已进入审核，通过后将展示在换蛋广场。");
		if (similarPosts.length > 0) {
			lines.push("", "📋 相似帖子推荐：");
			for (const post of similarPosts.slice(0, 3)) lines.push(`  - [${String(post.id ?? "").trim()}] 我有：${String(post.have_text ?? "?").trim()} → 想要：${String(post.want_text ?? "?").trim()}`);
		}
		md.addText(lines.join("\n"));
		format.addMarkdown(md);
		message.send({ format });
	} catch (error) {
		md.addText(`发布换蛋帖失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomEggExchangePost_default as default };