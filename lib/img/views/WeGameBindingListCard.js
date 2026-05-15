import React from 'react';
import HTML from './HTML.js';

function getBadgeStyle(type) {
    switch (type) {
        case 'primary':
            return {
                background: '#ffc65f',
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            };
        case 'valid':
            return { background: 'rgba(105, 170, 97, 0.16)', color: '#4f8a44' };
        case 'invalid':
            return { background: 'rgba(199, 102, 86, 0.16)', color: '#b44c3c' };
        default:
            return { background: 'rgba(177, 132, 67, 0.12)', color: '#9d6c29' };
    }
}
function WeGameBindingListCard({ data }) {
    return (React.createElement(HTML, { style: { width: '740px', background: '#faf6ed' } },
        React.createElement("div", { style: {
                width: '740px',
                padding: '30px',
                boxSizing: 'border-box',
                background: '#faf6ed',
                fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
            } },
            React.createElement("div", { style: {
                    width: '680px',
                    margin: '0 auto',
                    padding: '30px 40px',
                    boxSizing: 'border-box',
                    background: 'linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)',
                    borderRadius: '26px',
                    boxShadow: '0 14px 34px rgba(122, 92, 48, 0.18)'
                } },
                React.createElement("div", { style: { position: 'relative', zIndex: 2 } },
                    React.createElement("div", { style: {
                            textAlign: 'center',
                            marginBottom: '25px',
                            borderBottom: '2px dashed rgba(160, 140, 110, 0.4)',
                            paddingBottom: '12px'
                        } },
                        React.createElement("h1", { style: {
                                color: '#ffc65f',
                                fontSize: '34px',
                                fontWeight: 800,
                                textShadow: '0 2px 4px rgba(0,0,0,0.35)',
                                letterSpacing: '2px',
                                margin: 0
                            } }, data.title),
                        React.createElement("p", { style: { color: '#9e8e76', fontSize: '14px', marginTop: '6px', marginBottom: 0 } }, data.subtitle)),
                    data.bindings.length > 0 ? (React.createElement("main", { style: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' } }, data.bindings.map(item => (React.createElement("div", { key: `${item.index}-${item.roleId}-${item.tgpId}`, style: {
                            width: '100%',
                            minHeight: '106px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '18px 25px',
                            boxSizing: 'border-box',
                            position: 'relative',
                            borderRadius: '20px',
                            background: item.isPrimary ? 'linear-gradient(180deg, #fff8e8 0%, #fff1cf 100%)' : 'linear-gradient(180deg, #fffaf0 0%, #f8eedc 100%)',
                            border: item.isPrimary ? '2px solid rgba(255, 198, 95, 0.75)' : '1px solid rgba(183, 152, 111, 0.28)',
                            boxShadow: item.isPrimary ? '0 0 8px rgba(255, 198, 95, 0.35)' : 'none'
                        } },
                        React.createElement("div", { style: {
                                fontSize: '24px',
                                fontWeight: 700,
                                color: '#c97926',
                                width: '50px',
                                textAlign: 'center',
                                opacity: 0.85
                            } },
                            "#",
                            item.index),
                        React.createElement("div", { style: { flex: 1, paddingLeft: '10px' } },
                            React.createElement("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    marginBottom: '8px'
                                } },
                                React.createElement("span", { style: { fontSize: '18px', fontWeight: 700, color: '#5a3e1b' } }, item.nickname),
                                React.createElement("span", { style: {
                                        fontSize: '11px',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        background: 'rgba(177, 132, 67, 0.12)',
                                        color: '#9d6c29',
                                        fontWeight: 700
                                    } },
                                    "\u7ED1\u5B9A",
                                    item.index,
                                    "/",
                                    item.total),
                                item.badges.map(badge => (React.createElement("span", { key: `${item.index}-${badge.type}-${badge.text}`, style: {
                                        ...getBadgeStyle(badge.type),
                                        fontSize: '11px',
                                        padding: '2px 7px',
                                        borderRadius: '10px',
                                        fontWeight: 700
                                    } }, badge.text)))),
                            React.createElement("div", { style: {
                                    fontSize: '13px',
                                    color: '#8c7a61',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    rowGap: '4px',
                                    marginBottom: '4px'
                                } },
                                React.createElement("span", { style: { opacity: 0.7, marginRight: '4px', whiteSpace: 'nowrap' } }, "\u72B6\u6001"),
                                React.createElement("span", { style: { fontWeight: 500, color: '#5f4d33' } }, item.statusText),
                                React.createElement("span", { style: { opacity: 0.7, marginRight: '4px', marginLeft: '15px', whiteSpace: 'nowrap' } }, "\u767B\u5F55\u65B9\u5F0F"),
                                React.createElement("span", { style: { fontWeight: 500, color: '#5f4d33' } }, item.loginType)),
                            React.createElement("div", { style: {
                                    fontSize: '13px',
                                    color: '#8c7a61',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    rowGap: '4px'
                                } },
                                React.createElement("span", { style: { opacity: 0.7, marginRight: '4px', whiteSpace: 'nowrap' } }, "\u89D2\u8272ID"),
                                React.createElement("span", { style: { fontWeight: 500, color: '#5f4d33' } }, item.roleId || '未返回'),
                                React.createElement("span", { style: { opacity: 0.7, marginRight: '4px', marginLeft: '15px', whiteSpace: 'nowrap' } }, "WeGameID"),
                                React.createElement("span", { style: { fontWeight: 500, color: '#5f4d33' } }, item.tgpId))),
                        React.createElement("div", { style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                fontSize: '11px',
                                textAlign: 'right',
                                width: '124px',
                                flexShrink: 0
                            } },
                            React.createElement("span", { style: { color: '#aa9b83' } }, "\u66F4\u65B0\u65F6\u95F4"),
                            React.createElement("span", { style: { color: '#8c7a61', lineHeight: 1.3 } }, item.updatedAt))))))) : (React.createElement("div", { style: {
                            padding: '60px 0',
                            textAlign: 'center',
                            color: '#9e8e76',
                            borderRadius: '20px',
                            background: 'linear-gradient(180deg, #fffaf0 0%, #f8eedc 100%)',
                            border: '1px solid rgba(183, 152, 111, 0.28)',
                            fontSize: '16px',
                            marginBottom: '20px'
                        } }, data.emptyText)),
                    React.createElement("div", { style: {
                            marginTop: '15px',
                            padding: '10px 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            color: '#9e8e76',
                            fontSize: '14px',
                            fontWeight: 700
                        } },
                        React.createElement("span", { style: { fontSize: '14px', color: '#b17f35' } }, "\u63D0\u793A"),
                        React.createElement("span", null, data.tip)),
                    React.createElement("div", { style: { marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#bfae95', opacity: 0.8 } }, data.copyright))))));
}

export { WeGameBindingListCard as default };
