import React from 'react';
import HTML from './HTML.js';

function getStatusStyle(type) {
    switch (type) {
        case 'guard':
            return { background: '#ffe082', color: '#5d4037' };
        case 'ready':
            return { background: '#c8e6c9', color: '#1b5e20' };
        case 'progress':
            return { background: '#bbdefb', color: '#0d47a1' };
        default:
            return { background: '#eceff1', color: '#455a64' };
    }
}
function RocomHomeCard({ data }) {
    return (React.createElement(HTML, { style: { width: '1336px', background: '#f4ecdc' } },
        React.createElement("div", { style: {
                width: '1336px',
                padding: '28px',
                boxSizing: 'border-box',
                background: '#f4ecdc',
                color: '#33271a',
                fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
            } },
            React.createElement("div", { style: {
                    position: 'relative',
                    width: '1280px',
                    minHeight: '860px',
                    overflow: 'hidden',
                    borderRadius: '28px',
                    background: 'radial-gradient(circle at 10% 12%, rgba(255,231,177,0.52), transparent 28%), radial-gradient(circle at 96% 18%, rgba(255,188,85,0.24), transparent 30%), linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)',
                    boxShadow: '0 26px 58px rgba(76, 55, 32, 0.18)'
                } },
                React.createElement("header", { style: {
                        position: 'relative',
                        minHeight: '112px',
                        display: 'grid',
                        placeItems: 'center',
                        overflow: 'hidden',
                        background: 'linear-gradient(90deg, #ffc95f, #f5b64c)'
                    } },
                    React.createElement("div", { style: {
                            position: 'relative',
                            zIndex: 2,
                            color: '#10100e',
                            fontSize: '46px',
                            lineHeight: 1,
                            letterSpacing: '4px',
                            fontWeight: 800,
                            textShadow: '0 3px 0 rgba(255,255,255,0.22)'
                        } }, data.title),
                    React.createElement("div", { style: {
                            position: 'absolute',
                            inset: '-18px 0 auto',
                            zIndex: 1,
                            textAlign: 'center',
                            color: 'rgba(255,228,152,0.24)',
                            fontSize: '120px',
                            lineHeight: 1.1,
                            letterSpacing: '8px',
                            whiteSpace: 'nowrap',
                            fontWeight: 800
                        } }, "ROCOM HOME"),
                    data.updatedAt ? (React.createElement("div", { style: {
                            position: 'absolute',
                            top: '18px',
                            right: '28px',
                            zIndex: 3,
                            padding: '8px 14px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.52)',
                            color: '#79521b',
                            fontSize: '15px',
                            lineHeight: 1,
                            boxShadow: 'inset 0 -2px 0 rgba(141,94,30,0.08)'
                        } },
                        "\u6570\u636E\u66F4\u65B0\u65F6\u95F4\uFF1A",
                        data.updatedAt)) : null),
                React.createElement("section", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '22px',
                        margin: '28px 44px 0',
                        padding: '24px 30px',
                        borderRadius: '24px',
                        background: 'rgba(250,247,238,0.78)',
                        border: '1px solid rgba(143,113,73,0.16)',
                        boxShadow: '0 12px 26px rgba(88,64,38,0.08)'
                    } },
                    React.createElement("div", { style: {
                            flex: 'none',
                            width: '86px',
                            height: '86px',
                            borderRadius: '22px',
                            background: 'linear-gradient(180deg, #ffd87b 0%, #ffc65f 100%)',
                            color: '#5a3a0f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '34px',
                            fontWeight: 800,
                            boxShadow: '0 8px 10px rgba(88,67,38,0.16)'
                        } }, "\u5BB6"),
                    React.createElement("div", { style: { minWidth: 0 } },
                        React.createElement("div", { style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px' } },
                            React.createElement("span", { style: {
                                    maxWidth: '620px',
                                    overflow: 'hidden',
                                    color: '#171411',
                                    fontSize: '38px',
                                    lineHeight: 1.12,
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 800
                                } }, data.homeName),
                            React.createElement("span", { style: {
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    background: '#ffc65f',
                                    color: '#3c2a12',
                                    fontSize: '20px',
                                    lineHeight: 1,
                                    boxShadow: 'inset 0 -2px 0 rgba(141,94,30,0.12)'
                                } },
                                "UID ",
                                data.uid)),
                        React.createElement("div", { style: { marginTop: '8px', color: '#7f6e57', fontSize: '20px' } }, data.subtitle))),
                React.createElement("section", { style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        gap: '16px',
                        margin: '20px 44px 0'
                    } }, (data.summaryCards || []).map(item => (React.createElement("div", { key: item.label, style: {
                        minHeight: '84px',
                        padding: '15px 18px',
                        borderRadius: '999px',
                        border: '1px solid rgba(143,113,73,0.14)',
                        background: 'rgba(250,247,238,0.82)',
                        boxShadow: '0 12px 26px rgba(88,64,38,0.08)'
                    } },
                    React.createElement("div", { style: { color: '#7e6a50', fontSize: '17px' } }, item.label),
                    React.createElement("div", { style: { marginTop: '6px', color: '#33271a', fontSize: '28px', lineHeight: 1.1, whiteSpace: 'nowrap', fontWeight: 800 } }, item.value))))),
                React.createElement("main", { style: {
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.12fr) minmax(400px, 0.88fr)',
                        gap: '22px',
                        alignItems: 'start',
                        margin: '22px 44px 0'
                    } },
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr', gap: '14px', alignItems: 'start' } },
                        React.createElement("section", { style: {
                                borderRadius: '24px',
                                padding: '22px',
                                border: '1px solid rgba(143,113,73,0.14)',
                                background: 'rgba(250,247,238,0.82)',
                                boxShadow: '0 12px 26px rgba(88,64,38,0.08)'
                            } },
                            React.createElement("div", { style: {
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '14px',
                                    marginBottom: '16px'
                                } },
                                React.createElement("div", null,
                                    React.createElement("div", { style: { color: '#907b5e', fontSize: '14px' } }, "Home Garden"),
                                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '3px' } },
                                        React.createElement("h2", { style: { margin: 0, color: '#171411', fontSize: '30px', lineHeight: 1.1 } }, "\u83DC\u56ED\u60C5\u51B5"),
                                        React.createElement("div", { style: {
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                gap: '7px',
                                                minHeight: '34px',
                                                padding: '5px 8px 5px 12px',
                                                borderRadius: '999px',
                                                background: 'rgba(255,255,255,0.62)',
                                                border: '1px solid rgba(143,113,73,0.12)'
                                            } },
                                            React.createElement("span", { style: { color: '#8c7354', fontSize: '15px' } }, "\u5B88\u536B\u7CBE\u7075"),
                                            (data.guardPets || []).length ? ((data.guardPets || []).map(item => (React.createElement(React.Fragment, { key: `${item.id}-${item.name}-guard-inline` },
                                                React.createElement("span", { style: {
                                                        maxWidth: '160px',
                                                        overflow: 'hidden',
                                                        color: '#33271a',
                                                        fontSize: '18px',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    } }, item.name),
                                                React.createElement("span", { style: {
                                                        ...getStatusStyle(item.statusClass),
                                                        padding: '4px 10px',
                                                        borderRadius: '999px',
                                                        fontSize: '12px',
                                                        fontWeight: 700
                                                    } }, item.statusText))))) : (React.createElement("span", { style: { color: '#9a876d', fontSize: '15px' } }, data.guardEmptyText))))),
                                React.createElement("span", { style: {
                                        minWidth: '46px',
                                        padding: '6px 12px',
                                        borderRadius: '999px',
                                        background: '#ffc65f',
                                        color: '#4a2d0b',
                                        textAlign: 'center',
                                        fontSize: '19px',
                                        boxShadow: 'inset 0 -2px 0 rgba(141,94,30,0.14)'
                                    } }, data.gardenCount)),
                            (data.gardenPlots || []).length ? (React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' } }, (data.gardenPlots || []).map(item => (React.createElement("article", { key: `${item.id}-${item.landIndex}`, style: {
                                    minHeight: '138px',
                                    padding: '13px 14px',
                                    borderRadius: '19px',
                                    border: '1px solid rgba(143,113,73,0.12)',
                                    background: 'rgba(255,255,255,0.62)'
                                } },
                                React.createElement("div", { style: {
                                        display: 'inline-flex',
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        background: 'rgba(255,198,95,0.28)',
                                        color: '#9a5f0f',
                                        fontSize: '15px'
                                    } },
                                    "\u7530\u5730 ",
                                    item.landIndex),
                                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' } },
                                    React.createElement("div", { style: {
                                            flex: 'none',
                                            width: '62px',
                                            height: '62px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#8d6e63',
                                            background: 'rgba(220,206,186,0.6)',
                                            borderRadius: '16px',
                                            fontSize: '26px',
                                            fontWeight: 700
                                        } }, "\u7530"),
                                    React.createElement("div", { style: { minWidth: 0, flex: 1 } },
                                        React.createElement("div", { style: { fontSize: '20px', fontWeight: 800, color: '#33271a' } }, item.plantName),
                                        React.createElement("div", { style: {
                                                marginTop: '4px',
                                                fontSize: '15px',
                                                color: item.stateType === 'ready' ? '#2e7d32' : '#b36a19'
                                            } }, item.statusText),
                                        React.createElement("div", { style: { marginTop: '4px', fontSize: '13px', color: '#7f6e57' } }, item.leftTimeText),
                                        React.createElement("div", { style: { marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#8d7a61' } },
                                            item.harvestText ? React.createElement("span", null, item.harvestText) : null,
                                            item.stealText ? React.createElement("span", null, item.stealText) : null))),
                                React.createElement("div", { style: {
                                        marginTop: '10px',
                                        height: '8px',
                                        borderRadius: '999px',
                                        background: 'rgba(143,113,73,0.14)',
                                        overflow: 'hidden'
                                    } },
                                    React.createElement("div", { style: {
                                            width: `${item.progress}%`,
                                            height: '100%',
                                            background: item.stateType === 'ready' ? '#71c36f' : '#ffc65f',
                                            borderRadius: '999px'
                                        } }))))))) : (React.createElement("div", { style: { padding: '24px 18px', textAlign: 'center', color: '#8d6e63' } }, "\u5F53\u524D\u6CA1\u6709\u83DC\u56ED\u4F5C\u7269\u4FE1\u606F")))),
                    React.createElement("section", { style: {
                            borderRadius: '24px',
                            padding: '22px',
                            border: '1px solid rgba(143,113,73,0.14)',
                            background: 'rgba(250,247,238,0.82)',
                            boxShadow: '0 12px 26px rgba(88,64,38,0.08)'
                        } },
                        React.createElement("div", { style: {
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '14px',
                                marginBottom: '16px'
                            } },
                            React.createElement("div", null,
                                React.createElement("div", { style: { color: '#907b5e', fontSize: '14px' } }, "Indoor Pets"),
                                React.createElement("h2", { style: { margin: '3px 0 0', color: '#171411', fontSize: '30px', lineHeight: 1.1 } }, "\u5BA4\u5185\u7CBE\u7075")),
                            React.createElement("span", { style: {
                                    minWidth: '46px',
                                    padding: '6px 12px',
                                    borderRadius: '999px',
                                    background: '#ffc65f',
                                    color: '#4a2d0b',
                                    textAlign: 'center',
                                    fontSize: '19px',
                                    boxShadow: 'inset 0 -2px 0 rgba(141,94,30,0.14)'
                                } }, data.indoorCount)),
                        (data.indoorPets || []).length ? (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, (data.indoorPets || []).map(item => (React.createElement("article", { key: `${item.id}-${item.name}-indoor`, style: {
                                borderRadius: '19px',
                                border: '1px solid rgba(143,113,73,0.12)',
                                background: 'rgba(255,255,255,0.62)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 14px'
                            } },
                            item.iconUrl ? (React.createElement("img", { src: item.iconUrl, alt: '', style: {
                                    flex: 'none',
                                    width: '62px',
                                    height: '62px',
                                    objectFit: 'contain',
                                    borderRadius: '16px',
                                    background: '#ede7dc'
                                } })) : (React.createElement("div", { style: {
                                    flex: 'none',
                                    width: '62px',
                                    height: '62px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#8d6e63',
                                    background: '#ede7dc',
                                    borderRadius: '16px'
                                } }, "\u65E0\u56FE")),
                            React.createElement("div", { style: { flex: 1 } },
                                React.createElement("div", { style: { fontSize: '18px', fontWeight: 800, color: '#33271a' } }, item.name),
                                React.createElement("div", { style: { marginTop: '4px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } },
                                    React.createElement("span", { style: { fontSize: '14px', color: '#5f4d33' } },
                                        "Lv.",
                                        item.level),
                                    React.createElement("span", { style: {
                                            ...getStatusStyle(item.statusClass),
                                            padding: '4px 10px',
                                            borderRadius: '999px',
                                            fontSize: '12px',
                                            fontWeight: 700
                                        } }, item.statusText),
                                    item.badge ? (React.createElement("span", { style: {
                                            padding: '4px 10px',
                                            borderRadius: '999px',
                                            background: 'rgba(255,198,95,0.28)',
                                            color: '#9a5f0f',
                                            fontSize: '12px',
                                            fontWeight: 700
                                        } }, item.badge)) : null),
                                React.createElement("div", { style: { marginTop: '4px', fontSize: '13px', color: '#7f6e57' } }, item.note))))))) : (React.createElement("div", { style: { padding: '18px 8px', color: '#8d6e63' } }, "\u5F53\u524D\u6CA1\u6709\u5BA4\u5185\u7CBE\u7075\u4FE1\u606F"))))))));
}

export { RocomHomeCard as default };
