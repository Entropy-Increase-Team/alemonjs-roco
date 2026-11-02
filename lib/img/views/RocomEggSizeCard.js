import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomEggSizeCard.tsx
const width = 820;
function renderMatchCard(item, key) {
	return /* @__PURE__ */ React.createElement("div", {
		key,
		style: {
			background: "rgba(255,255,255,0.94)",
			borderRadius: "18px",
			padding: "18px",
			boxShadow: "0 10px 24px rgba(40, 31, 23, 0.08)",
			border: "1px solid rgba(75, 52, 35, 0.08)"
		}
	}, item.icon ? /* @__PURE__ */ React.createElement("div", { style: {
		width: "64px",
		height: "64px",
		borderRadius: "16px",
		background: "rgba(248,244,236,0.92)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: "12px",
		border: "1px solid rgba(75, 52, 35, 0.08)"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: item.icon,
		alt: item.name,
		style: {
			width: "56px",
			height: "56px",
			objectFit: "contain"
		}
	})) : null, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "26px",
		fontWeight: 700,
		color: "#4d3624"
	} }, item.name, " #", item.id), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "8px",
		color: "#75563d",
		fontSize: "18px",
		lineHeight: 1.7
	} }, "属性：", item.typeLabel, /* @__PURE__ */ React.createElement("br", null), "蛋组：", item.eggGroupsLabel, /* @__PURE__ */ React.createElement("br", null), "身高：", item.heightLabel, " ｜ 体重：", item.weightLabel));
}
function RocomEggSizeCard({ data }) {
	return /* @__PURE__ */ React.createElement(HTML, { style: {
		width: `${width}px`,
		background: "#faf6ed"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "820px",
		background: "linear-gradient(180deg, #fbf6ec 0%, #f5efe3 100%)",
		position: "relative",
		padding: "40px 45px",
		boxSizing: "border-box"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		background: "rgba(255,255,255,0.72)",
		borderRadius: "22px",
		padding: "22px 28px",
		border: "1px solid rgba(201, 121, 38, 0.18)",
		marginBottom: "20px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "36px",
		fontWeight: 900,
		color: "#5a3e1b",
		letterSpacing: "2px"
	} }, "尺寸反查"), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "18px",
		color: "#84674d",
		marginTop: "8px"
	} }, "查询条件：", data.queryLabel)), !data.hasResults ? /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "center",
		color: "#6f5845",
		padding: "44px 20px",
		fontSize: "24px",
		background: "rgba(255,255,255,0.6)",
		borderRadius: "20px",
		border: "1px solid rgba(201, 121, 38, 0.15)"
	} }, "没有找到匹配当前尺寸的精灵") : null, data.perfectMatches.length > 0 ? /* @__PURE__ */ React.createElement("section", { style: { marginTop: "20px" } }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "28px",
		fontWeight: 800,
		color: "#4b3423",
		marginBottom: "14px"
	} }, "完美匹配"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		gap: "14px"
	} }, data.perfectMatches.map((item, index) => renderMatchCard(item, `perfect-${index}`)))) : null, data.rangeMatches.length > 0 ? /* @__PURE__ */ React.createElement("section", { style: { marginTop: "20px" } }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "28px",
		fontWeight: 800,
		color: "#4b3423",
		marginBottom: "14px"
	} }, "范围匹配"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		gap: "14px"
	} }, data.rangeMatches.map((item, index) => renderMatchCard(item, `range-${index}`)))) : null, /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "24px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "18px",
		color: "#9e8e76",
		fontSize: "15px"
	} }, /* @__PURE__ */ React.createElement("span", null, data.commandHint), /* @__PURE__ */ React.createElement("span", null, data.copyright))));
}

export { RocomEggSizeCard as default };