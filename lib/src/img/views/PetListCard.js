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
const COLS = 5;
const CARD_W = 150;
const GAP = 14;
const PAD = 28;
const TOTAL_W = COLS * CARD_W + (COLS - 1) * GAP + PAD * 2;
function PetListCard({ data }) {
    const { pets, element } = data;
    return (React.createElement(HTML, { style: { width: `${TOTAL_W}px` } },
        React.createElement("div", { className: classNames('bg-list-bg text-list-cream rounded-card overflow-hidden') },
            React.createElement("div", { className: 'pt-6 px-7 pb-4 text-center' },
                React.createElement("div", { className: 'inline-block bg-list-bg border-2 border-list-border rounded-lg px-4 py-1 text-[13px] font-bold text-list-cream tracking-widest mb-2.5' }, "\u6D1B\u514B\u738B\u56FD"),
                React.createElement("div", { className: 'text-4xl font-black text-list-cream tracking-[6px] mb-1', style: { textShadow: '2px 2px 0 rgba(0,0,0,0.3)' } }, "\u7CBE\u7075\u56FE\u9274"),
                React.createElement("div", { className: 'text-sm text-list-dim' }, element === '全部' ? `全部宠物 · 共 ${pets.length} 只` : `${element}系 · 共 ${pets.length} 只`)),
            React.createElement("div", { className: 'mx-7 border-t-2 border-dashed border-list-dotted' }),
            React.createElement("div", { className: 'px-7 pt-[18px] pb-6 flex flex-wrap', style: { gap: `${GAP}px` } }, pets.map(pet => {
                const elems = getElements(pet);
                const bg = getGradient(elems);
                return (React.createElement("div", { key: pet.id, className: 'bg-list-card rounded-xl overflow-hidden shadow-card-md border-2 border-list-tan', style: { width: `${CARD_W}px` } },
                    React.createElement("div", { className: 'p-3 flex justify-center items-center', style: { background: 'linear-gradient(135deg, #D4B896, #F0E6D0)' } },
                        React.createElement("div", { className: 'rounded-xl p-[3px] shadow-card-sm', style: { background: bg } },
                            React.createElement("img", { className: 'w-[100px] h-[100px] rounded-[10px] object-cover bg-white block', src: pet.avatar, alt: pet.name }))),
                    React.createElement("div", { className: 'bg-list-kraft py-2 px-2.5 text-center border-t-2 border-list-kraft-lt' },
                        React.createElement("div", { className: 'text-base font-black text-white tracking-widest' }, pet.name),
                        React.createElement("div", { className: 'flex gap-1 justify-center mt-1' }, elems.map((e, i) => (React.createElement("span", { key: i, className: 'text-[11px] px-2 py-px rounded-lg text-white font-bold', style: { background: elementColors[e] || '#888' } }, e)))))));
            })),
            React.createElement("div", { className: 'mx-7 mb-6 border-2 border-dashed border-list-dotted rounded-xl py-3.5 px-5 text-center' },
                React.createElement("span", { className: 'text-[15px] text-list-dim italic tracking-wide' }, "\u5C0F\u6D1B\u514B\uFF0C\u5FEB\u6765\u6536\u96C6\u4F60\u7684\u7CBE\u7075\u4F19\u4F34\u5427\uFF01")),
            React.createElement("div", { className: 'px-7 py-2.5 pb-4 flex justify-between items-center' },
                React.createElement("span", { className: 'text-[13px] font-extrabold text-list-dim tracking-wide' }, "\u6D1B\u514B\u738B\u56FD"),
                React.createElement("span", { className: 'text-[11px] text-white/20' }, "Powered by alemonjs")))));
}

export { PetListCard as default };
