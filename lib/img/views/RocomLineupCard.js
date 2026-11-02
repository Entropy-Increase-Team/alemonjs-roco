import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomLineupCard.tsx
const width = 1240;
const slotCount = 6;
function renderPetSlot(pet, index, mode) {
	const size = mode === "detail" ? 104 : 88;
	return /* @__PURE__ */ React.createElement("div", {
		key: `${pet?.name ?? "empty"}-${index}`,
		style: {
			width: `${size}px`,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			gap: "8px"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		width: `${size}px`,
		height: `${size}px`,
		borderRadius: mode === "detail" ? "24px" : "20px",
		background: pet ? "radial-gradient(circle at top, rgba(255,255,255,0.26), transparent 34%), linear-gradient(180deg, rgba(255,213,125,0.72), rgba(180,106,47,0.38))" : "rgba(255,255,255,0.06)",
		border: pet ? "1px solid rgba(255,255,255,0.06)" : "1px dashed rgba(255,255,255,0.12)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		boxShadow: pet ? "0 12px 24px rgba(0,0,0,0.22)" : "none"
	} }, pet?.imageUrl ? /* @__PURE__ */ React.createElement("img", {
		src: pet.imageUrl,
		alt: pet.name,
		style: {
			maxWidth: "92%",
			maxHeight: "92%",
			objectFit: "contain",
			filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.22))"
		}
	}) : /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: mode === "detail" ? "26px" : "22px",
		fontWeight: 800,
		color: "rgba(255,255,255,0.26)"
	} }, pet ? pet.name.slice(0, 1) : "空")), /* @__PURE__ */ React.createElement("div", { style: {
		maxWidth: `${size + 12}px`,
		fontSize: mode === "detail" ? "15px" : "13px",
		fontWeight: 800,
		lineHeight: 1.2,
		textAlign: "center",
		color: pet ? "#f6f1e3" : "rgba(245,239,223,0.42)"
	} }, pet?.name ?? "待补位"));
}
function RocomLineupCard({ data }) {
	const title = data.mode === "detail" ? "阵容详情" : "阵容助手";
	const subtitle = data.category || (data.mode === "detail" ? "阵容单卡" : "热门推荐");
	const commandHint = data.mode === "detail" ? "+查看阵容 <阵容码>" : "+阵容 <分类> <页码>";
	return /* @__PURE__ */ React.createElement(HTML, { style: {
		width: `${width}px`,
		background: "#1b1d18"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: `${width}px`,
		padding: "24px",
		boxSizing: "border-box",
		background: "radial-gradient(circle at top left, rgba(255,173,84,0.18), transparent 22%), radial-gradient(circle at top right, rgba(255,255,255,0.10), transparent 20%), linear-gradient(180deg, #2b211b 0%, #161311 100%)",
		fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",sans-serif"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		background: "rgba(50, 42, 30, 0.85)",
		borderRadius: "15px",
		padding: "12px 20px",
		marginBottom: "20px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		flex: 1
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "60px",
		height: "60px",
		borderRadius: "18px",
		background: "linear-gradient(180deg, #ffd87b 0%, #ffc65f 100%)",
		color: "#272624",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "24px",
		fontWeight: 800
	} }, "阵"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		gap: "4px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		color: "#f4eee1",
		fontSize: "22px",
		fontWeight: 800
	} }, title), /* @__PURE__ */ React.createElement("span", { style: {
		backgroundColor: "#ffc966",
		color: "#272624",
		fontSize: "14px",
		fontWeight: 800,
		padding: "2px 8px",
		borderRadius: "10px",
		lineHeight: 1.2
	} }, "第 ", data.pageNo, " 页")), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#a8a69f",
		fontSize: "14px"
	} }, subtitle))), /* @__PURE__ */ React.createElement("div", { style: {
		flex: 2,
		textAlign: "center"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		color: "#ffc65f",
		fontSize: "28px",
		fontWeight: 800,
		textShadow: "0 2px 6px rgba(0,0,0,0.3)"
	} }, "阵容推荐 · 配队总览")), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-end",
		justifyContent: "center",
		gap: "4px",
		flex: 1
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		color: "#a8a69f",
		fontSize: "14px"
	} }, "第 ", data.pageNo, " / ", data.totalPages, " 页"), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#f4eee1",
		fontSize: "14px"
	} }, "当前分类：", subtitle))), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		gap: "18px"
	} }, data.lineups.map((lineup, index) => {
		const pets = Array.from({ length: slotCount }).map((_, slotIndex) => lineup.pets[slotIndex] ?? null);
		return /* @__PURE__ */ React.createElement("div", {
			key: `${lineup.id}-${index}`,
			style: {
				borderRadius: "24px",
				background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
				border: "1px solid rgba(255,255,255,0.08)",
				padding: data.mode === "detail" ? "22px" : "20px",
				boxShadow: "0 18px 36px rgba(0,0,0,0.22)"
			}
		}, /* @__PURE__ */ React.createElement("div", { style: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-start",
			gap: "16px"
		} }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: {
			fontSize: data.mode === "detail" ? "30px" : "26px",
			fontWeight: 900,
			lineHeight: 1.1,
			color: "#f5efdf"
		} }, lineup.name), /* @__PURE__ */ React.createElement("div", { style: {
			marginTop: "10px",
			display: "flex",
			flexWrap: "wrap",
			gap: "8px"
		} }, lineup.tags.length > 0 ? lineup.tags.map((tag) => /* @__PURE__ */ React.createElement("span", {
			key: tag,
			style: {
				display: "inline-block",
				padding: "6px 12px",
				borderRadius: "999px",
				background: "rgba(255,190,103,0.16)",
				color: "#ffc867",
				fontSize: "13px",
				fontWeight: 800
			}
		}, tag)) : /* @__PURE__ */ React.createElement("span", { style: {
			display: "inline-block",
			padding: "6px 12px",
			borderRadius: "999px",
			background: "rgba(255,255,255,0.08)",
			color: "rgba(245,239,223,0.7)",
			fontSize: "13px",
			fontWeight: 700
		} }, "无标签"))), /* @__PURE__ */ React.createElement("div", { style: {
			minWidth: "170px",
			textAlign: "right",
			fontSize: "14px",
			color: "rgba(245,239,223,0.76)"
		} }, /* @__PURE__ */ React.createElement("div", null, "作者：", lineup.authorName), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "8px" } }, "点赞：", lineup.likes), /* @__PURE__ */ React.createElement("div", { style: {
			marginTop: "8px",
			color: "#ffc867",
			fontWeight: 900
		} }, "阵容码：", lineup.id))), /* @__PURE__ */ React.createElement("div", { style: {
			marginTop: "18px",
			display: "grid",
			gridTemplateColumns: data.mode === "detail" ? "repeat(6, 1fr)" : "repeat(6, 1fr)",
			gap: data.mode === "detail" ? "16px" : "14px"
		} }, pets.map((pet, petIndex) => renderPetSlot(pet, petIndex, data.mode))));
	})), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "4px",
		marginTop: "16px",
		paddingTop: "10px",
		borderTop: "1px solid rgba(0,0,0,0.08)"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "16px",
		color: "#f5efdf",
		fontWeight: 800
	} }, "第 ", data.pageNo, " 页，共 ", data.totalPages, " 页"), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "14px",
		color: "#b9b1a2"
	} }, data.mode === "detail" ? "查看命令" : "翻页命令", "：", commandHint))));
}

export { RocomLineupCard as default };