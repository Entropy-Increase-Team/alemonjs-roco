import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomBreedingWantCard.tsx
const width = 820;
function RocomBreedingWantCard({ data }) {
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
	} }, "目标配种方案"), /* @__PURE__ */ React.createElement("div", { style: {
		color: "#9e8e76",
		fontSize: "15px",
		marginTop: "6px"
	} }, "想要孵出「", data.target.name, "」时，母体应固定为目标精灵")), /* @__PURE__ */ React.createElement("div", { style: {
		background: "rgba(255,255,255,0.94)",
		borderRadius: "20px",
		padding: "22px",
		boxShadow: "0 10px 24px rgba(40, 31, 23, 0.08)",
		marginTop: "18px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "30px",
		fontWeight: 800,
		color: "#4d3624"
	} }, data.target.name, " #", data.target.id), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "10px",
		color: "#75563d",
		fontSize: "19px",
		lineHeight: 1.8
	} }, "属性：", data.target.typeLabel, /* @__PURE__ */ React.createElement("br", null), "蛋组：", data.eggGroupsLabel, /* @__PURE__ */ React.createElement("br", null), "性别比：雄性 ", data.maleRateLabel, "% ｜ 雌性 ", data.femaleRateLabel, "%"), data.isUndiscovered ? /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "16px",
		padding: "16px 18px",
		borderRadius: "14px",
		background: "rgba(240, 98, 82, 0.12)",
		color: "#8a3d2e",
		fontSize: "18px"
	} }, "该精灵属于未发现蛋组，无法通过常规配种获得。") : data.fathers.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "16px",
		padding: "16px 18px",
		borderRadius: "14px",
		background: "rgba(240, 98, 82, 0.12)",
		color: "#8a3d2e",
		fontSize: "18px"
	} }, "没有找到可与该目标精灵共享蛋组的父体候选。") : /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		gap: "14px",
		marginTop: "18px"
	} }, data.fathers.map((item, index) => /* @__PURE__ */ React.createElement("div", {
		key: `${item.id}-${index}`,
		style: {
			background: "rgba(244, 236, 224, 0.95)",
			borderRadius: "18px",
			padding: "16px 18px",
			border: "1px solid rgba(201, 121, 38, 0.12)"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "24px",
		fontWeight: 700,
		color: "#4b3524"
	} }, item.name, " #", item.id), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "8px",
		color: "#735640",
		fontSize: "17px",
		lineHeight: 1.7
	} }, "属性：", item.typeLabel, /* @__PURE__ */ React.createElement("br", null), "蛋组：", item.eggGroupsLabel, /* @__PURE__ */ React.createElement("br", null), "身高：", item.heightLabel, " ｜ 体重：", item.weightLabel))))), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "24px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: "18px",
		color: "#9e8e76",
		fontSize: "15px"
	} }, /* @__PURE__ */ React.createElement("span", null, data.commandHint), /* @__PURE__ */ React.createElement("span", null, data.copyright)))));
}

export { RocomBreedingWantCard as default };