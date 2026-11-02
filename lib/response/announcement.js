import { buildAnnouncementDetailFormat, buildAnnouncementListFormat, parseAnnouncementArgs } from "./announcementShared.js";
import { Format, useMessage, useRoute } from "alemonjs";

// src/response/announcement.ts
var announcement_default = async () => {
	const [route] = useRoute();
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	const suffix = Array.isArray(route.rawArgs) ? route.rawArgs.map((item) => String(item).trim()).filter(Boolean).join(" ").trim() : String(route.rawArgs ?? "").trim();
	const { tab, idx } = parseAnnouncementArgs(suffix);
	try {
		if (idx > 0) {
			message.send({ format: await buildAnnouncementDetailFormat(tab, idx) });
			return;
		}
		message.send({ format: await buildAnnouncementListFormat(tab) });
	} catch (error) {
		console.error("[洛克王国] 获取公告失败:", error);
		md.addText("[洛克王国] 公告获取失败，请稍后重试");
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { announcement_default as default };