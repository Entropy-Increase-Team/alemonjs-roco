import HTML from "./HTML.js";
import React from "react";

// src/img/views/WeGameHelp.tsx
const width = 1176;
function WeGameHelpCard({ data }) {
	return /* @__PURE__ */ React.createElement(HTML, { style: {
		width: `1216px`,
		background: "#f3f5f8"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		margin: 0,
		padding: "20px",
		width: `1216px`,
		fontFamily: "\"Noto Sans SC\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif",
		color: "#111827",
		background: "#f3f5f8",
		boxSizing: "border-box"
	} }, /* @__PURE__ */ React.createElement("main", { style: {
		width: `${width}px`,
		padding: "24px 24px 20px",
		border: "1px solid #e5e7eb",
		borderRadius: "16px",
		background: "#ffffff",
		boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
		boxSizing: "border-box"
	} }, /* @__PURE__ */ React.createElement("header", { style: {
		paddingBottom: "16px",
		marginBottom: "16px",
		borderBottom: "1px solid #e5e7eb"
	} }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("span", { style: {
		display: "inline-block",
		marginBottom: "8px",
		color: "#6b7280",
		fontSize: "13px",
		fontWeight: 600
	} }, "WeGame Plugin"), /* @__PURE__ */ React.createElement("h1", { style: {
		margin: "0 0 6px",
		fontSize: "34px",
		lineHeight: 1.2,
		fontWeight: 700,
		color: "#111827"
	} }, data.title), /* @__PURE__ */ React.createElement("p", { style: {
		margin: 0,
		fontSize: "18px",
		lineHeight: 1.5,
		color: "#4b5563"
	} }, data.subtitle))), data.categories.map((group, index) => /* @__PURE__ */ React.createElement("section", {
		key: `${group.title}-${index}`,
		style: { marginTop: index === 0 ? 0 : "18px" }
	}, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "baseline",
		justifyContent: "space-between",
		gap: "12px",
		marginBottom: "10px"
	} }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("h2", { style: {
		margin: 0,
		fontSize: "24px",
		lineHeight: 1.2,
		fontWeight: 700,
		color: "#111827"
	} }, group.title)), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#6b7280",
		fontSize: "14px",
		lineHeight: 1.4,
		whiteSpace: "nowrap"
	} }, group.items.length, " 条命令")), /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 1fr)",
		gap: "18px"
	} }, group.items.map((item, itemIndex) => /* @__PURE__ */ React.createElement("article", {
		key: `${group.title}-${item.title}-${itemIndex}`,
		style: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			minHeight: "84px",
			padding: "14px",
			border: "1px solid #d9dee7",
			borderRadius: "12px",
			background: "#ffffff",
			boxSizing: "border-box"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		flex: 1,
		minWidth: 0
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		marginBottom: "4px",
		color: "#111827",
		fontSize: "18px",
		lineHeight: 1.3,
		fontWeight: 700,
		wordBreak: "break-word"
	} }, item.title), /* @__PURE__ */ React.createElement("div", { style: {
		color: "#4b5563",
		fontSize: "14px",
		lineHeight: 1.5,
		wordBreak: "break-word"
	} }, item.desc))))))), /* @__PURE__ */ React.createElement("footer", { style: {
		marginTop: "20px",
		paddingTop: "14px",
		borderTop: "1px solid #e5e7eb",
		textAlign: "center"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		color: "#6b7280",
		fontSize: "14px",
		lineHeight: 1.5
	} }, data.footerBrand)))));
}

export { WeGameHelpCard as default };