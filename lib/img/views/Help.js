import fileUrl from '../../assets/bg/image2.png.js';
import classNames from 'classnames';
import React from 'react';
import HTML from './HTML.js';

const HELP_DATA = [
    {
        title: '宠物图鉴',
        items: [
            { name: '查看宠物', desc: '图鉴 / 查询 / cw + 宠物名', eg: '#roco图鉴 迪莫' },
            { name: '宠物列表', desc: '宠物 / 精灵 / cwlb（可选属性）', eg: '#roco宠物' },
            { name: '属性筛选', desc: '按属性筛选宠物列表', eg: '#洛克宠物 火' },
            { name: '技能搜索', desc: '技能 / jn + 技能名', eg: '#roco技能 闪光冲击' }
        ]
    },
    {
        title: '资讯功能',
        items: [
            { name: '活动日历', desc: '活动 / 日历 / hdrl', eg: '#roco活动' },
            { name: '公告列表', desc: '查看最新公告，可切换分类', eg: '#roco公告' },
            { name: '公告分类', desc: '公告 / 资讯 / 活动', eg: '#洛克公告 资讯' },
            { name: '公告详情', desc: '公告 + 序号查看详情', eg: '#洛克公告 3' }
        ]
    },
    {
        title: '快捷指令',
        items: [
            { name: '帮助', desc: '帮助 / help', eg: '#roco帮助' },
            { name: '前缀', desc: '支持多种前缀', eg: '#roco / #洛克' }
        ]
    }
];
const CARD_W = 520;
function Star({ size, top, left, right, opacity = 1 }) {
    return (React.createElement("div", { className: 'absolute text-help-star', style: { top, left, right, width: `${size}px`, height: `${size}px`, opacity, fontSize: `${size}px`, lineHeight: 1 } }, "\u2726"));
}
function RocoHelp() {
    return (React.createElement(HTML, { style: { width: `${CARD_W}px` } },
        React.createElement("div", { className: 'bg-help-border p-2.5 box-border' },
            React.createElement("div", { className: 'bg-help-gold rounded-[14px] overflow-hidden' },
                React.createElement("div", { className: 'pt-6 px-7 pb-4 text-center', style: { background: `url(${fileUrl}) no-repeat center/cover` } },
                    React.createElement("div", { className: 'text-[34px] font-black text-[#1a1a1a] tracking-[4px]', style: { textShadow: '1px 1px 0 rgba(255,255,255,0.3)' } }, "\u6D1B\u514B\u738B\u56FD\u52A9\u624B"),
                    React.createElement("div", { className: 'text-[15px] text-[#5a4210] mt-1 opacity-70' }, "\u5C0F\u6D1B\u514B\uFF0C\u6B22\u8FCE\u6765\u5230\u6D1B\u514B\u738B\u56FD\uFF01")),
                React.createElement("div", { className: 'mx-5 border-t-[3px] border-dashed border-black/15' }),
                React.createElement("div", { className: 'p-5 px-6' },
                    React.createElement("div", { className: 'bg-help-cream rounded-2xl p-5 shadow-cream' }, HELP_DATA.map((cat, ci) => (React.createElement("div", { key: ci, className: classNames(ci < HELP_DATA.length - 1 && 'mb-[18px]') },
                        React.createElement("div", { className: 'text-lg font-extrabold text-[#4a3210] border-l-4 border-help-gold-dk pl-2.5 mb-2.5' }, cat.title),
                        React.createElement("div", { className: 'flex flex-col gap-2' }, cat.items.map((item, idx) => (React.createElement("div", { key: idx, className: 'flex items-center justify-between bg-white/70 border border-help-gold/30 rounded-[10px] py-2.5 px-3.5' },
                            React.createElement("div", null,
                                React.createElement("div", { className: 'text-base font-bold text-help-dark' }, item.name),
                                React.createElement("div", { className: 'text-xs text-[#888] mt-0.5' }, item.desc)),
                            React.createElement("div", { className: 'text-[13px] text-help-gold-dp bg-help-gold/20 py-1 px-2.5 rounded-lg font-bold whitespace-nowrap' }, item.eg)))))))))),
                React.createElement("div", { className: 'bg-help-dark py-5 px-6 relative overflow-hidden' },
                    React.createElement(Star, { size: 18, top: '8px', right: '60px' }),
                    React.createElement(Star, { size: 12, top: '14px', right: '30px', opacity: 0.6 }),
                    React.createElement(Star, { size: 22, top: '28px', right: '80px', opacity: 0.4 }),
                    React.createElement(Star, { size: 10, top: '6px', right: '120px', opacity: 0.5 }),
                    React.createElement("div", { className: 'bg-white/[0.08] rounded-[10px] py-3 px-4 flex items-center gap-3' },
                        React.createElement("div", { className: 'w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl font-black text-help-dark shrink-0' }, "#"),
                        React.createElement("div", null,
                            React.createElement("div", { className: 'text-sm text-white/80 font-bold' }, "\u6307\u4EE4\u524D\u7F00"),
                            React.createElement("div", { className: 'text-xs text-white/45 mt-0.5' }, "# / \uFF03 \u00B7 \u652F\u6301 roco / \u6D1B\u514B"))),
                    React.createElement("div", { className: 'flex justify-between items-center mt-4' },
                        React.createElement("span", { className: 'text-base font-black text-white/60 tracking-widest' }, "\u6D1B\u514B\u738B\u56FD"),
                        React.createElement("span", { className: 'text-xs text-white/25' }, "Powered by alemonjs")))))));
}

export { RocoHelp as default };
