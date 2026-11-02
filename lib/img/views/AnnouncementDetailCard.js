import _lvy_asset_105_default from "../../_virtual/_lvy-asset_105.js";
import HTML from "./HTML.js";
import React from "react";
import Markdown from "markdown-to-jsx";

// src/img/views/AnnouncementDetailCard.tsx
const CARD_W = 600;
function formatDate(dateStr) {
	return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})/, "$1-$2-$3 $4");
}
/** 将 API 返回的 HTML 转为 Markdown 文本 */
function htmlToMarkdown(html) {
	return html.replace(/<table[^>]*>/gi, "\n").replace(/<\/table>/gi, "\n").replace(/<thead[^>]*>/gi, "").replace(/<\/thead>/gi, "").replace(/<tbody[^>]*>/gi, "").replace(/<\/tbody>/gi, "").replace(/<tr[^>]*>/gi, "| ").replace(/<\/tr>/gi, " |\n").replace(/<th[^>]*>(.*?)<\/th>/gi, " $1 |").replace(/<td[^>]*>(.*?)<\/td>/gi, " $1 |").replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n").replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n").replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n").replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**").replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**").replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*").replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*").replace(/<img[^>]*>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<p[^>]*>/gi, "").replace(/<li[^>]*>/gi, "- ").replace(/<\/li>/gi, "\n").replace(/<\/?[ou]l[^>]*>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/\n{3,}/g, "\n\n").trim();
}
function AnnouncementDetailCard({ data }) {
	const { detail } = data;
	const markdown = htmlToMarkdown(detail.content);
	const lines = markdown.split("\n");
	const truncated = lines.length > 40;
	const displayMd = truncated ? lines.slice(0, 40).join("\n") : markdown;
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: `${CARD_W}px` } }, /* @__PURE__ */ React.createElement("div", {
		className: "bg-ann-bg box-border overflow-hidden",
		style: {
			width: `${CARD_W}px`,
			background: `url(${_lvy_asset_105_default}) no-repeat center/cover`
		}
	}, /* @__PURE__ */ React.createElement("div", {
		className: "px-5 pt-5 pb-3",
		style: { borderBottom: "2px solid rgba(180,160,130,0.35)" }
	}, /* @__PURE__ */ React.createElement("div", { className: "text-ann-title font-extrabold text-lg leading-snug" }, detail.title), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mt-2" }, /* @__PURE__ */ React.createElement("span", {
		className: "text-ann-date text-[13px]",
		style: { fontFamily: "monospace, tttgbnumber" }
	}, formatDate(detail.date)), /* @__PURE__ */ React.createElement("span", { className: "text-ann-footer text-[12px]" }, detail.author))), /* @__PURE__ */ React.createElement("div", { className: "px-5 py-4 text-ann-title text-[14px] leading-relaxed ann-detail-content" }, /* @__PURE__ */ React.createElement(Markdown, { options: {
		forceBlock: true,
		overrides: {
			p: { props: { className: "mb-2" } },
			strong: { props: { style: { color: "#E8A820" } } },
			table: { props: { className: "w-full text-[13px] border-collapse my-2" } },
			th: { props: { className: "text-left py-1 px-2 border-b border-ann-tab font-bold" } },
			td: { props: { className: "py-1 px-2 border-b border-ann-tab/30" } }
		}
	} }, displayMd), truncated && /* @__PURE__ */ React.createElement("p", { className: "text-ann-footer text-[13px] mt-3 text-center" }, "…… 内容过长，请前往官网查看完整公告")), /* @__PURE__ */ React.createElement("div", {
		className: "flex items-center justify-center py-3 pb-4",
		style: { borderTop: "1px solid rgba(180,160,130,0.25)" }
	}, /* @__PURE__ */ React.createElement("span", { className: "text-ann-footer text-sm font-bold" }, "洛克王国 · 公告详情"))));
}

export { AnnouncementDetailCard as default };