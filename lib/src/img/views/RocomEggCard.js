import React from 'react';
import HTML from './HTML.js';

const width = 820;
function RocomEggCard({ data }) {
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
                        } }, "\uD83E\uDD5A \u7CBE\u7075\u67E5\u86CB"),
                    React.createElement("div", { style: { color: '#9e8e76', fontSize: '15px', marginTop: '6px' } }, "\u86CB\u7EC4\u67E5\u8BE2 \u00B7 \u914D\u79CD\u517C\u5BB9\u4E00\u89C8")),
                React.createElement("div", { style: {
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '18px',
                        padding: '22px 28px',
                        marginBottom: '20px',
                        border: '1px solid rgba(201, 121, 38, 0.25)'
                    } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', marginBottom: '16px' } },
                        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 } },
                            React.createElement("div", { style: {
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '18px',
                                    background: 'rgba(255,255,255,0.92)',
                                    border: '1px solid rgba(201, 121, 38, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                } }, data.petIcon ? (React.createElement("img", { src: data.petIcon, alt: data.petName, style: {
                                    width: '64px',
                                    height: '64px',
                                    objectFit: 'contain'
                                } })) : null),
                            React.createElement("div", null,
                                React.createElement("span", { style: { fontSize: '28px', fontWeight: 900, color: '#5a3e1b' } }, data.petName),
                                React.createElement("span", { style: { fontSize: '14px', color: '#8c7a61', marginLeft: '8px' } },
                                    "#",
                                    data.petId))),
                        React.createElement("span", { style: {
                                display: 'inline-block',
                                background: 'linear-gradient(135deg, #fde68a, #fbbf24)',
                                color: '#5a3e1b',
                                fontSize: '13px',
                                fontWeight: 900,
                                padding: '3px 12px',
                                borderRadius: '20px'
                            } }, data.typeLabel)),
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' } }, data.eggGroups.map(item => (React.createElement("span", { key: item, style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: item === '未发现' ? 'linear-gradient(135deg, #fecaca, #fca5a5)' : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                            color: item === '未发现' ? '#991b1b' : '#5a3e1b',
                            fontSize: '14px',
                            fontWeight: 900,
                            padding: '5px 14px',
                            borderRadius: '20px',
                            border: '1px solid rgba(201, 121, 38, 0.3)'
                        } }, item === '未发现' ? '🚫 未发现' : `🥚 ${item}`)))),
                    data.maleRate !== null && data.femaleRate !== null ? (React.createElement("div", { style: { marginBottom: '12px' } },
                        React.createElement("div", { style: { fontSize: '13px', color: '#8c7a61', marginBottom: '6px' } }, "\u6027\u522B\u6BD4\u4F8B"),
                        React.createElement("div", { style: {
                                display: 'flex',
                                height: '10px',
                                borderRadius: '5px',
                                overflow: 'hidden',
                                background: '#e5e7eb'
                            } },
                            React.createElement("div", { style: { width: `${data.maleRate}%`, background: 'linear-gradient(90deg, #60a5fa, #3b82f6)' } }),
                            React.createElement("div", { style: { width: `${data.femaleRate}%`, background: 'linear-gradient(90deg, #f472b6, #ec4899)' } })),
                        React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8c7a61', marginTop: '4px' } },
                            React.createElement("span", null,
                                "\u2642 ",
                                data.maleRate,
                                "%"),
                            React.createElement("span", null,
                                "\u2640 ",
                                data.femaleRate,
                                "%")))) : null,
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' } }, [
                        ['孵化时长', data.hatchLabel],
                        ['体重范围', data.weightLabel],
                        ['身高范围', data.heightLabel],
                        ['总种族值', data.totalStats],
                        ['可配种数', data.totalCompatible],
                        ['蛋组', data.eggGroupsLabel]
                    ].map(([label, value]) => (React.createElement("div", { key: label, style: {
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            border: '1px solid rgba(201, 121, 38, 0.15)'
                        } },
                        React.createElement("div", { style: { fontSize: '12px', color: '#8c7a61', marginBottom: '4px', letterSpacing: '1px' } }, label),
                        React.createElement("div", { style: { fontSize: '16px', fontWeight: 900, color: '#5a3e1b' } }, value)))))),
                data.eggDetails ? (React.createElement("div", { style: {
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '18px',
                        padding: '20px 24px',
                        marginBottom: '20px',
                        border: '1px solid rgba(201, 121, 38, 0.25)'
                    } },
                    React.createElement("div", { style: { fontSize: '22px', fontWeight: 900, color: '#c97926', marginBottom: '14px' } }, "\uD83E\uDD5A \u86CB\u79CD\u8BE6\u7EC6\u6570\u636E"),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' } }, [
                        ['蛋类型', data.eggDetails.preciousEggLabel],
                        ['基础异色概率', data.eggDetails.baseProbText],
                        ['额外异色概率', data.eggDetails.addProbText],
                        ['接触增加异色', data.eggDetails.contactAddText],
                        ['蛋变体数', data.eggDetails.variantCount]
                    ].map(([label, value]) => (React.createElement("div", { key: label, style: {
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            border: '1px solid rgba(201, 121, 38, 0.15)'
                        } },
                        React.createElement("div", { style: { fontSize: '12px', color: '#8c7a61', marginBottom: '4px' } }, label),
                        React.createElement("div", { style: { fontSize: '16px', fontWeight: 900, color: '#5a3e1b' } }, value))))))) : null,
                data.isUndiscovered ? (React.createElement("div", { style: {
                        background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '14px',
                        padding: '18px 22px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    } },
                    React.createElement("div", { style: { fontSize: '20px', fontWeight: 900, color: '#991b1b', marginBottom: '6px' } }, "\u26A0\uFE0F \u672A\u53D1\u73B0\u86CB\u7EC4"),
                    React.createElement("div", { style: { fontSize: '14px', color: '#b91c1c' } }, "\u8BE5\u7CBE\u7075\u5C5E\u4E8E\u300C\u672A\u53D1\u73B0\u300D\u86CB\u7EC4\uFF0C\u4E0D\u80FD\u548C\u4EFB\u4F55\u7CBE\u7075\u751F\u86CB\u3002"))) : null,
                data.sections.map(section => (React.createElement("div", { key: section.id, style: { marginBottom: '22px' } },
                    React.createElement("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px',
                            paddingBottom: '8px',
                            borderBottom: '2px solid rgba(201, 121, 38, 0.2)'
                        } },
                        React.createElement("div", { style: {
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fde68a, #f59e0b)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                color: '#fff',
                                fontWeight: 900,
                                flexShrink: 0
                            } }, section.id),
                        React.createElement("div", { style: { fontSize: '20px', fontWeight: 900, color: '#c97926' } }, section.label),
                        React.createElement("div", { style: { fontSize: '13px', color: '#8c7a61', marginLeft: 'auto' } },
                            section.count,
                            " \u53EA\u53EF\u914D\u79CD")),
                    section.members.length === 0 ? (React.createElement("div", { style: { fontSize: '13px', color: '#8c7a61', textAlign: 'center', padding: '12px' } }, "\u6682\u65E0\u540C\u86CB\u7EC4\u53EF\u914D\u79CD\u7CBE\u7075")) : (React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' } },
                        section.members.map(item => (React.createElement("div", { key: `${section.id}-${item.name}`, style: {
                                background: 'rgba(255, 255, 255, 0.65)',
                                borderRadius: '10px',
                                padding: '10px 14px'
                            } },
                            React.createElement("div", { style: { fontSize: '15px', fontWeight: 900, color: '#5a3e1b' } }, item.name),
                            React.createElement("div", { style: { fontSize: '12px', color: '#8c7a61', marginTop: '4px' } }, item.meta)))),
                        section.hasMore ? (React.createElement("div", { style: {
                                background: 'rgba(255, 255, 255, 0.35)',
                                borderRadius: '10px',
                                padding: '10px 14px',
                                fontSize: '13px',
                                color: '#8c7a61',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            } },
                            "... \u8FD8\u6709 ",
                            section.remainCount,
                            " \u53EA\u7CBE\u7075\u672A\u663E\u793A")) : null))))),
                React.createElement("div", { style: { fontSize: '15px', textAlign: 'center', color: '#9e8e76', marginTop: '10px' } }, data.commandHint),
                React.createElement("div", { style: { fontSize: '14px', textAlign: 'center', color: '#b09d84', marginTop: '6px' } }, data.copyright)))));
}

export { RocomEggCard as default };
