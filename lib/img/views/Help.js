import fileUrl from '../../assets/bg/image3.png.js';
import React from 'react';
import HTML from './HTML.js';

const width = 780;
function ALemonJSHelpCard({ data }) {
    return (React.createElement(HTML, { style: { width: `${width + 60}px`, background: '#faf6ed' } },
        React.createElement("div", { style: {
                width: `${width + 60}px`,
                padding: '30px',
                backgroundColor: '#faf6ed',
                display: 'inline-block',
                fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
            } },
            React.createElement("div", { style: {
                    width: `${width}px`,
                    position: 'relative',
                    padding: '40px 50px',
                    boxSizing: 'border-box',
                    background: `linear-gradient(rgba(250, 246, 237, 0.9), rgba(250, 246, 237, 0.94)), url(${fileUrl}) no-repeat center center / cover`,
                    borderRadius: '20px',
                    boxShadow: '0 12px 30px rgba(66, 48, 24, 0.12)'
                } },
                React.createElement("div", { style: {
                        position: 'absolute',
                        right: '26px',
                        bottom: '18px',
                        fontSize: '92px',
                        fontWeight: 900,
                        color: 'rgba(180, 146, 95, 0.1)',
                        letterSpacing: '6px',
                        zIndex: 1,
                        pointerEvents: 'none',
                        userSelect: 'none'
                    } }, "\u6D1B\u514B"),
                React.createElement("div", { style: { position: 'relative', zIndex: 2 } },
                    React.createElement("div", { style: {
                            textAlign: 'center',
                            marginBottom: '30px',
                            borderBottom: '2px dashed rgba(160, 140, 110, 0.4)',
                            paddingBottom: '15px'
                        } },
                        React.createElement("div", { style: {
                                color: '#ffc65f',
                                fontSize: '38px',
                                fontWeight: 800,
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                WebkitTextStroke: '1.5px #d4842b',
                                letterSpacing: '2px'
                            } }, data.title),
                        React.createElement("div", { style: {
                                color: '#9e8e76',
                                fontSize: '16px',
                                marginTop: '6px'
                            } }, data.subtitle)),
                    React.createElement("main", { style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '25px'
                        } }, data.categories.length > 0 ? (data.categories.map((group, index) => (React.createElement("div", { key: `${group.title}-${index}` },
                        React.createElement("div", { style: {
                                fontSize: '22px',
                                fontWeight: 800,
                                color: '#c97926',
                                marginBottom: '15px',
                                paddingLeft: '12px',
                                borderLeft: '5px solid #ffc65f'
                            } }, group.title),
                        React.createElement("div", { style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '15px'
                            } }, group.items.map((item, itemIndex) => (React.createElement("div", { key: `${group.title}-${item.title}-${itemIndex}`, style: {
                                width: '100%',
                                height: '85px',
                                background: 'linear-gradient(180deg, rgba(246, 237, 219, 0.98) 0%, rgba(238, 227, 205, 0.98) 100%)',
                                border: '1px solid rgba(196, 169, 129, 0.45)',
                                borderRadius: '16px',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 25px',
                                paddingRight: '50px',
                                boxSizing: 'border-box'
                            } },
                            React.createElement("div", { style: { minWidth: 0, flex: 1 } },
                                React.createElement("div", { style: {
                                        fontSize: '20px',
                                        fontWeight: 800,
                                        color: '#5a3e1b',
                                        marginBottom: '8px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: 1.1
                                    } }, item.title),
                                React.createElement("div", { style: {
                                        fontSize: '14px',
                                        color: '#8c7a61',
                                        lineHeight: 1.35
                                    } }, item.desc)))))))))) : (React.createElement("div", { style: {
                            minHeight: '180px',
                            borderRadius: '18px',
                            border: '1px dashed rgba(196, 169, 129, 0.65)',
                            background: 'rgba(255,255,255,0.42)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#8c7a61',
                            fontSize: '18px',
                            fontWeight: 700
                        } }, "\u6682\u65E0\u53EF\u5C55\u793A\u7684\u5E2E\u52A9\u9879"))),
                    React.createElement("div", { style: {
                            marginTop: '30px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#bfae95'
                        } }, data.footerBrand || data.footerNote))))));
}

export { ALemonJSHelpCard as default };
