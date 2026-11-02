import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomMerchantTodayCard.tsx
function RocomMerchantTodayCard({ data }) {
	return /* @__PURE__ */ React.createElement(HTML, { style: {
		width: "1120px",
		background: "#ece3d3"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "1120px",
		padding: "26px",
		boxSizing: "border-box",
		background: "#ece3d3",
		color: "#3a2f24",
		fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",sans-serif"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		borderRadius: "30px",
		overflow: "hidden",
		background: "linear-gradient(180deg, #f6ecda 0%, #eadbbf 100%)",
		boxShadow: "0 24px 52px rgba(58, 39, 21, 0.14)"
	} }, /* @__PURE__ */ React.createElement("header", { style: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: "104px",
		padding: "0 34px",
		background: "linear-gradient(90deg, #e9b04c, #d99a35)"
	} }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "40px",
		letterSpacing: "4px",
		fontWeight: 800,
		color: "#2c2013"
	} }, data.title), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "6px",
		color: "#6b4a13",
		fontSize: "16px"
	} }, data.subtitle)), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		padding: "9px 16px",
		borderRadius: "999px",
		background: "rgba(255,255,255,0.74)",
		color: "#3a2f24",
		fontSize: "17px",
		fontWeight: 800
	} }, "共 ", data.totalProducts, " 件商品"), /* @__PURE__ */ React.createElement("span", { style: {
		display: "flex",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		padding: "6px 12px",
		borderRadius: "999px",
		background: "rgba(255,255,255,0.62)",
		fontSize: "14px",
		color: "#5c4a37"
	} }, data.currentRoundLabel), /* @__PURE__ */ React.createElement("span", { style: {
		padding: "6px 12px",
		borderRadius: "999px",
		background: "rgba(255,255,255,0.62)",
		fontSize: "14px",
		color: "#bf5f3f"
	} }, "剩余 ", data.currentCountdown)))), /* @__PURE__ */ React.createElement("main", { style: {
		display: "grid",
		gap: "14px",
		padding: "22px 30px 30px"
	} }, data.rows.length > 0 ? data.rows.map((row) => /* @__PURE__ */ React.createElement("section", {
		key: `${row.roundId}-${row.label}`,
		style: {
			padding: "16px 18px",
			borderRadius: "20px",
			border: row.isCurrent ? "2px solid #d99a35" : "1px solid rgba(118, 97, 74, 0.16)",
			background: row.isCurrent ? "rgba(255,243,214,0.92)" : "rgba(255,255,255,0.62)"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "12px",
		marginBottom: "12px"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		padding: "6px 14px",
		borderRadius: "999px",
		background: row.isCurrent ? "#d99a35" : "rgba(118,97,74,0.18)",
		color: row.isCurrent ? "#fff" : "#5c4a37",
		fontSize: "16px",
		fontWeight: 800
	} }, row.label), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#8b7a63",
		fontSize: "14px"
	} }, row.timeLabel), row.isCurrent ? /* @__PURE__ */ React.createElement("span", { style: {
		padding: "4px 10px",
		borderRadius: "999px",
		background: "#c8e6c9",
		color: "#1b5e20",
		fontSize: "12px",
		fontWeight: 700
	} }, "当前轮次") : null, /* @__PURE__ */ React.createElement("span", { style: {
		marginLeft: "auto",
		color: "#8b7a63",
		fontSize: "14px"
	} }, row.items.length, " 件")), /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
		gap: "10px"
	} }, row.items.map((item, index) => /* @__PURE__ */ React.createElement("div", {
		key: `${item.goodsName}-${item.roundId}-${index}`,
		style: {
			padding: "12px 10px",
			borderRadius: "16px",
			border: "1px solid rgba(118, 97, 74, 0.14)",
			background: item.isEnded ? "rgba(240,234,222,0.75)" : "rgba(255,255,255,0.85)",
			opacity: item.isEnded ? .62 : 1,
			textAlign: "center"
		}
	}, item.iconUrl ? /* @__PURE__ */ React.createElement("img", {
		src: item.iconUrl,
		alt: item.goodsName,
		style: {
			width: "64px",
			height: "64px",
			objectFit: "contain"
		}
	}) : /* @__PURE__ */ React.createElement("div", { style: {
		width: "64px",
		height: "64px",
		margin: "0 auto",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "12px",
		background: "#e8dfcd",
		color: "#8b7a63",
		fontSize: "20px"
	} }, "无图"), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "6px",
		fontSize: "15px",
		fontWeight: 700,
		overflowWrap: "break-word"
	} }, item.goodsName), item.price > 0 ? /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "4px",
		color: "#b5791f",
		fontSize: "17px",
		fontWeight: 800
	} }, item.price) : /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "4px",
		color: "#a89a83",
		fontSize: "14px"
	} }, "价格未知"), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "4px",
		color: "#7f6e57",
		fontSize: "11px"
	} }, item.remainingStr)))))) : /* @__PURE__ */ React.createElement("div", { style: {
		padding: "40px",
		textAlign: "center",
		borderRadius: "20px",
		border: "1px dashed rgba(120, 102, 81, 0.35)",
		color: "#5c4a37",
		fontSize: "18px"
	} }, "今日暂无已公布的远行商人商品。")))));
}

export { RocomMerchantTodayCard as default };