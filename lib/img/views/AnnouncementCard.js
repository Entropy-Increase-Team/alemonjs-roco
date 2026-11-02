import _lvy_asset_105_default from "../../_virtual/_lvy-asset_105.js";
import HTML from "./HTML.js";
import React from "react";

// src/img/views/AnnouncementCard.tsx
const TABS = [
	"最新",
	"公告",
	"资讯",
	"活动"
];
const CARD_W = 600;
function formatDate(dateStr) {
	return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})/, "$1-$2-$3 $4");
}
function AnnouncementCard({ data }) {
	const { announcements, activeTab = "最新", page = 1, totalPages = 1 } = data;
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: `${CARD_W}px` } }, /* @__PURE__ */ React.createElement("div", {
		className: "bg-ann-bg box-border overflow-hidden",
		style: {
			width: `${CARD_W}px`,
			background: `url(${_lvy_asset_105_default}) no-repeat center/cover`
		}
	}, /* @__PURE__ */ React.createElement("div", {
		className: "flex items-stretch",
		style: { borderBottom: "2px solid rgba(180,160,130,0.35)" }
	}, TABS.map((tab) => {
		const isActive = tab === activeTab;
		return /* @__PURE__ */ React.createElement("div", {
			key: tab,
			className: "flex-1 text-center py-2.5 text-[15px] font-bold",
			style: {
				background: isActive ? "#E8A820" : "transparent",
				color: isActive ? "#fff" : "#6B5D4F",
				borderRadius: isActive ? "8px 8px 0 0" : "0"
			}
		}, tab);
	})), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 p-4 px-5" }, announcements.map((item, idx) => /* @__PURE__ */ React.createElement("div", {
		key: idx,
		className: "bg-ann-card rounded-xl py-4 px-5 flex items-center justify-between",
		style: { border: "1px solid rgba(180,160,130,0.25)" }
	}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 flex-1 mr-4" }, /* @__PURE__ */ React.createElement("span", {
		className: "text-[13px] font-extrabold shrink-0",
		style: {
			background: "#E8A820",
			color: "#fff",
			width: "24px",
			height: "24px",
			borderRadius: "6px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}
	}, idx + 1), /* @__PURE__ */ React.createElement("div", {
		className: "text-ann-title font-extrabold leading-snug flex-1",
		style: {
			fontSize: "16px",
			overflow: "hidden",
			display: "-webkit-box",
			WebkitLineClamp: 2,
			WebkitBoxOrient: "vertical"
		}
	}, item.title)), /* @__PURE__ */ React.createElement("div", {
		className: "text-ann-date text-[13px] whitespace-nowrap shrink-0",
		style: { fontFamily: "monospace, tttgbnumber" }
	}, formatDate(item.date))))), /* @__PURE__ */ React.createElement("div", {
		className: "flex flex-col items-center gap-1 py-3 pb-4",
		style: { borderTop: "1px solid rgba(180,160,130,0.25)" }
	}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-ann-footer text-sm font-bold" }, "合共"), /* @__PURE__ */ React.createElement("span", { className: "text-ann-title text-base font-extrabold" }, page, " / ", totalPages), /* @__PURE__ */ React.createElement("span", {
		className: "text-ann-footer text-lg",
		style: { marginLeft: "4px" }
	}, "▶")), /* @__PURE__ */ React.createElement("span", { className: "text-ann-date text-[12px]" }, "发送 #洛克公告 序号 查看详情"))));
}

export { AnnouncementCard as default };