import React from 'react';
import HTML from './HTML.js';

const width = 820;
function RocomEggCandidatesCard({ data }) {
    return (React.createElement(HTML, { style: { width: `${width}px`, background: '#faf6ed' } },
        React.createElement("div", { style: {
                width: '820px',
                background: 'linear-gradient(180deg, #fbf6ec 0%, #f5efe3 100%)',
                position: 'relative',
                padding: '40px 45px',
                boxSizing: 'border-box'
            } },
            React.createElement("div", { style: { position: 'relative', zIndex: 2 } },
                React.createElement("div", { style: {
                        textAlign: 'center',
                        marginBottom: '25px',
                        paddingBottom: '15px',
                        borderBottom: '2px dashed rgba(160, 140, 110, 0.4)'
                    } },
                    React.createElement("div", { style: {
                            color: '#ffc65f',
                            fontSize: '36px',
                            fontWeight: 900,
                            letterSpacing: '2px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        } }, "\u67E5\u86CB\u5019\u9009\u7ED3\u679C"),
                    React.createElement("div", { style: { color: '#9e8e76', fontSize: '15px', marginTop: '6px' } },
                        "\u5173\u952E\u8BCD\u300C",
                        data.keyword,
                        "\u300D\u547D\u4E2D ",
                        data.count,
                        " \u4E2A\u5019\u9009\uFF0C\u8BF7\u4F7F\u7528\u66F4\u7CBE\u786E\u7684\u540D\u79F0")),
                data.candidates.length > 0 ? (React.createElement("div", { style: { display: 'grid', gap: '14px', marginTop: '22px' } }, data.candidates.map((item, index) => (React.createElement("div", { key: `${item.id}-${index}`, style: {
                        background: 'rgba(255,255,255,0.94)',
                        borderRadius: '18px',
                        padding: '18px 20px',
                        boxShadow: '0 10px 24px rgba(40, 31, 23, 0.08)',
                        border: '1px solid rgba(75, 52, 35, 0.08)'
                    } },
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                            fontSize: '28px',
                            fontWeight: 700,
                            color: '#4d3624'
                        } },
                        React.createElement("span", null, item.name),
                        React.createElement("span", null,
                            "#",
                            item.id)),
                    React.createElement("div", { style: { marginTop: '10px', color: '#75563d', fontSize: '18px', lineHeight: 1.7 } },
                        "\u5C5E\u6027\uFF1A",
                        item.typeLabel,
                        React.createElement("br", null),
                        "\u86CB\u7EC4\uFF1A",
                        item.eggGroupsLabel,
                        React.createElement("br", null),
                        "\u8EAB\u9AD8\uFF1A",
                        item.heightLabel,
                        " \uFF5C \u4F53\u91CD\uFF1A",
                        item.weightLabel)))))) : (React.createElement("div", { style: {
                        textAlign: 'center',
                        fontSize: '24px',
                        color: '#6f5845',
                        padding: '48px 24px',
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '18px',
                        border: '1px solid rgba(201, 121, 38, 0.15)'
                    } }, "\u6CA1\u6709\u53EF\u5C55\u793A\u7684\u5019\u9009\u7ED3\u679C")),
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
                    React.createElement("span", null, data.copyright))))));
}

export { RocomEggCandidatesCard as default };
