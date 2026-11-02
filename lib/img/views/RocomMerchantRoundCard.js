import React from 'react';
import HTML from './HTML.js';

function RocomMerchantRoundCard({ data }) {
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
                        React.createElement("div", { style: { marginTop: '6px', color: '#6b4a13', fontSize: '16px' } },
                            data.dateStr,
                            " \u00B7 ",
                            data.timeRange,
                            " \u00B7 \u6BCF\u65E5 08:00 / 12:00 / 16:00 / 20:00 \u5237\u65B0")),
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' } },
                        React.createElement("span", { style: {
                                padding: '9px 16px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.74)',
                                color: '#3a2f24',
                                fontSize: '17px',
                                fontWeight: 800
                            } }, data.currentRoundLabel),
                        React.createElement("span", { style: { padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.62)', fontSize: '14px', color: '#bf5f3f' } },
                            "\u5269\u4F59 ",
                            data.countdown))),
                React.createElement("main", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '22px 30px 30px' } }, data.goods.length > 0 ? (data.goods.map(item => (React.createElement("section", { key: `${item.goodsName}-${item.roundId}-${item.num}`, style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px 18px',
                        borderRadius: '20px',
                        border: '1px solid rgba(118, 97, 74, 0.14)',
                        background: item.isEnded ? 'rgba(240,234,222,0.78)' : 'rgba(255,255,255,0.85)',
                        opacity: item.isEnded ? 0.66 : 1
                    } },
                    React.createElement("span", { style: {
                            flex: 'none',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '999px',
                            background: item.isHot ? '#d99a35' : 'rgba(118,97,74,0.14)',
                            color: item.isHot ? '#fff' : '#5c4a37',
                            fontSize: '17px',
                            fontWeight: 800
                        } }, item.num),
                    item.iconUrl ? (React.createElement("img", { src: item.iconUrl, alt: item.goodsName, style: { flex: 'none', width: '82px', height: '82px', objectFit: 'contain', borderRadius: '14px', background: 'rgba(255,255,255,0.6)' } })) : (React.createElement("div", { style: {
                            flex: 'none',
                            width: '82px',
                            height: '82px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '14px',
                            background: '#e8dfcd',
                            color: '#8b7a63'
                        } }, "\u65E0\u56FE")),
                    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
                            React.createElement("span", { style: { fontSize: '23px', fontWeight: 800, overflowWrap: 'break-word' } }, item.goodsName),
                            item.isHot ? (React.createElement("span", { style: { padding: '3px 9px', borderRadius: '999px', background: '#d99a35', color: '#fff', fontSize: '12px', fontWeight: 700 } }, "\u70ED\u9500")) : null),
                        React.createElement("div", { style: { marginTop: '6px', color: '#7f6e57', fontSize: '13px' } }, item.timeLabel),
                        React.createElement("div", { style: { marginTop: '6px', fontSize: '13px', color: '#8b7a63' } }, item.remainingStr)),
                    React.createElement("div", { style: { flex: 'none', textAlign: 'right' } },
                        React.createElement("div", { style: { color: '#b5791f', fontSize: '26px', fontWeight: 800 } }, item.price > 0 ? item.price : '--'),
                        React.createElement("div", { style: { color: '#8b7a63', fontSize: '12px' } }, "\u4EF7\u683C")))))) : (React.createElement("div", { style: {
                        gridColumn: '1 / -1',
                        padding: '40px',
                        textAlign: 'center',
                        borderRadius: '20px',
                        border: '1px dashed rgba(120, 102, 81, 0.35)',
                        color: '#5c4a37',
                        fontSize: '18px'
                    } }, "\u5F53\u524D\u8F6E\u6B21\u6682\u65E0\u5546\u54C1\u3002")))))));
}

export { RocomMerchantRoundCard as default };
