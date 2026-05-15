import React from 'react';
import HTML from './HTML.js';

const width = 820;
function renderMatchCard(item, key) {
    return (React.createElement("div", { key: key, style: {
            background: 'rgba(255,255,255,0.94)',
            borderRadius: '18px',
            padding: '18px',
            boxShadow: '0 10px 24px rgba(40, 31, 23, 0.08)',
            border: '1px solid rgba(75, 52, 35, 0.08)'
        } },
        item.icon ? (React.createElement("div", { style: {
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(248,244,236,0.92)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                border: '1px solid rgba(75, 52, 35, 0.08)'
            } },
            React.createElement("img", { src: item.icon, alt: item.name, style: { width: '56px', height: '56px', objectFit: 'contain' } }))) : null,
        React.createElement("div", { style: { fontSize: '26px', fontWeight: 700, color: '#4d3624' } },
            item.name,
            " #",
            item.id),
        React.createElement("div", { style: { marginTop: '8px', color: '#75563d', fontSize: '18px', lineHeight: 1.7 } },
            "\u5C5E\u6027\uFF1A",
            item.typeLabel,
            React.createElement("br", null),
            "\u86CB\u7EC4\uFF1A",
            item.eggGroupsLabel,
            React.createElement("br", null),
            "\u8EAB\u9AD8\uFF1A",
            item.heightLabel,
            " \uFF5C \u4F53\u91CD\uFF1A",
            item.weightLabel)));
}
function RocomEggSizeCard({ data }) {
    return (React.createElement(HTML, { style: { width: `${width}px`, background: '#faf6ed' } },
        React.createElement("div", { style: {
                width: '820px',
                background: 'linear-gradient(180deg, #fbf6ec 0%, #f5efe3 100%)',
                position: 'relative',
                padding: '40px 45px',
                boxSizing: 'border-box'
            } },
            React.createElement("div", { style: {
                    background: 'rgba(255,255,255,0.72)',
                    borderRadius: '22px',
                    padding: '22px 28px',
                    border: '1px solid rgba(201, 121, 38, 0.18)',
                    marginBottom: '20px'
                } },
                React.createElement("div", { style: { fontSize: '36px', fontWeight: 900, color: '#5a3e1b', letterSpacing: '2px' } }, "\u5C3A\u5BF8\u53CD\u67E5"),
                React.createElement("div", { style: { fontSize: '18px', color: '#84674d', marginTop: '8px' } },
                    "\u67E5\u8BE2\u6761\u4EF6\uFF1A",
                    data.queryLabel)),
            !data.hasResults ? (React.createElement("div", { style: {
                    textAlign: 'center',
                    color: '#6f5845',
                    padding: '44px 20px',
                    fontSize: '24px',
                    background: 'rgba(255,255,255,0.6)',
                    borderRadius: '20px',
                    border: '1px solid rgba(201, 121, 38, 0.15)'
                } }, "\u6CA1\u6709\u627E\u5230\u5339\u914D\u5F53\u524D\u5C3A\u5BF8\u7684\u7CBE\u7075")) : null,
            data.perfectMatches.length > 0 ? (React.createElement("section", { style: { marginTop: '20px' } },
                React.createElement("div", { style: { fontSize: '28px', fontWeight: 800, color: '#4b3423', marginBottom: '14px' } }, "\u5B8C\u7F8E\u5339\u914D"),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' } }, data.perfectMatches.map((item, index) => renderMatchCard(item, `perfect-${index}`))))) : null,
            data.rangeMatches.length > 0 ? (React.createElement("section", { style: { marginTop: '20px' } },
                React.createElement("div", { style: { fontSize: '28px', fontWeight: 800, color: '#4b3423', marginBottom: '14px' } }, "\u8303\u56F4\u5339\u914D"),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' } }, data.rangeMatches.map((item, index) => renderMatchCard(item, `range-${index}`))))) : null,
            React.createElement("div", { style: {
                    marginTop: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '18px',
                    color: '#9e8e76',
                    fontSize: '15px'
                } },
                React.createElement("span", null, data.commandHint),
                React.createElement("span", null, data.copyright)))));
}

export { RocomEggSizeCard as default };
