import React from 'react';

function DarkContainer({ children, width = 600 }) {
    return (React.createElement("div", { className: 'bg-base-bg flex flex-col gap-4 p-6 box-border text-white', style: { width: `${width}px` } }, children));
}
function Section({ title, children, extra }) {
    return (React.createElement("div", { className: 'bg-base-panel rounded-xl border border-base-panel-bd py-4 px-5' },
        React.createElement("div", { className: 'flex items-center mb-3 border-b border-white/5 pb-2.5' },
            React.createElement("div", { className: 'text-lg font-extrabold text-base-green-lt mr-3' }, title),
            React.createElement("div", { className: 'flex-1 h-0.5', style: { background: 'linear-gradient(90deg, rgba(76,175,80,0.4), transparent)' } }),
            extra && React.createElement("div", { className: 'ml-2.5 text-[#888] text-sm' }, extra)),
        children));
}
function Footer() {
    return React.createElement("div", { className: 'text-right text-xs text-white/25 py-1' }, "\u6D1B\u514B\u738B\u56FD\u5BA0\u7269\u56FE\u9274 \u00B7 Powered by alemonjs");
}

export { DarkContainer, Footer, Section };
