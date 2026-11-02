import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomBreedingPairCard.tsx
const width = 820;
function RocomBreedingPairCard({ data }) {
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
	} }, "🥚 配种判定"), /* @__PURE__ */ React.createElement("div", { style: {
		color: "#9e8e76",
		fontSize: "15px",
		marginTop: "6px"
	} }, "精灵配种兼容性检查")), /* @__PURE__ */ React.createElement("div", { style: {
		background: "rgba(255,255,255,0.6)",
		borderRadius: "18px",
		padding: "22px 28px",
		marginBottom: "20px",
		border: "1px solid rgba(201, 121, 38, 0.25)"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gridTemplateColumns: "1fr 70px 1fr",
		gap: "12px",
		alignItems: "stretch"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		background: "rgba(255,255,255,0.72)",
		borderRadius: "16px",
		padding: "18px 20px",
		textAlign: "center",
		border: "1px solid rgba(201, 121, 38, 0.18)"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		color: "#8c7a61",
		fontSize: "14px",
		fontWeight: 700
	} }, "母体 (后者)"), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "8px",
		color: "#5a3e1b",
		fontSize: "28px",
		fontWeight: 900
	} }, data.mother.name), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "8px",
		color: "#6b5846",
		fontSize: "16px"
	} }, data.mother.typeLabel), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "12px",
		color: "#8c7a61",
		marginTop: "4px"
	} }, data.mother.eggGroupsLabel)), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "38px"
	} }, "⚡"), /* @__PURE__ */ React.createElement("div", { style: {
		background: "rgba(255,255,255,0.72)",
		borderRadius: "16px",
		padding: "18px 20px",
		textAlign: "center",
		border: "1px solid rgba(201, 121, 38, 0.18)"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		color: "#8c7a61",
		fontSize: "14px",
		fontWeight: 700
	} }, "父体 (前者)"), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "8px",
		color: "#5a3e1b",
		fontSize: "28px",
		fontWeight: 900
	} }, data.father.name), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "8px",
		color: "#6b5846",
		fontSize: "16px"
	} }, data.father.typeLabel), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "12px",
		color: "#8c7a61",
		marginTop: "4px"
	} }, data.father.eggGroupsLabel))), data.compatible ? /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "18px",
		borderRadius: "16px",
		padding: "18px 20px",
		background: "linear-gradient(135deg, rgba(220,252,231,0.95), rgba(187,247,208,0.92))",
		border: "1px solid rgba(34,197,94,0.25)",
		textAlign: "center"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "28px",
		fontWeight: 900,
		color: "#166534"
	} }, "✅ 可以配种"), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "6px",
		fontSize: "15px",
		color: "#166534"
	} }, "共享蛋组匹配，可以产出精灵蛋"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		justifyContent: "center",
		gap: "8px",
		flexWrap: "wrap",
		marginTop: "12px"
	} }, data.sharedEggGroupLabels.map((item) => /* @__PURE__ */ React.createElement("span", {
		key: item,
		style: {
			display: "inline-flex",
			alignItems: "center",
			padding: "5px 12px",
			borderRadius: "20px",
			background: "rgba(255,255,255,0.78)",
			color: "#166534",
			fontSize: "14px",
			fontWeight: 900
		}
	}, item)))) : /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "18px",
		borderRadius: "16px",
		padding: "18px 20px",
		background: "linear-gradient(135deg, rgba(254,226,226,0.95), rgba(254,202,202,0.92))",
		border: "1px solid rgba(239,68,68,0.25)",
		textAlign: "center"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "28px",
		fontWeight: 900,
		color: "#991b1b"
	} }, "❌ 无法配种"), data.reasons.map((reason) => /* @__PURE__ */ React.createElement("div", {
		key: reason,
		style: {
			marginTop: "6px",
			fontSize: "15px",
			color: "#b91c1c"
		}
	}, reason))), data.compatible ? /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: "12px",
		marginTop: "16px"
	} }, [
		["孵化时长", data.hatchLabel],
		["体重范围", data.weightLabel],
		["身高范围", data.heightLabel]
	].map(([label, value]) => /* @__PURE__ */ React.createElement("div", {
		key: label,
		style: {
			background: "rgba(255,255,255,0.7)",
			borderRadius: "12px",
			padding: "12px 16px",
			border: "1px solid rgba(201, 121, 38, 0.15)"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "12px",
		color: "#8c7a61",
		marginBottom: "4px",
		letterSpacing: "1px"
	} }, label), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "16px",
		fontWeight: 900,
		color: "#5a3e1b"
	} }, value)))) : null), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "15px",
		textAlign: "center",
		color: "#9e8e76",
		marginTop: "10px"
	} }, data.commandHint), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "14px",
		textAlign: "center",
		color: "#b09d84",
		marginTop: "6px"
	} }, data.copyright))));
}

export { RocomBreedingPairCard as default };