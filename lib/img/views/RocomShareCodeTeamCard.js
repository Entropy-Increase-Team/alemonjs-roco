import React from 'react';
import HTML from './HTML.js';

function RocomShareCodeTeamCard({ team }) {
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '104px',
                        padding: '0 34px',
                        background: 'linear-gradient(90deg, #ffc95f, #f5b64c)'
                    } },
                    React.createElement("div", null,
                        React.createElement("div", { style: { fontSize: '40px', letterSpacing: '4px', fontWeight: 800, color: '#10100e' } }, team.mode_name),
                        React.createElement("div", { style: { marginTop: '6px', color: '#6b4a13', fontSize: '16px' } },
                            "\u9635\u5BB9\u7801\uFF1A",
                            team.share_code || '--')),
                    React.createElement("span", { style: { padding: '10px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.72)', color: '#4a2d0b', fontSize: '19px', fontWeight: 800 } }, team.count_label)),
                React.createElement("main", { style: { display: 'grid', gap: '14px', padding: '22px 30px 30px' } },
                    team.teams.map(pet => (React.createElement("section", { key: `${pet.slot}-${pet.pet.id}`, style: {
                            display: 'flex',
                            gap: '18px',
                            padding: '18px',
                            borderRadius: '20px',
                            border: `2px solid ${pet.color}`,
                            background: 'rgba(255,255,255,0.66)'
                        } },
                        React.createElement("div", { style: { flex: 'none', textAlign: 'center' } },
                            React.createElement("div", { style: { fontSize: '15px', color: pet.color, fontWeight: 800 } },
                                "No.",
                                pet.slotText),
                            pet.pet.icon ? (React.createElement("img", { src: pet.pet.icon, alt: pet.pet.name, style: { width: '96px', height: '96px', marginTop: '4px', objectFit: 'contain', borderRadius: '18px', background: '#ede7dc' } })) : (React.createElement("div", { style: {
                                    width: '96px',
                                    height: '96px',
                                    marginTop: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '18px',
                                    background: '#ede7dc',
                                    color: '#8d6e63'
                                } }, "\u65E0\u56FE")),
                            React.createElement("div", { style: { marginTop: '6px', maxWidth: '120px', fontSize: '17px', fontWeight: 800, overflowWrap: 'break-word' } }, pet.pet.name)),
                        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                            React.createElement("div", { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' } },
                                pet.typeIcons.map(type => (React.createElement("span", { key: type.name, style: { padding: '4px 12px', borderRadius: '999px', background: '#33271a', color: '#fff', fontSize: '13px', fontWeight: 700 } }, type.name))),
                                React.createElement("span", { style: { padding: '4px 12px', borderRadius: '999px', background: pet.color, color: '#fff', fontSize: '13px', fontWeight: 700 } }, pet.bloodline.name),
                                pet.personality.name ? (React.createElement("span", { style: { padding: '4px 12px', borderRadius: '999px', background: 'rgba(143,113,73,0.14)', color: '#5f4d33', fontSize: '13px' } },
                                    pet.personality.name,
                                    pet.personality.up || pet.personality.down ? `（+${pet.personality.up || '-'} / -${pet.personality.down || '-'}）` : '')) : null,
                                pet.ivs_detail.map(item => (React.createElement("span", { key: item.name, style: {
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        background: 'rgba(255,198,95,0.28)',
                                        color: '#9a5f0f',
                                        fontSize: '12px',
                                        fontWeight: 700
                                    } }, item.name)))),
                            pet.skills.length > 0 ? (React.createElement("div", { style: { marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' } }, pet.skills.map((skill, skillIndex) => (React.createElement(React.Fragment, { key: `${pet.slot}-${skill.name}-${skillIndex}` },
                                React.createElement("span", { style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                        padding: '7px 13px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.78)',
                                        border: '1px solid rgba(143,113,73,0.16)',
                                        fontSize: '14px'
                                    } },
                                    skill.icon ? React.createElement("img", { src: skill.icon, alt: '', style: { width: '24px', height: '24px', objectFit: 'contain' } }) : null,
                                    skill.name)))))) : (React.createElement("div", { style: { marginTop: '12px', color: '#9a876d', fontSize: '14px' } }, "\u672A\u643A\u5E26\u6280\u80FD")))))),
                    team.teams.length === 0 ? (React.createElement("div", { style: { padding: '40px', textAlign: 'center', color: '#8d6e63' } }, "\u9635\u5BB9\u7801\u89E3\u6790\u6210\u529F\uFF0C\u4F46\u6CA1\u6709\u8FD4\u56DE\u9635\u5BB9\u7CBE\u7075\u6570\u636E\u3002")) : null)))));
}

export { RocomShareCodeTeamCard as default };
