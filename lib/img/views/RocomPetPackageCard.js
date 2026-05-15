import React from 'react';
import HTML from './HTML.js';

const tabs = ['全部', '了不起', '异色', '炫彩'];
const width = 1320;
const columns = 5;
function getTypeTokens(types) {
    return String(types || '')
        .split(/[、/\s]+/u)
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, 2);
}
function RocomPetPackageCard({ data }) {
    const { currentTab, userName, userLevel, userUid, totalCount, currentPage, totalPages, accountLabel, pets, pageSize } = data;
    const emptySlots = Math.max(pageSize - pets.length, 0);
    return (React.createElement(HTML, { style: { width: `${width}px`, background: '#1b1d18' } },
        React.createElement("div", { style: {
                width: `${width}px`,
                padding: '30px',
                boxSizing: 'border-box',
                background: 'radial-gradient(circle at top left, rgba(255,206,109,0.22), transparent 28%), radial-gradient(circle at top right, rgba(122,181,202,0.18), transparent 24%), linear-gradient(180deg, #272b24 0%, #171914 100%)'
            } },
            React.createElement("div", { style: {
                    minWidth: '900px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '20px',
                    padding: '16px 20px 16px',
                    boxSizing: 'border-box'
                } },
                React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
                    React.createElement("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: '8px',
                            borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
                        } },
                        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 } },
                            React.createElement("div", { style: {
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '18px',
                                    background: 'linear-gradient(180deg, #ffd87b 0%, #ffc65f 100%)',
                                    color: '#272624',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    fontWeight: 800
                                } }, "\u6D1B"),
                            React.createElement("div", { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' } },
                                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                                    React.createElement("span", { style: { color: '#f4eee1', fontSize: '22px', fontWeight: 800 } }, userName),
                                    React.createElement("span", { style: {
                                            backgroundColor: '#ffc966',
                                            color: '#272624',
                                            fontSize: '14px',
                                            fontWeight: 800,
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            lineHeight: 1.2
                                        } },
                                        "Lv. ",
                                        userLevel)),
                                React.createElement("span", { style: { color: '#a8a69f', fontSize: '14px' } },
                                    "ID:",
                                    userUid || '未返回'))),
                        React.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } },
                            React.createElement("div", { style: {
                                    color: '#f4eee1',
                                    fontSize: '24px',
                                    fontWeight: 800,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                    lineHeight: 1
                                } }, "\u6211\u7684\u7CBE\u7075"),
                            React.createElement("ul", { style: { display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '15px' } }, tabs.map(item => (React.createElement("li", { key: item, style: {
                                    color: item === currentTab ? '#f4eee1' : '#a8a69f',
                                    fontSize: '16px',
                                    padding: '2px 0',
                                    borderBottom: item === currentTab ? '2px solid #ffc65f' : '2px solid transparent',
                                    fontWeight: 700
                                } }, item))))),
                        React.createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', flex: 1 } },
                            React.createElement("span", { style: { color: '#f1b958', fontSize: '16px', fontWeight: 800 } },
                                "\u5F53\u524D\u67E5\u770B\uFF1A",
                                currentTab),
                            React.createElement("span", { style: { color: '#f4eee1', fontSize: '14px' } },
                                "\u603B\u8BA1\u6301\u6709\uFF1A",
                                totalCount),
                            React.createElement("span", { style: { color: '#f4eee1', fontSize: '14px' } },
                                "\u5F53\u524D\u8D26\u53F7\uFF1A",
                                accountLabel))),
                    React.createElement("main", { style: { marginTop: '5px' } },
                        React.createElement("div", { style: {
                                display: 'grid',
                                gridTemplateColumns: `repeat(${columns}, 1.9rem)`,
                                gridTemplateRows: 'repeat(2, 2.6rem)',
                                gap: '0.2rem 0.25rem',
                                justifyContent: 'center'
                            } }, pets.length > 0 ? (React.createElement(React.Fragment, null,
                            pets.map((pet, index) => (React.createElement("div", { key: `${pet.name}-${index}`, style: {
                                    width: '1.9rem',
                                    height: '2.6rem',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
                                    borderRadius: '0.28rem',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    overflow: 'hidden'
                                } },
                                React.createElement("div", { style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        padding: '0.15rem 0.2rem 0',
                                        zIndex: 2
                                    } },
                                    React.createElement("div", { style: { display: 'flex', gap: '0.05rem' } }, getTypeTokens(pet.types).length > 0 ? (getTypeTokens(pet.types).map((token, tokenIndex) => (React.createElement("div", { key: `${pet.name}-${token}-${tokenIndex}`, style: {
                                            width: '0.28rem',
                                            height: '0.28rem',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.14)',
                                            color: '#f4eee1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.12rem',
                                            fontWeight: 700
                                        } }, token.slice(0, 1))))) : (React.createElement("div", { style: {
                                            width: '0.28rem',
                                            height: '0.28rem',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.14)',
                                            color: '#f4eee1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.14rem'
                                        } }, "?"))),
                                    React.createElement("div", { style: { fontSize: '0.22rem', color: '#555350', fontWeight: 800 } },
                                        "LV.",
                                        pet.level)),
                                React.createElement("div", { style: {
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        paddingTop: '0.1rem'
                                    } },
                                    React.createElement("div", { style: { width: '1.7rem', height: '1.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, pet.imageUrl ? (React.createElement("img", { src: pet.imageUrl, alt: pet.name, style: {
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 0.06rem 0.12rem rgba(0, 0, 0, 0.18))'
                                        } })) : (React.createElement("div", { style: { color: '#7d7568', fontSize: '0.2rem', fontWeight: 800 } }, "\u7A7A\u4F4D")))),
                                React.createElement("div", { style: {
                                        width: '100%',
                                        height: '0.45rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        bottom: '0.06rem',
                                        left: 0,
                                        right: 0
                                    } },
                                    React.createElement("span", { style: {
                                            color: '#272624',
                                            fontSize: '0.22rem',
                                            fontWeight: 800,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            padding: '0 0.06rem'
                                        } }, pet.name))))),
                            Array.from({ length: emptySlots }).map((_, index) => (React.createElement("div", { key: `empty-${index}`, style: {
                                    width: '1.9rem',
                                    height: '2.6rem',
                                    borderRadius: '0.28rem',
                                    border: '1px dashed rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    opacity: 0.42
                                } },
                                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.15rem 0.2rem 0' } },
                                    React.createElement("div", null),
                                    React.createElement("div", { style: { fontSize: '0.22rem', color: '#555350', fontWeight: 800 } }, "--")),
                                React.createElement("div", { style: {
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#7d7568',
                                        fontSize: '0.2rem',
                                        fontWeight: 800
                                    } }, "\u7A7A\u4F4D"),
                                React.createElement("div", { style: {
                                        width: '100%',
                                        height: '0.45rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        bottom: '0.06rem',
                                        left: 0,
                                        right: 0,
                                        color: '#272624',
                                        fontSize: '0.22rem',
                                        fontWeight: 800
                                    } }, "\u5F85\u8865\u4F4D")))))) : (React.createElement("div", { style: {
                                minHeight: '5.4rem',
                                gridColumn: '1 / -1',
                                borderRadius: '0.24rem',
                                border: '1px dashed rgba(255, 255, 255, 0.18)',
                                background: 'rgba(0, 0, 0, 0.14)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.12rem'
                            } },
                            React.createElement("div", { style: { color: '#f4eee1', fontSize: '0.24rem', fontWeight: 800 } }, "\u8FD9\u4E00\u9875\u6682\u65F6\u6CA1\u6709\u7CBE\u7075"),
                            React.createElement("div", { style: { color: '#b9b1a2', fontSize: '0.15rem' } }, "\u8BD5\u8BD5\u5207\u6362\u5206\u7C7B\u6216\u9875\u7801\u91CD\u65B0\u67E5\u8BE2"))))),
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            paddingTop: '14px',
                            fontSize: '14px',
                            color: 'rgba(244,239,226,0.66)'
                        } },
                        React.createElement("span", null,
                            "\u7B2C ",
                            currentPage,
                            " \u9875\uFF0C\u5171 ",
                            totalPages,
                            " \u9875\uFF0C\u6BCF\u9875 ",
                            pageSize,
                            " \u53EA\u7CBE\u7075"),
                        React.createElement("span", null, "\u7FFB\u9875\uFF1A+\u7CBE\u7075\u5217\u8868 <\u4E86\u4E0D\u8D77|\u5F02\u8272|\u70AB\u5F69> <\u9875\u7801>")))))));
}

export { RocomPetPackageCard as default };
