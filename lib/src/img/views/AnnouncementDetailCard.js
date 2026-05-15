import fileUrl from '../../assets/bg/image3.png.js';
import Markdown from 'markdown-to-jsx';
import React from 'react';
import HTML from './HTML.js';

const CARD_W = 600;
function formatDate(dateStr) {
    return dateStr.replace(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})/, '$1-$2-$3 $4');
}
function htmlToMarkdown(html) {
    return (html
        .replace(/<table[^>]*>/gi, '\n')
        .replace(/<\/table>/gi, '\n')
        .replace(/<thead[^>]*>/gi, '')
        .replace(/<\/thead>/gi, '')
        .replace(/<tbody[^>]*>/gi, '')
        .replace(/<\/tbody>/gi, '')
        .replace(/<tr[^>]*>/gi, '| ')
        .replace(/<\/tr>/gi, ' |\n')
        .replace(/<th[^>]*>(.*?)<\/th>/gi, ' $1 |')
        .replace(/<td[^>]*>(.*?)<\/td>/gi, ' $1 |')
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        .replace(/<img[^>]*>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<p[^>]*>/gi, '')
        .replace(/<li[^>]*>/gi, '- ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/?[ou]l[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim());
}
function AnnouncementDetailCard({ data }) {
    const { detail } = data;
    const markdown = htmlToMarkdown(detail.content);
    const lines = markdown.split('\n');
    const truncated = lines.length > 40;
    const displayMd = truncated ? lines.slice(0, 40).join('\n') : markdown;
    return (React.createElement(HTML, { style: { width: `${CARD_W}px` } },
        React.createElement("div", { className: 'bg-ann-bg box-border overflow-hidden', style: { width: `${CARD_W}px`, background: `url(${fileUrl}) no-repeat center/cover` } },
            React.createElement("div", { className: 'px-5 pt-5 pb-3', style: { borderBottom: '2px solid rgba(180,160,130,0.35)' } },
                React.createElement("div", { className: 'text-ann-title font-extrabold text-lg leading-snug' }, detail.title),
                React.createElement("div", { className: 'flex items-center gap-3 mt-2' },
                    React.createElement("span", { className: 'text-ann-date text-[13px]', style: { fontFamily: 'monospace, tttgbnumber' } }, formatDate(detail.date)),
                    React.createElement("span", { className: 'text-ann-footer text-[12px]' }, detail.author))),
            React.createElement("div", { className: 'px-5 py-4 text-ann-title text-[14px] leading-relaxed ann-detail-content' },
                React.createElement(Markdown, { options: {
                        forceBlock: true,
                        overrides: {
                            p: { props: { className: 'mb-2' } },
                            strong: { props: { style: { color: '#E8A820' } } },
                            table: { props: { className: 'w-full text-[13px] border-collapse my-2' } },
                            th: { props: { className: 'text-left py-1 px-2 border-b border-ann-tab font-bold' } },
                            td: { props: { className: 'py-1 px-2 border-b border-ann-tab/30' } }
                        }
                    } }, displayMd),
                truncated && React.createElement("p", { className: 'text-ann-footer text-[13px] mt-3 text-center' }, "\u2026\u2026 \u5185\u5BB9\u8FC7\u957F\uFF0C\u8BF7\u524D\u5F80\u5B98\u7F51\u67E5\u770B\u5B8C\u6574\u516C\u544A")),
            React.createElement("div", { className: 'flex items-center justify-center py-3 pb-4', style: { borderTop: '1px solid rgba(180,160,130,0.25)' } },
                React.createElement("span", { className: 'text-ann-footer text-sm font-bold' }, "\u6D1B\u514B\u738B\u56FD \u00B7 \u516C\u544A\u8BE6\u60C5")))));
}

export { AnnouncementDetailCard as default };
