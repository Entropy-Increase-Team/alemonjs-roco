import { elementColors } from '../../data/config.js';
import classNames from 'classnames';
import React from 'react';
import HTML from './HTML.js';

function getElements(pet) {
    return Array.isArray(pet.element) ? pet.element : [pet.element];
}
function getGradient(elems) {
    if (elems.length === 1) {
        return elementColors[elems[0]] || '#666';
    }
    return `linear-gradient(135deg, ${elementColors[elems[0]] || '#666'}, ${elementColors[elems[1]] || '#666'})`;
}
function PetDetailCard({ data }) {
    const { pet } = data;
    const elems = getElements(pet);
    const bg = getGradient(elems);
    const total = pet.hp + pet.atk + pet.mat + pet.def + pet.mdf + pet.spd;
    const stats = [
        { label: '血量', value: pet.hp },
        { label: '攻击', value: pet.atk },
        { label: '魔攻', value: pet.mat },
        { label: '防御', value: pet.def },
        { label: '魔抗', value: pet.mdf },
        { label: '速度', value: pet.spd }
    ];
    return (React.createElement(HTML, null,
        React.createElement("div", { className: classNames('w-[680px] bg-pet-bg rounded-card overflow-hidden text-pet-text'), style: { border: '1px solid rgba(180,160,130,0.3)' } },
            React.createElement("div", { className: 'flex items-start gap-6 p-7 pb-5' },
                React.createElement("div", { className: 'rounded-avatar p-1 shadow-avatar shrink-0', style: { background: bg } },
                    React.createElement("img", { className: 'w-[120px] h-[120px] rounded-[14px] object-cover bg-white block', src: pet.avatar, alt: pet.name })),
                React.createElement("div", { className: 'flex-1 min-w-0 pt-1' },
                    React.createElement("div", { className: 'flex items-baseline gap-2.5' },
                        React.createElement("div", { className: 'text-[32px] font-black text-pet-text tracking-wide' }, pet.name),
                        React.createElement("div", { className: 'text-sm text-pet-text-dim' },
                            "No.",
                            pet.id)),
                    React.createElement("div", { className: 'flex gap-2 mt-2' }, elems.map((e, i) => (React.createElement("span", { key: i, className: 'inline-flex items-center gap-1 px-3.5 py-1 rounded-[14px] text-[13px] font-bold text-white', style: { background: elementColors[e] || '#888' } }, e)))),
                    React.createElement("div", { className: 'mt-3.5 bg-pet-panel rounded-[10px] p-2.5 px-3.5', style: { border: '1px solid rgba(180,160,130,0.3)' } },
                        React.createElement("div", { className: 'text-sm font-bold text-pet-accent' }, pet.trait?.name || '无特性'),
                        React.createElement("div", { className: 'text-xs text-pet-text-sec mt-1 leading-relaxed' }, pet.trait?.desc || '')))),
            React.createElement("div", { className: 'px-7 pb-5' },
                React.createElement("div", { className: 'flex items-center mb-2.5 gap-2' },
                    React.createElement("div", { className: 'text-base font-extrabold text-pet-text' }, "\u79CD\u65CF\u503C"),
                    React.createElement("div", { className: 'flex-1 h-px bg-pet-border' }),
                    React.createElement("div", { className: 'text-xs text-pet-text-dim' },
                        "\u603B\u548C ",
                        total)),
                React.createElement("div", { className: 'grid grid-cols-3 gap-2' }, stats.map((stat, i) => (React.createElement("div", { key: i, className: 'bg-pet-stat rounded-[10px] py-2.5 px-3.5 flex justify-between items-center', style: { border: '1px solid rgba(180,160,130,0.3)' } },
                    React.createElement("span", { className: 'text-[13px] text-pet-text-sec' }, stat.label),
                    React.createElement("span", { className: 'text-lg font-bold text-pet-text' }, stat.value)))))),
            React.createElement("div", { className: 'px-7 pb-7' },
                React.createElement("div", { className: 'flex items-center mb-2.5 gap-2' },
                    React.createElement("div", { className: 'text-base font-extrabold text-pet-text' }, "\u6280\u80FD"),
                    React.createElement("div", { className: 'flex-1 h-px bg-pet-border' }),
                    React.createElement("div", { className: 'text-xs text-pet-text-dim' },
                        pet.skills.length,
                        " \u4E2A\u6280\u80FD")),
                React.createElement("div", { className: 'grid grid-cols-2 gap-2' }, pet.skills.map((s, idx) => (React.createElement("div", { key: idx, className: 'bg-pet-skill rounded-[10px] py-2.5 px-3.5 min-w-0', style: { border: '1px solid rgba(180,160,130,0.3)' } },
                    React.createElement("div", { className: 'flex items-center gap-1.5 mb-1' },
                        React.createElement("span", { className: 'text-sm font-bold text-pet-text' }, s.name),
                        React.createElement("span", { className: 'text-[11px] px-2 py-px rounded-lg text-white', style: { background: elementColors[s.element] || '#888' } }, s.element)),
                    s.desc && React.createElement("div", { className: 'text-[11px] text-pet-text-sec leading-snug mb-1' }, s.desc),
                    React.createElement("div", { className: 'flex gap-2.5 text-[11px] text-pet-text-dim' },
                        React.createElement("span", null, s.type),
                        React.createElement("span", null,
                            "\u5A01\u529B ",
                            s.power),
                        React.createElement("span", null,
                            "\u80FD\u91CF ",
                            s.cost))))))),
            React.createElement("div", { className: 'px-7 py-2.5 pb-3.5 flex justify-between items-center', style: { borderTop: '1px solid rgba(180,160,130,0.3)' } },
                React.createElement("span", { className: 'text-[13px] font-extrabold text-pet-text-dim tracking-wide' }, "\u6D1B\u514B\u738B\u56FD"),
                React.createElement("span", { className: 'text-[11px] text-pet-text-dim' }, "Powered by alemonjs")))));
}

export { PetDetailCard as default };
