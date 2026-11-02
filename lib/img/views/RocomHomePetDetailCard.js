import HTML from "./HTML.js";
import React from "react";

// src/img/views/RocomHomePetDetailCard.tsx
const starIcons = {
	star_1: "✦",
	star_8: "✧",
	star_9: "✵"
};
function RocomHomePetDetailCard({ data }) {
	return /* @__PURE__ */ React.createElement(HTML, { style: {
		width: "1200px",
		background: "#f4ecdc"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "1200px",
		padding: "26px",
		boxSizing: "border-box",
		background: "#f4ecdc",
		color: "#33271a",
		fontFamily: "\"PingFang SC\",\"Microsoft YaHei\",sans-serif"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		overflow: "hidden",
		borderRadius: "28px",
		background: "radial-gradient(circle at 10% 12%, rgba(255,231,177,0.52), transparent 28%), linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)",
		boxShadow: "0 26px 58px rgba(76, 55, 32, 0.18)"
	} }, /* @__PURE__ */ React.createElement("header", { style: {
		position: "relative",
		minHeight: "104px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "0 34px",
		background: "linear-gradient(90deg, #ffc95f, #f5b64c)"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "42px",
		letterSpacing: "4px",
		fontWeight: 800,
		color: "#10100e"
	} }, data.title), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "12px"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		padding: "8px 16px",
		borderRadius: "999px",
		background: "rgba(255,255,255,0.52)",
		color: "#79521b",
		fontSize: "17px"
	} }, "UID ", data.uid), /* @__PURE__ */ React.createElement("span", { style: {
		padding: "8px 16px",
		borderRadius: "999px",
		background: "rgba(255,255,255,0.72)",
		color: "#4a2d0b",
		fontSize: "17px",
		fontWeight: 700
	} }, "共 ", data.pets.length, " 只"))), /* @__PURE__ */ React.createElement("main", { style: {
		display: "grid",
		gap: "20px",
		padding: "24px 30px 30px"
	} }, data.pets.length > 0 ? data.pets.map((pet, petIndex) => /* @__PURE__ */ React.createElement("section", {
		key: `${pet.petId}-${pet.petGid}-${petIndex}`,
		style: {
			borderRadius: "22px",
			padding: "22px",
			border: "1px solid rgba(143,113,73,0.14)",
			background: "rgba(250,247,238,0.82)",
			boxShadow: "0 12px 26px rgba(88,64,38,0.08)"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		gap: "22px",
		alignItems: "flex-start"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		position: "relative",
		flex: "none",
		width: "150px",
		textAlign: "center"
	} }, pet.iconUrl ? /* @__PURE__ */ React.createElement("img", {
		src: pet.iconUrl,
		alt: pet.name,
		style: {
			width: "150px",
			height: "150px",
			objectFit: "contain",
			borderRadius: "24px",
			background: "rgba(255,255,255,0.75)",
			border: "1px solid rgba(143,113,73,0.14)"
		}
	}) : /* @__PURE__ */ React.createElement("div", { style: {
		width: "150px",
		height: "150px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "24px",
		background: "#ede7dc",
		fontSize: "30px",
		color: "#8d6e63"
	} }, "无图"), pet.starIconUrl ? /* @__PURE__ */ React.createElement("span", { style: {
		position: "absolute",
		top: "8px",
		right: "8px",
		color: "#e6a817",
		fontSize: "22px"
	} }, starIcons[pet.starIconUrl] ?? "★") : null), /* @__PURE__ */ React.createElement("div", { style: {
		flex: 1,
		minWidth: 0
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "12px",
		flexWrap: "wrap"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "30px",
		fontWeight: 800
	} }, pet.name), pet.defaultName ? /* @__PURE__ */ React.createElement("span", { style: {
		color: "#7f6e57",
		fontSize: "17px"
	} }, pet.defaultName) : null, pet.typeTags.map((tag) => /* @__PURE__ */ React.createElement("span", {
		key: tag.name,
		style: {
			padding: "5px 12px",
			borderRadius: "999px",
			background: tag.color,
			color: "#fff",
			fontSize: "14px",
			fontWeight: 700
		}
	}, tag.name)), pet.bloodTag ? /* @__PURE__ */ React.createElement("span", { style: {
		padding: "5px 12px",
		borderRadius: "999px",
		background: pet.bloodTag.color,
		color: "#fff",
		fontSize: "14px",
		fontWeight: 700
	} }, pet.bloodTag.name, "系") : null, pet.variantText ? /* @__PURE__ */ React.createElement("span", { style: {
		padding: "5px 12px",
		borderRadius: "999px",
		background: "rgba(206,147,216,0.24)",
		color: "#8e44ad",
		fontSize: "14px",
		fontWeight: 700
	} }, pet.variantText) : null), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "10px",
		display: "flex",
		gap: "14px",
		flexWrap: "wrap",
		fontSize: "15px",
		color: "#5f4d33"
	} }, /* @__PURE__ */ React.createElement("span", null, "Lv.", pet.level), /* @__PURE__ */ React.createElement("span", null, pet.genderText), pet.natureText ? /* @__PURE__ */ React.createElement("span", null, "性格：", pet.natureText) : null, pet.voiceText ? /* @__PURE__ */ React.createElement("span", null, "声音：", pet.voiceText, pet.voiceLabel ? `（${pet.voiceLabel}）` : "") : null, /* @__PURE__ */ React.createElement("span", null, "GID：", pet.petGid || "--")), pet.feature ? /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "12px",
		padding: "12px 16px",
		borderRadius: "14px",
		background: "rgba(255,255,255,0.66)",
		border: "1px solid rgba(143,113,73,0.12)"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		fontSize: "17px",
		fontWeight: 800,
		color: "#8a5a12"
	} }, pet.featureIcon ? /* @__PURE__ */ React.createElement("img", {
		src: pet.featureIcon,
		alt: "",
		style: {
			width: "26px",
			height: "26px",
			objectFit: "contain"
		}
	}) : null, "特性：", pet.feature.name), pet.feature.desc ? /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "4px",
		fontSize: "14px",
		color: "#7f6e57"
	} }, pet.feature.desc) : null) : null, /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "12px",
		display: "grid",
		gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
		gap: "8px"
	} }, pet.attributes.map((attr) => /* @__PURE__ */ React.createElement("div", {
		key: attr.label,
		style: {
			padding: "10px 6px",
			borderRadius: "12px",
			background: "rgba(255,255,255,0.66)",
			border: "1px solid rgba(143,113,73,0.12)",
			textAlign: "center"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "13px",
		color: "#8c7354"
	} }, attr.label), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "2px",
		fontSize: "20px",
		fontWeight: 800
	} }, attr.value), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "11px",
		color: "#9a876d"
	} }, attr.talent ? `天赋 ${attr.talent}` : "", attr.effort ? ` 努力 ${attr.effort}` : "", !attr.talent && !attr.effort ? " " : "")))))), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "16px",
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "14px"
	} }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		marginBottom: "8px",
		fontSize: "16px",
		fontWeight: 800,
		color: "#8a5a12"
	} }, "携带技能（", pet.equipSkills.length, "）"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "grid",
		gap: "6px"
	} }, pet.equipSkills.length > 0 ? pet.equipSkills.map((skill) => /* @__PURE__ */ React.createElement("div", {
		key: `${skill.id}-${skill.pos}-equip`,
		style: {
			display: "flex",
			alignItems: "center",
			gap: "10px",
			padding: "8px 12px",
			borderRadius: "12px",
			background: "rgba(255,255,255,0.66)",
			border: "1px solid rgba(143,113,73,0.12)"
		}
	}, skill.iconUrl ? /* @__PURE__ */ React.createElement("img", {
		src: skill.iconUrl,
		alt: "",
		style: {
			width: "30px",
			height: "30px",
			objectFit: "contain"
		}
	}) : null, /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "15px",
		fontWeight: 700
	} }, skill.name), /* @__PURE__ */ React.createElement("span", { style: {
		padding: "2px 8px",
		borderRadius: "999px",
		background: skill.typeColor,
		color: "#fff",
		fontSize: "11px"
	} }, skill.families), /* @__PURE__ */ React.createElement("span", { style: {
		marginLeft: "auto",
		fontSize: "13px",
		color: "#7f6e57"
	} }, "消耗 ", skill.cost, " · 威力 ", skill.power))) : /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "14px",
		color: "#9a876d"
	} }, "暂无携带技能"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		marginBottom: "8px",
		fontSize: "16px",
		fontWeight: 800,
		color: "#8a5a12"
	} }, "已学技能（", pet.learnedSkills.length, "）"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexWrap: "wrap",
		gap: "6px"
	} }, pet.learnedSkills.map((skill) => /* @__PURE__ */ React.createElement("span", {
		key: `${skill.id}-${skill.pos}-learned`,
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			padding: "5px 10px",
			borderRadius: "999px",
			background: "rgba(255,255,255,0.7)",
			border: "1px solid rgba(143,113,73,0.14)",
			fontSize: "13px"
		}
	}, /* @__PURE__ */ React.createElement("span", { style: {
		width: "8px",
		height: "8px",
		borderRadius: "999px",
		background: skill.typeColor
	} }), skill.name))))), pet.status === "error" ? /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "10px",
		fontSize: "14px",
		color: "#b3452c"
	} }, "该精灵数据获取失败：", pet.errorText || "未知错误") : null)) : /* @__PURE__ */ React.createElement("div", { style: {
		padding: "44px 18px",
		textAlign: "center",
		color: "#8d6e63",
		fontSize: "18px"
	} }, data.emptyText), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		color: "#9a876d",
		fontSize: "13px"
	} }, "数据更新时间：", data.updatedAt)))));
}

export { RocomHomePetDetailCard as default };