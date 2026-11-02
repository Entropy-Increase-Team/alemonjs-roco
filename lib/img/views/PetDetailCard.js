import { elementColors } from "../../data/config.js";
import HTML from "./HTML.js";
import React from "react";
import classNames from "classnames";

// src/img/views/PetDetailCard.tsx
function getElements(pet) {
	return Array.isArray(pet.element) ? pet.element : [pet.element];
}
function getGradient(elems) {
	if (elems.length === 1) return elementColors[elems[0]] || "#666";
	return `linear-gradient(135deg, ${elementColors[elems[0]] || "#666"}, ${elementColors[elems[1]] || "#666"})`;
}
function PetDetailCard({ data }) {
	const { pet } = data;
	const elems = getElements(pet);
	const bg = getGradient(elems);
	const total = pet.hp + pet.atk + pet.mat + pet.def + pet.mdf + pet.spd;
	const stats = [
		{
			label: "血量",
			value: pet.hp
		},
		{
			label: "攻击",
			value: pet.atk
		},
		{
			label: "魔攻",
			value: pet.mat
		},
		{
			label: "防御",
			value: pet.def
		},
		{
			label: "魔抗",
			value: pet.mdf
		},
		{
			label: "速度",
			value: pet.spd
		}
	];
	return /* @__PURE__ */ React.createElement(HTML, null, /* @__PURE__ */ React.createElement("div", {
		className: classNames("w-[680px] bg-pet-bg rounded-card overflow-hidden text-pet-text"),
		style: { border: "1px solid rgba(180,160,130,0.3)" }
	}, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-6 p-7 pb-5" }, /* @__PURE__ */ React.createElement("div", {
		className: "rounded-avatar p-1 shadow-avatar shrink-0",
		style: { background: bg }
	}, /* @__PURE__ */ React.createElement("img", {
		className: "w-[120px] h-[120px] rounded-[14px] object-cover bg-white block",
		src: pet.avatar,
		alt: pet.name
	})), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0 pt-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "text-[32px] font-black text-pet-text tracking-wide" }, pet.name), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-pet-text-dim" }, "No.", pet.id)), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-2" }, elems.map((e, i) => /* @__PURE__ */ React.createElement("span", {
		key: i,
		className: "inline-flex items-center gap-1 px-3.5 py-1 rounded-[14px] text-[13px] font-bold text-white",
		style: { background: elementColors[e] || "#888" }
	}, e))), /* @__PURE__ */ React.createElement("div", {
		className: "mt-3.5 bg-pet-panel rounded-[10px] p-2.5 px-3.5",
		style: { border: "1px solid rgba(180,160,130,0.3)" }
	}, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-pet-accent" }, pet.trait?.name || "无特性"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-pet-text-sec mt-1 leading-relaxed" }, pet.trait?.desc || "")))), /* @__PURE__ */ React.createElement("div", { className: "px-7 pb-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-2.5 gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-base font-extrabold text-pet-text" }, "种族值"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-px bg-pet-border" }), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-pet-text-dim" }, "总和 ", total)), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2" }, stats.map((stat, i) => /* @__PURE__ */ React.createElement("div", {
		key: i,
		className: "bg-pet-stat rounded-[10px] py-2.5 px-3.5 flex justify-between items-center",
		style: { border: "1px solid rgba(180,160,130,0.3)" }
	}, /* @__PURE__ */ React.createElement("span", { className: "text-[13px] text-pet-text-sec" }, stat.label), /* @__PURE__ */ React.createElement("span", { className: "text-lg font-bold text-pet-text" }, stat.value))))), /* @__PURE__ */ React.createElement("div", { className: "px-7 pb-7" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-2.5 gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-base font-extrabold text-pet-text" }, "技能"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-px bg-pet-border" }), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-pet-text-dim" }, pet.skills.length, " 个技能")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, pet.skills.map((s, idx) => /* @__PURE__ */ React.createElement("div", {
		key: idx,
		className: "bg-pet-skill rounded-[10px] py-2.5 px-3.5 min-w-0",
		style: { border: "1px solid rgba(180,160,130,0.3)" }
	}, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 mb-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-pet-text" }, s.name), /* @__PURE__ */ React.createElement("span", {
		className: "text-[11px] px-2 py-px rounded-lg text-white",
		style: { background: elementColors[s.element] || "#888" }
	}, s.element)), s.desc && /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-pet-text-sec leading-snug mb-1" }, s.desc), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2.5 text-[11px] text-pet-text-dim" }, /* @__PURE__ */ React.createElement("span", null, s.type), /* @__PURE__ */ React.createElement("span", null, "威力 ", s.power), /* @__PURE__ */ React.createElement("span", null, "能量 ", s.cost)))))), /* @__PURE__ */ React.createElement("div", {
		className: "px-7 py-2.5 pb-3.5 flex justify-between items-center",
		style: { borderTop: "1px solid rgba(180,160,130,0.3)" }
	}, /* @__PURE__ */ React.createElement("span", { className: "text-[13px] font-extrabold text-pet-text-dim tracking-wide" }, "洛克王国"), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-pet-text-dim" }, "Powered by alemonjs"))));
}

export { PetDetailCard as default };