import React from 'react';
import HTML from './HTML.js';

const width = 1220;
function renderPetChip(pet, index, mode) {
    const size = mode === 'detail' ? 112 : 86;
    return (React.createElement("div", { key: `${pet.name}-${index}`, style: {
            width: `${size}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
        } },
        React.createElement("div", { style: {
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: mode === 'detail' ? '28px' : '22px',
                background: 'radial-gradient(circle at top, rgba(255,255,255,0.26), transparent 34%), linear-gradient(180deg, rgba(255,213,125,0.72), rgba(180,106,47,0.38))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 12px 24px rgba(0,0,0,0.22)'
            } }, pet.imageUrl ? (React.createElement("img", { src: pet.imageUrl, alt: pet.name, style: {
                maxWidth: '92%',
                maxHeight: '92%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.22))'
            } })) : (React.createElement("div", { style: { fontSize: mode === 'detail' ? '30px' : '24px', fontWeight: 900, color: 'rgba(0,0,0,0.2)' } }, pet.name.slice(0, 1)))),
        React.createElement("div", { style: {
                maxWidth: `${size + 10}px`,
                fontSize: mode === 'detail' ? '16px' : '14px',
                fontWeight: 800,
                lineHeight: 1.2,
                textAlign: 'center',
                color: '#f6f1e3'
            } }, pet.name)));
}
function RocomLineupCard({ data }) {
    const title = data.mode === 'detail' ? '阵容详情' : '阵容助手';
    return (React.createElement(HTML, { style: { width: `${width}px`, background: 'linear-gradient(180deg, #181919 0%, #101111 100%)' } },
        React.createElement("div", { style: {
                width: `${width}px`,
                boxSizing: 'border-box',
                padding: '28px',
                background: 'radial-gradient(circle at top left, rgba(255,173,84,0.18), transparent 22%), radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 20%), linear-gradient(180deg, #2b211b 0%, #161311 100%)',
                color: '#f5efdf'
            } },
            React.createElement("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    paddingBottom: '18px'
                } },
                React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: '36px', fontWeight: 900, letterSpacing: '2px' } }, title),
                    React.createElement("div", { style: { marginTop: '8px', fontSize: '16px', color: '#d6c2a4' } }, data.category || (data.mode === 'detail' ? '阵容单卡' : '热门推荐'))),
                React.createElement("div", { style: { textAlign: 'right', fontSize: '15px', color: 'rgba(245,239,223,0.74)' } },
                    React.createElement("div", null,
                        "\u7B2C ",
                        data.pageNo,
                        " / ",
                        data.totalPages,
                        " \u9875"),
                    React.createElement("div", { style: { marginTop: '6px' } }, data.mode === 'detail' ? '查看阵容 <阵容码>' : '阵容 <分类> <页码>'))),
            React.createElement("div", { style: { marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '20px' } }, data.lineups.map((lineup, index) => (React.createElement("div", { key: `${lineup.id}-${index}`, style: {
                    borderRadius: '28px',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: data.mode === 'detail' ? '22px' : '20px',
                    boxShadow: '0 18px 36px rgba(0,0,0,0.22)'
                } },
                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' } },
                    React.createElement("div", { style: { flex: 1 } },
                        React.createElement("div", { style: { fontSize: data.mode === 'detail' ? '30px' : '26px', fontWeight: 900, lineHeight: 1.1 } }, lineup.name),
                        React.createElement("div", { style: { marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' } }, lineup.tags.length > 0 ? (lineup.tags.map(tag => (React.createElement("span", { key: tag, style: {
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                background: 'rgba(255,190,103,0.16)',
                                color: '#ffc867',
                                fontSize: '13px',
                                fontWeight: 800
                            } }, tag)))) : (React.createElement("span", { style: {
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(245,239,223,0.7)',
                                fontSize: '13px',
                                fontWeight: 700
                            } }, "\u65E0\u6807\u7B7E")))),
                    React.createElement("div", { style: {
                            minWidth: '150px',
                            textAlign: 'right',
                            fontSize: '14px',
                            color: 'rgba(245,239,223,0.76)'
                        } },
                        React.createElement("div", null,
                            "\u4F5C\u8005\uFF1A",
                            lineup.authorName),
                        React.createElement("div", { style: { marginTop: '8px' } },
                            "\u70B9\u8D5E\uFF1A",
                            lineup.likes),
                        React.createElement("div", { style: { marginTop: '8px', color: '#ffc867', fontWeight: 900 } },
                            "\u9635\u5BB9\u7801\uFF1A",
                            lineup.id))),
                React.createElement("div", { style: {
                        marginTop: '18px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: data.mode === 'detail' ? '16px' : '14px',
                        justifyContent: data.mode === 'detail' ? 'flex-start' : 'space-between'
                    } }, lineup.pets.map((pet, petIndex) => renderPetChip(pet, petIndex, data.mode))))))))));
}

export { RocomLineupCard as default };
