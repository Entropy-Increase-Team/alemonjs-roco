import { isHttpOk, requestText } from "../model/http.js";

// src/data/announcement.ts
/** 公告分类 tag ID 映射 */
/** 分类名称 → tag ID */
const CATEGORY_TAG_MAP = {
	最新: "135110",
	公告: "135111",
	资讯: "135112",
	活动: "135113"
};
const API_BASE = "https://apps.game.qq.com/wmp/v3.1/";
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";
function buildUrl(tagId, page, pageSize) {
	const params = new URLSearchParams({
		p0: "467",
		p1: "searchNewsKeywordsList",
		page: String(page),
		pagesize: String(pageSize),
		order: "sIdxTime",
		r0: "script",
		r1: `NewsObj${Date.now()}`,
		type: "iTag",
		id: tagId,
		source: "web_pc"
	});
	return `${API_BASE}?${params.toString()}`;
}
function parseJsonp(text) {
	const json = text.replace(/^var\s+\w+=/, "").replace(/;?\s*$/, "");
	return JSON.parse(json);
}
/** 分类优先级（越靠前优先级越高） */
const CATEGORY_PRIORITY = [
	{
		id: "135111",
		category: "公告"
	},
	{
		id: "135113",
		category: "活动"
	},
	{
		id: "135112",
		category: "资讯"
	},
	{
		id: "135110",
		category: "最新"
	}
];
function resolveCategory(tagIds) {
	const ids = new Set(tagIds.split(","));
	for (const { id, category } of CATEGORY_PRIORITY) if (ids.has(id)) return category;
	return "公告";
}
/**
* 从官方 API 获取公告列表
* @param tagId 分类 tag, 默认 135110(最新), 135111(公告), 135112(资讯), 135113(活动)
*/
async function fetchAnnouncements(tagId = "135110", page = 1, pageSize = 6) {
	const url = buildUrl(tagId, page, pageSize);
	const res = await requestText({
		url,
		method: "GET",
		headers: {
			"User-Agent": USER_AGENT,
			Referer: "https://rocom.qq.com/",
			Accept: "*/*"
		},
		timeout: 15e3
	});
	if (!isHttpOk(res.status)) throw new Error(`公告 API 请求失败: HTTP ${res.status}`);
	const text = res.data;
	const data = parseJsonp(text);
	if (data.status !== 0) throw new Error(`公告 API 返回错误: status=${data.status}`);
	return {
		items: data.msg.result.map((item) => ({
			id: item.iNewsId,
			title: item.sTitle,
			date: item.sIdxTime,
			category: resolveCategory(item.sTagIds)
		})),
		total: data.msg.total,
		totalPages: data.msg.totalpage
	};
}
/**
* 获取单条公告详情
* @param id 文章 ID (iNewsId)
*/
async function fetchAnnouncementDetail(id) {
	const params = new URLSearchParams({
		p0: "467",
		source: "web_pc",
		id: String(id)
	});
	const url = `${API_BASE}public/searchNews.php?${params.toString()}`;
	const res = await requestText({
		url,
		method: "GET",
		headers: {
			"User-Agent": USER_AGENT,
			Referer: "https://rocom.qq.com/",
			Accept: "*/*"
		},
		timeout: 15e3
	});
	if (!isHttpOk(res.status)) throw new Error(`公告详情 API 请求失败: HTTP ${res.status}`);
	const text = res.data;
	const data = parseJsonp(text);
	if (data.status !== 0) throw new Error(`公告详情 API 返回错误: status=${data.status}`);
	const msg = data.msg;
	return {
		id: msg.iNewsId,
		title: msg.sTitle,
		date: msg.sIdxTime,
		author: msg.sAuthor,
		content: msg.sContent,
		coverUrl: msg.sIMG.startsWith("//") ? `https:${msg.sIMG}` : msg.sIMG,
		tagIds: msg.sTagIds
	};
}

export { CATEGORY_TAG_MAP, fetchAnnouncementDetail, fetchAnnouncements };