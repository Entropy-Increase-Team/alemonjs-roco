import fileUrl from '../../../plugins/WeGame-plugin/modules/rocom/resources/img/ercode-bg.D1ccSQKH.png.js';
import fileUrl$2 from '../../../plugins/WeGame-plugin/modules/rocom/resources/img/player-bg.png.js';
import fileUrl$1 from '../../../plugins/WeGame-plugin/modules/rocom/resources/img/小洛克.png.js';
import React from 'react';
import HTML from './HTML.js';

const width = 780;
function YunzaiHelpCard({ data }) {
    return (React.createElement(HTML, { style: { background: '#faf6ed' } },
        React.createElement("div", { style: {
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
                    background: `url(${fileUrl}) no-repeat center center / 100% 100%`
                } },
                React.createElement("img", { src: fileUrl$1, alt: '', style: {
                        position: 'absolute',
                        bottom: '-15px',
                        right: '-30px',
                        width: '320px',
                        opacity: 0.15,
                        zIndex: 1,
                        pointerEvents: 'none'
                    } }),
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
                        } }, data.categories.map((group, index) => (React.createElement("div", { key: `${group.title}-${index}` },
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
                                background: `url(${fileUrl$2}) no-repeat center center / 100% 100%`,
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
                                    } }, item.desc)))))))))),
                    React.createElement("div", { style: {
                            marginTop: '30px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#bfae95'
                        } }, data.footerBrand || data.footerNote))))));
}

export { YunzaiHelpCard as default };
