import fileUrl from '../../assets/bg/image3.png.js';
import React from 'react';
import HTML from './HTML.js';

const TABS = ['最新', '公告', '资讯', '活动'];
const CARD_W = 600;
function formatDate(dateStr) {
    return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})/, '$1-$2-$3 $4');
}
function AnnouncementCard({ data }) {
    const { announcements, activeTab = '最新', page = 1, totalPages = 1 } = data;
    return (React.createElement(HTML, { style: { width: `${CARD_W}px` } },
        React.createElement("div", { className: 'bg-ann-bg box-border overflow-hidden', style: { width: `${CARD_W}px`, background: `url(${fileUrl}) no-repeat center/cover` } },
            React.createElement("div", { className: 'flex items-stretch', style: { borderBottom: '2px solid rgba(180,160,130,0.35)' } }, TABS.map(tab => {
                const isActive = tab === activeTab;
                return (React.createElement("div", { key: tab, className: 'flex-1 text-center py-2.5 text-[15px] font-bold', style: {
                        background: isActive ? '#E8A820' : 'transparent',
                        color: isActive ? '#fff' : '#6B5D4F',
                        borderRadius: isActive ? '8px 8px 0 0' : '0'
                    } }, tab));
            })),
            React.createElement("div", { className: 'flex flex-col gap-3 p-4 px-5' }, announcements.map((item, idx) => (React.createElement("div", { key: idx, className: 'bg-ann-card rounded-xl py-4 px-5 flex items-center justify-between', style: { border: '1px solid rgba(180,160,130,0.25)' } },
                React.createElement("div", { className: 'flex items-center gap-3 flex-1 mr-4' },
                    React.createElement("span", { className: 'text-[13px] font-extrabold shrink-0', style: {
                            background: '#E8A820',
                            color: '#fff',
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        } }, idx + 1),
                    React.createElement("div", { className: 'text-ann-title font-extrabold leading-snug flex-1', style: {
                            fontSize: '16px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        } }, item.title)),
                React.createElement("div", { className: 'text-ann-date text-[13px] whitespace-nowrap shrink-0', style: { fontFamily: 'monospace, tttgbnumber' } }, formatDate(item.date)))))),
            React.createElement("div", { className: 'flex flex-col items-center gap-1 py-3 pb-4', style: { borderTop: '1px solid rgba(180,160,130,0.25)' } },
                React.createElement("div", { className: 'flex items-center gap-3' },
                    React.createElement("span", { className: 'text-ann-footer text-sm font-bold' }, "\u5408\u5171"),
                    React.createElement("span", { className: 'text-ann-title text-base font-extrabold' },
                        page,
                        " / ",
                        totalPages),
                    React.createElement("span", { className: 'text-ann-footer text-lg', style: { marginLeft: '4px' } }, "\u25B6")),
                React.createElement("span", { className: 'text-ann-date text-[12px]' }, "\u53D1\u9001 #\u6D1B\u514B\u516C\u544A \u5E8F\u53F7 \u67E5\u770B\u8BE6\u60C5")))));
}

export { AnnouncementCard as default };
