import React from 'react';
import HTML from './HTML.js';

function RocomMerchantTodayCard({ data }) {
    return (React.createElement(HTML, { style: { width: '1120px', background: '#ece3d3' } },
        React.createElement("div", { style: {
                width: '1120px',
                padding: '26px',
                boxSizing: 'border-box',
                background: '#ece3d3',
                color: '#3a2f24',
                fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
            } },
            React.createElement("div", { style: {
                    borderRadius: '30px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, #f6ecda 0%, #eadbbf 100%)',
                    boxShadow: '0 24px 52px rgba(58, 39, 21, 0.14)'
                } },
                React.createElement("header", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '104px',
                        padding: '0 34px',
                        background: 'linear-gradient(90deg, #e9b04c, #d99a35)'
                    } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: '40px', letterSpacing: '4px', fontWeight: 800, color: '#2c2013' } }, data.title),
                        React.createElement("div", { style: { marginTop: '6px', color: '#6b4a13', fontSize: '16px' } }, data.subtitle)),
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' } },
                        React.createElement("span", { style: {
                                padding: '9px 16px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.74)',
                                color: '#3a2f24',
                                fontSize: '17px',
                                fontWeight: 800
                            } },
                            "\u5171 ",
                            data.totalProducts,
                            " \u4EF6\u5546\u54C1"),
                        React.createElement("span", { style: { display: 'flex', gap: '8px' } },
                            React.createElement("span", { style: { padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.62)', fontSize: '14px', color: '#5c4a37' } }, data.currentRoundLabel),
                            React.createElement("span", { style: { padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.62)', fontSize: '14px', color: '#bf5f3f' } },
                                "\u5269\u4F59 ",
                                data.currentCountdown)))),
                React.createElement("main", { style: { display: 'grid', gap: '14px', padding: '22px 30px 30px' } }, data.rows.length > 0 ? (data.rows.map(row => (React.createElement("section", { key: `${row.roundId}-${row.label}`, style: {
                        padding: '16px 18px',
                        borderRadius: '20px',
                        border: row.isCurrent ? '2px solid #d99a35' : '1px solid rgba(118, 97, 74, 0.16)',
                        background: row.isCurrent ? 'rgba(255,243,214,0.92)' : 'rgba(255,255,255,0.62)'
                    } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' } },
                        React.createElement("span", { style: {
                                padding: '6px 14px',
                                borderRadius: '999px',
                                background: row.isCurrent ? '#d99a35' : 'rgba(118,97,74,0.18)',
                                color: row.isCurrent ? '#fff' : '#5c4a37',
                                fontSize: '16px',
                                fontWeight: 800
                            } }, row.label),
                        React.createElement("span", { style: { color: '#8b7a63', fontSize: '14px' } }, row.timeLabel),
                        row.isCurrent ? (React.createElement("span", { style: { padding: '4px 10px', borderRadius: '999px', background: '#c8e6c9', color: '#1b5e20', fontSize: '12px', fontWeight: 700 } }, "\u5F53\u524D\u8F6E\u6B21")) : null,
                        React.createElement("span", { style: { marginLeft: 'auto', color: '#8b7a63', fontSize: '14px' } },
                            row.items.length,
                            " \u4EF6")),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' } }, row.items.map((item, index) => (React.createElement("div", { key: `${item.goodsName}-${item.roundId}-${index}`, style: {
                            padding: '12px 10px',
                            borderRadius: '16px',
                            border: '1px solid rgba(118, 97, 74, 0.14)',
                            background: item.isEnded ? 'rgba(240,234,222,0.75)' : 'rgba(255,255,255,0.85)',
                            opacity: item.isEnded ? 0.62 : 1,
                            textAlign: 'center'
                        } },
                        item.iconUrl ? (React.createElement("img", { src: item.iconUrl, alt: item.goodsName, style: { width: '64px', height: '64px', objectFit: 'contain' } })) : (React.createElement("div", { style: {
                                width: '64px',
                                height: '64px',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '12px',
                                background: '#e8dfcd',
                                color: '#8b7a63',
                                fontSize: '20px'
                            } }, "\u65E0\u56FE")),
                        React.createElement("div", { style: { marginTop: '6px', fontSize: '15px', fontWeight: 700, overflowWrap: 'break-word' } }, item.goodsName),
                        item.price > 0 ? (React.createElement("div", { style: { marginTop: '4px', color: '#b5791f', fontSize: '17px', fontWeight: 800 } }, item.price)) : (React.createElement("div", { style: { marginTop: '4px', color: '#a89a83', fontSize: '14px' } }, "\u4EF7\u683C\u672A\u77E5")),
                        React.createElement("div", { style: { marginTop: '4px', color: '#7f6e57', fontSize: '11px' } }, item.remainingStr))))))))) : (React.createElement("div", { style: {
                        padding: '40px',
                        textAlign: 'center',
                        borderRadius: '20px',
                        border: '1px dashed rgba(120, 102, 81, 0.35)',
                        color: '#5c4a37',
                        fontSize: '18px'
                    } }, "\u4ECA\u65E5\u6682\u65E0\u5DF2\u516C\u5E03\u7684\u8FDC\u884C\u5546\u4EBA\u5546\u54C1\u3002")))))));
}

export { RocomMerchantTodayCard as default };
