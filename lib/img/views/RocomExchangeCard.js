import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomExchangeCard.tsx
const width = 1010;
function renderProvideItems(items) {
	if (items.length === 0) return /* @__PURE__ */ React.createElement("span", { style: {
		color: "rgba(73, 58, 44, 0.58)",
		fontSize: "18px",
		fontWeight: 700
	} }, "未填写");
	return items.map((item) => /* @__PURE__ */ React.createElement("div", {
		key: item,
		style: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			minHeight: "34px",
			padding: "0 12px",
			borderRadius: "10px",
			background: "#f3e8d1",
			color: "#5c4a39",
			fontSize: "17px",
			fontWeight: 800,
			boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)"
		}
	}, item));
}
function renderPoster(poster, index) {
	return /* @__PURE__ */ React.createElement("div", {
		key: `${poster.userId}-${index}`,
		style: {
			width: "319px",
			minHeight: "232px",
			borderRadius: "14px",
			background: poster.isExpired ? "#ddd2bc" : "#faf3e0",
			padding: "30px 22px 16px",
			boxSizing: "border-box",
			position: "relative",
			boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
			border: "1px solid rgba(255,255,255,0.08)",
			opacity: poster.isExpired ? .8 : 1
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		position: "absolute",
		top: "10px",
		right: "18px",
		color: "#6b5a49",
		fontSize: "15px",
		fontWeight: 700
	} }, poster.timeLabel), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "12px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "58px",
		height: "58px",
		borderRadius: "50%",
		overflow: "hidden",
		background: "#2f2a26",
		boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
	} }, poster.avatarUrl ? /* @__PURE__ */ React.createElement("img", {
		src: poster.avatarUrl,
		alt: poster.userName,
		style: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		}
	}) : null), /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
		color: "#2f251d",
		fontSize: "22px",
		fontWeight: 900,
		lineHeight: 1.1,
		maxWidth: "190px",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap"
	} }, poster.userName), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		gap: "6px",
		marginTop: "8px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		borderRadius: "999px",
		background: "#dfd7c0",
		color: "#181817",
		padding: "4px 9px",
		fontSize: "12px",
		fontWeight: 900
	} }, "LV", poster.userLevel), /* @__PURE__ */ React.createElement("div", { style: {
		borderRadius: "999px",
		background: poster.isOnline ? "#91e400" : "#6b6b6b",
		color: poster.isOnline ? "#272727" : "#d7d7d7",
		padding: "4px 9px",
		fontSize: "12px",
		fontWeight: 900
	} }, poster.isOnline ? "在线" : "离线")))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "14px" } }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		marginBottom: "8px"
	} }, /* @__PURE__ */ React.createElement("i", { style: {
		display: "inline-block",
		width: "4px",
		height: "18px",
		borderRadius: "999px",
		background: "#f0a53a"
	} }), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#4d3d2f",
		fontSize: "15px",
		fontWeight: 900
	} }, "我想拥有")), /* @__PURE__ */ React.createElement("div", { style: {
		color: "#2f251d",
		fontSize: "18px",
		fontWeight: 800,
		lineHeight: 1.35,
		minHeight: "48px",
		paddingTop: "4px"
	} }, poster.wantText)), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "12px" } }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		marginBottom: "8px"
	} }, /* @__PURE__ */ React.createElement("i", { style: {
		display: "inline-block",
		width: "4px",
		height: "18px",
		borderRadius: "999px",
		background: "#f0a53a"
	} }), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#4d3d2f",
		fontSize: "15px",
		fontWeight: 900
	} }, "我能提供")), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexWrap: "wrap",
		gap: "8px",
		minHeight: "42px",
		alignItems: "flex-start"
	} }, renderProvideItems(poster.provideItems))), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "14px",
		width: "100%",
		borderRadius: "8px",
		background: "#e0d5ba",
		color: "#5a4b3c",
		padding: "8px 12px",
		boxSizing: "border-box",
		boxShadow: "inset 0 1px 3px rgba(255,255,255,0.45)",
		textAlign: "center",
		fontSize: "17px",
		fontWeight: 900
	} }, "ID: ", poster.userId));
}
function RocomExchangeCard({ data }) {
	return /* @__PURE__ */ React.createElement(HTML, { style: {
		width: `${width}px`,
		background: "transparent"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "960px",
		padding: "25px",
		boxSizing: "border-box",
		background: "linear-gradient(rgba(30, 26, 22, 0.72), rgba(30, 26, 22, 0.72)), radial-gradient(circle at top left, rgba(255, 206, 108, 0.18), transparent 22%), linear-gradient(180deg, #5a4634 0%, #2a221d 34%, #181411 100%)",
		position: "relative",
		display: "inline-block",
		verticalAlign: "top"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		position: "relative",
		zIndex: 1,
		width: "100%"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		paddingBottom: "20px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "18px"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "32px",
		fontWeight: 900,
		color: "#ffc966",
		letterSpacing: "2px"
	} }, "交换大厅"), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#eeddbb",
		fontSize: "18px",
		marginTop: "6px"
	} }, "当前筛选：", data.filterLabel))), /* @__PURE__ */ React.createElement("div", { style: { width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		gap: "24px 28px",
		minHeight: "556px",
		alignContent: "flex-start",
		flexDirection: "row",
		flexWrap: "wrap"
	} }, data.posters.map((poster, index) => renderPoster(poster, index))), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "14px",
		paddingTop: "14px",
		borderTop: "1px solid rgba(255,255,255,0.12)",
		color: "#f2e7ce",
		fontSize: "18px",
		fontWeight: 800
	} }, /* @__PURE__ */ React.createElement("span", null, "第 ", data.pageNo, " 页，共 ", data.totalPages, " 页"), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#d6c8a7",
		fontSize: "16px"
	} }, data.commandHint))))));
}

export { RocomExchangeCard as default };