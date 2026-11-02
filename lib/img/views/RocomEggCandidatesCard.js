import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomEggCandidatesCard.tsx
const width = 820;
function RocomEggCandidatesCard({ data }) {
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
		position: "relative",
		zIndex: 2
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "center",
		marginBottom: "25px",
		paddingBottom: "15px",
		borderBottom: "2px dashed rgba(160, 140, 110, 0.4)"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		color: "#ffc65f",
		fontSize: "36px",
		fontWeight: 900,
		letterSpacing: "2px",
		textShadow: "0 2px 4px rgba(0,0,0,0.5)"
	} }, "查蛋候选结果"), /* @__PURE__ */ React.createElement("div", { style: {
		color: "#9e8e76",
		fontSize: "15px",
		marginTop: "6px"
	} }, "关键词「", data.keyword, "」命中 ", data.count, " 个候选，请使用更精确的名称")), data.candidates.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gap: "14px",
		marginTop: "22px"
	} }, data.candidates.map((item, index) => /* @__PURE__ */ React.createElement("div", {
		key: `${item.id}-${index}`,
		style: {
			background: "rgba(255,255,255,0.94)",
			borderRadius: "18px",
			padding: "18px 20px",
			boxShadow: "0 10px 24px rgba(40, 31, 23, 0.08)",
			border: "1px solid rgba(75, 52, 35, 0.08)"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		justifyContent: "space-between",
		gap: "12px",
		fontSize: "28px",
		fontWeight: 700,
		color: "#4d3624"
	} }, /* @__PURE__ */ React.createElement("span", null, item.name), /* @__PURE__ */ React.createElement("span", null, "#", item.id)), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "10px",
		color: "#75563d",
		fontSize: "18px",
		lineHeight: 1.7
	} }, "属性：", item.typeLabel, /* @__PURE__ */ React.createElement("br", null), "蛋组：", item.eggGroupsLabel, /* @__PURE__ */ React.createElement("br", null), "身高：", item.heightLabel, " ｜ 体重：", item.weightLabel)))) : /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "center",
		fontSize: "24px",
		color: "#6f5845",
		padding: "48px 24px",
		background: "rgba(255,255,255,0.6)",
		borderRadius: "18px",
		border: "1px solid rgba(201, 121, 38, 0.15)"
	} }, "没有可展示的候选结果"), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "24px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "18px",
		color: "#9e8e76",
		fontSize: "15px"
	} }, /* @__PURE__ */ React.createElement("span", null, data.commandHint), /* @__PURE__ */ React.createElement("span", null, data.copyright)))));
}

export { RocomEggCandidatesCard as default };