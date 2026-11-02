import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomActivityCalendarCard.tsx
const THEME_COLORS = {
	gold: {
		base: "#d99a35",
		soft: "rgba(217,154,53,0.22)"
	},
	green: {
		base: "#5ea25e",
		soft: "rgba(94,162,94,0.2)"
	},
	brown: {
		base: "#a0764f",
		soft: "rgba(160,118,79,0.2)"
	}
};
const STATUS_COLORS = {
	active: {
		background: "#c8e6c9",
		color: "#1b5e20"
	},
	upcoming: {
		background: "#bbdefb",
		color: "#0d47a1"
	},
	ended: {
		background: "#eceff1",
		color: "#607d8b"
	},
	permanent: {
		background: "#ffe082",
		color: "#795548"
	}
};
function RocomActivityCalendarCard({ data }) {
	return /* @__PURE__ */ React.createElement(HTML, { style: {
		width: "1280px",
		background: "#f4ecdc"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "1280px",
		padding: "26px",
		boxSizing: "border-box",
		background: "#f4ecdc",
		color: "#33271a",
		fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",sans-serif"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		borderRadius: "28px",
		overflow: "hidden",
		background: "linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)",
		boxShadow: "0 26px 58px rgba(76, 55, 32, 0.18)"
	} }, /* @__PURE__ */ React.createElement("header", { style: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: "104px",
		padding: "0 34px",
		background: "linear-gradient(90deg, #ffc95f, #f5b64c)"
	} }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "42px",
		letterSpacing: "4px",
		fontWeight: 800,
		color: "#10100e"
	} }, data.title), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "6px",
		color: "#6b4a13",
		fontSize: "16px"
	} }, data.subtitle)), /* @__PURE__ */ React.createElement("span", { style: {
		padding: "10px 18px",
		borderRadius: "999px",
		background: "rgba(255,255,255,0.72)",
		color: "#4a2d0b",
		fontSize: "19px",
		fontWeight: 800
	} }, "共 ", data.activity_count, " 个活动")), /* @__PURE__ */ React.createElement("main", { style: {
		display: "grid",
		gap: "18px",
		padding: "22px 30px 30px"
	} }, data.empty ? /* @__PURE__ */ React.createElement("div", { style: {
		padding: "44px",
		textAlign: "center",
		borderRadius: "20px",
		border: "1px dashed rgba(120, 102, 81, 0.35)",
		color: "#8d6e63",
		fontSize: "18px"
	} }, "暂无进行中的活动。") : /* @__PURE__ */ React.createElement(React.Fragment, null, data.lanes.map((lane, laneIndex) => /* @__PURE__ */ React.createElement("section", {
		key: `lane-${laneIndex}`,
		style: {
			position: "relative",
			minHeight: "72px",
			borderRadius: "16px",
			background: "rgba(255,255,255,0.42)",
			border: "1px solid rgba(143,113,73,0.1)"
		}
	}, data.axis_dates.map((axis) => /* @__PURE__ */ React.createElement("div", {
		key: axis.label,
		style: {
			position: "absolute",
			top: 0,
			bottom: 0,
			left: `${axis.left_pct}%`,
			borderLeft: "1px dashed rgba(143,113,73,0.2)"
		}
	})), data.now_line ? /* @__PURE__ */ React.createElement("div", { style: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: `${data.now_line.left_pct}%`,
		borderLeft: "2px solid #d05a2c",
		zIndex: 2
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		position: "absolute",
		top: "-9px",
		left: "-20px",
		padding: "1px 6px",
		borderRadius: "999px",
		background: "#d05a2c",
		color: "#fff",
		fontSize: "10px",
		fontWeight: 800
	} }, data.now_line.label)) : null, lane.map((item) => {
		const theme = THEME_COLORS[item.theme] ?? THEME_COLORS.gold;
		return /* @__PURE__ */ React.createElement("div", {
			key: `${item.id}-${item.name}-${laneIndex}`,
			style: {
				position: "absolute",
				left: `${item.left_pct}%`,
				width: `${item.width_pct}%`,
				top: "10px",
				minHeight: "52px",
				padding: "7px 12px",
				borderRadius: "12px",
				background: theme.soft,
				borderLeft: `5px solid ${theme.base}`,
				overflow: "hidden"
			}
		}, /* @__PURE__ */ React.createElement("div", { style: {
			fontSize: "15px",
			fontWeight: 800,
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden"
		} }, item.name), /* @__PURE__ */ React.createElement("div", { style: {
			marginTop: "2px",
			fontSize: "12px",
			color: "#7f6e57",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden"
		} }, item.time_label));
	}))), /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gap: "10px"
	} }, data.activities.map((activity, index) => {
		const status = STATUS_COLORS[activity.statusClass] ?? STATUS_COLORS.active;
		const theme = THEME_COLORS[activity.theme] ?? THEME_COLORS.gold;
		return /* @__PURE__ */ React.createElement("article", {
			key: `${activity.id}-${activity.name}-${index}`,
			style: {
				display: "flex",
				alignItems: "flex-start",
				gap: "14px",
				padding: "13px 16px",
				borderRadius: "16px",
				background: "rgba(255,255,255,0.66)",
				borderLeft: `5px solid ${theme.base}`
			}
		}, /* @__PURE__ */ React.createElement("span", { style: {
			flex: "none",
			minWidth: "28px",
			textAlign: "center",
			color: "#a89a83",
			fontSize: "16px",
			fontWeight: 800
		} }, index + 1), /* @__PURE__ */ React.createElement("div", { style: {
			flex: 1,
			minWidth: 0
		} }, /* @__PURE__ */ React.createElement("div", { style: {
			display: "flex",
			alignItems: "center",
			gap: "10px",
			flexWrap: "wrap"
		} }, /* @__PURE__ */ React.createElement("span", { style: {
			fontSize: "18px",
			fontWeight: 800
		} }, activity.name), /* @__PURE__ */ React.createElement("span", { style: {
			padding: "3px 10px",
			borderRadius: "999px",
			...status,
			fontSize: "12px",
			fontWeight: 700
		} }, activity.statusText)), /* @__PURE__ */ React.createElement("div", { style: {
			marginTop: "4px",
			fontSize: "13px",
			color: "#7f6e57"
		} }, activity.time_label, activity.rewards_text !== "暂无奖励信息" ? ` · 奖励：${activity.rewards_text}` : ""), activity.description ? /* @__PURE__ */ React.createElement("div", { style: {
			marginTop: "4px",
			fontSize: "13px",
			color: "#9a876d"
		} }, activity.description) : null));
	}))), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		color: "#9a876d",
		fontSize: "13px"
	} }, data.commandHint, " · ", data.copyright)))));
}

export { RocomActivityCalendarCard as default };