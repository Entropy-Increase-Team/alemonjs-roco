import React from 'react';
import HTML from './HTML.js';

const width = 1040;
function RocomMerchantCard({ data }) {
    return (React.createElement(HTML, { style: { width: `${width}px`, background: '#ece3d3' } },
        React.createElement("div", { style: {
                position: 'relative',
                width: '1040px',
                margin: '0 auto',
                padding: '14px',
                overflow: 'hidden',
                background: '#ece3d3',
                borderRadius: '30px',
                boxSizing: 'border-box'
            } },
            React.createElement("div", { style: {
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    padding: '0 0 8px'
                } },
                React.createElement("div", { style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginBottom: '18px',
                        padding: '20px 22px',
                        border: '1px solid rgba(118, 97, 74, 0.22)',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.86), rgba(245,236,221,0.9))',
                        boxShadow: '0 14px 36px rgba(58, 39, 21, 0.08)'
                    } },
                    React.createElement("div", { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' } },
                        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
                            React.createElement("div", { style: {
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fffaf0',
                                    fontSize: '28px',
                                    fontWeight: 900
                                } }, "\uD83D\uDED2"),
                            React.createElement("div", { style: {
                                    fontSize: '40px',
                                    fontWeight: 800,
                                    letterSpacing: '3px',
                                    color: '#3a2f24'
                                } }, data.title)),
                        React.createElement("div", { style: { color: '#6b5846', fontSize: '16px' } }, data.subtitle)),
                    React.createElement("div", { style: {
                            minWidth: '250px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            gap: '12px',
                            paddingLeft: '18px',
                            borderLeft: '1px solid rgba(118, 97, 74, 0.18)'
                        } },
                        React.createElement("div", { style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                borderRadius: '999px',
                                padding: '9px 14px',
                                border: '1px solid rgba(179, 123, 45, 0.2)',
                                background: 'rgba(255,255,255,0.72)',
                                color: '#5c4a37',
                                fontSize: '16px'
                            } },
                            "\u5546\u54C1\u6570",
                            React.createElement("strong", { style: {
                                    marginLeft: '8px',
                                    color: '#b5791f',
                                    fontSize: '30px',
                                    fontWeight: 800
                                } }, data.productCount)),
                        React.createElement("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-end',
                                width: '100%'
                            } },
                            React.createElement("div", { style: {
                                    padding: '7px 12px',
                                    borderRadius: '999px',
                                    background: 'rgba(255,255,255,0.78)',
                                    border: '1px solid rgba(118, 97, 74, 0.22)',
                                    fontSize: '15px',
                                    color: '#3a2f24',
                                    fontWeight: 700
                                } }, data.roundLabel),
                            React.createElement("div", { style: {
                                    padding: '7px 12px',
                                    borderRadius: '999px',
                                    background: 'rgba(255,255,255,0.78)',
                                    border: '1px solid rgba(118, 97, 74, 0.22)',
                                    color: '#bf5f3f',
                                    fontSize: '15px',
                                    fontWeight: 700
                                } }, data.countdown)))),
                React.createElement("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '16px',
                        padding: '0 12px'
                    } }, data.products.length > 0 ? (data.products.map((item, index) => (React.createElement("div", { key: `${item.name}-${index}`, style: {
                        display: 'grid',
                        gridTemplateColumns: '112px 1fr auto',
                        gap: '16px',
                        alignItems: 'center',
                        minHeight: '128px',
                        padding: '16px 18px',
                        border: '1px solid rgba(118, 97, 74, 0.14)',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.72), rgba(244,236,224,0.88))',
                        boxShadow: '0 10px 26px rgba(58, 39, 21, 0.06)'
                    } },
                    React.createElement("div", { style: {
                            width: '112px',
                            height: '112px',
                            borderRadius: '16px',
                            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.94), rgba(239,228,210,0.92))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        } }, item.image ? (React.createElement("img", { src: item.image, alt: item.name, style: {
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        } })) : null),
                    React.createElement("div", { style: { minWidth: 0 } },
                        React.createElement("div", { style: {
                                color: '#3a2f24',
                                fontSize: '28px',
                                fontWeight: 800,
                                lineHeight: 1.2,
                                wordBreak: 'break-word'
                            } }, item.name),
                        React.createElement("div", { style: { marginTop: '8px', color: '#6b5846', fontSize: '16px' } }, item.type),
                        React.createElement("div", { style: {
                                display: 'inline-flex',
                                marginTop: '12px',
                                padding: '7px 12px',
                                borderRadius: '999px',
                                background: 'rgba(255, 214, 153, 0.4)',
                                color: '#9a5f19',
                                fontSize: '15px',
                                fontWeight: 700
                            } }, item.timeLabel)),
                    React.createElement("div", { style: {
                            alignSelf: 'stretch',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            minWidth: '132px'
                        } },
                        React.createElement("div", { style: {
                                padding: '10px 14px',
                                borderRadius: '14px',
                                background: 'rgba(255,255,255,0.72)',
                                border: '1px solid rgba(179, 123, 45, 0.18)',
                                color: '#8b5e2b',
                                fontSize: '16px',
                                fontWeight: 700
                            } }, item.slotLabel)))))) : (React.createElement("div", { style: {
                        textAlign: 'center',
                        padding: '26px 18px',
                        borderRadius: '20px',
                        border: '1px dashed rgba(120, 102, 81, 0.35)',
                        color: '#5c4a37',
                        fontSize: '22px',
                        background: 'rgba(255,255,255,0.28)'
                    } }, "\u5F53\u524D\u8F6E\u6B21\u6682\u65E0\u5546\u54C1\u3002")))))));
}

export { RocomMerchantCard as default };
