import React from 'react';
import HTML from './HTML.js';

function RocomHomePetsCard({ data }) {
    return (React.createElement(HTML, { style: { width: '1120px', background: '#f4ecdc' } },
        React.createElement("div", { style: {
                width: '1120px',
                padding: '26px',
                boxSizing: 'border-box',
                background: '#f4ecdc',
                color: '#33271a',
                fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
            } },
            React.createElement("div", { style: {
                    overflow: 'hidden',
                    borderRadius: '28px',
                    background: 'radial-gradient(circle at 10% 12%, rgba(255,231,177,0.52), transparent 28%), linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)',
                    boxShadow: '0 26px 58px rgba(76, 55, 32, 0.18)'
                } },
                React.createElement("header", { style: {
                        position: 'relative',
                        minHeight: '104px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 34px',
                        overflow: 'hidden',
                        background: 'linear-gradient(90deg, #ffc95f, #f5b64c)'
                    } },
                    React.createElement("div", { style: { position: 'relative', zIndex: 2, fontSize: '42px', letterSpacing: '4px', fontWeight: 800, color: '#10100e' } }, data.title),
                    React.createElement("div", { style: { position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px' } },
                        React.createElement("span", { style: { padding: '8px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.52)', color: '#79521b', fontSize: '17px' } },
                            "UID ",
                            data.uid),
                        React.createElement("span", { style: {
                                padding: '8px 16px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.72)',
                                color: '#4a2d0b',
                                fontSize: '17px',
                                fontWeight: 700
                            } },
                            "\u5171 ",
                            data.total,
                            " \u53EA \u00B7 \u53EF\u6536\u86CB ",
                            data.eggCount,
                            " \u53EA"))),
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '18px 34px 0' } },
                    React.createElement("div", { style: { fontSize: '26px', fontWeight: 800 } }, data.homeName),
                    React.createElement("div", { style: { color: '#7f6e57', fontSize: '15px' } },
                        data.subtitle,
                        " \u00B7 \u6570\u636E\u66F4\u65B0\u65F6\u95F4\uFF1A",
                        data.updatedAt)),
                React.createElement("main", { style: { padding: '16px 34px 30px' } }, data.pets.length > 0 ? (React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' } }, data.pets.map((pet, index) => (React.createElement("article", { key: `${pet.id}-${pet.name}-${index}`, style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        borderRadius: '19px',
                        border: '1px solid rgba(143,113,73,0.12)',
                        background: pet.eggReady ? 'rgba(255,248,225,0.9)' : 'rgba(255,255,255,0.62)'
                    } },
                    pet.iconUrl ? (React.createElement("img", { src: pet.iconUrl, alt: '', style: { flex: 'none', width: '72px', height: '72px', objectFit: 'contain', borderRadius: '16px', background: '#ede7dc' } })) : (React.createElement("div", { style: {
                            flex: 'none',
                            width: '72px',
                            height: '72px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#8d6e63',
                            background: '#ede7dc',
                            borderRadius: '16px',
                            fontSize: '20px'
                        } }, "\u65E0\u56FE")),
                    React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                        React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
                            React.createElement("span", { style: { fontSize: '21px', fontWeight: 800, color: '#33271a' } }, pet.name),
                            pet.variantText ? (React.createElement("span", { style: {
                                    padding: '4px 10px',
                                    borderRadius: '999px',
                                    background: 'rgba(206,147,216,0.24)',
                                    color: '#8e44ad',
                                    fontSize: '13px',
                                    fontWeight: 700
                                } }, pet.variantText)) : null,
                            pet.eggReady ? (React.createElement("span", { style: { padding: '4px 10px', borderRadius: '999px', background: '#c8e6c9', color: '#1b5e20', fontSize: '13px', fontWeight: 700 } }, "\uD83E\uDD5A \u53EF\u6536\u86CB")) : null),
                        React.createElement("div", { style: { marginTop: '6px', display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#5f4d33' } },
                            React.createElement("span", null,
                                "Lv.",
                                pet.level),
                            React.createElement("span", null, pet.genderText),
                            React.createElement("span", null,
                                "\u4F53\u91CD ",
                                pet.weightText),
                            React.createElement("span", null,
                                "\u58F0\u97F3 ",
                                pet.voiceText)),
                        pet.eggText ? (React.createElement("div", { style: { marginTop: '6px', fontSize: '14px', color: pet.eggReady ? '#1b5e20' : '#b36a19' } }, pet.eggText)) : null)))))) : (React.createElement("div", { style: { padding: '40px 18px', textAlign: 'center', color: '#8d6e63', fontSize: '18px' } }, data.emptyText)))))));
}

export { RocomHomePetsCard as default };
