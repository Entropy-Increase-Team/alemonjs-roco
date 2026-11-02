import React from 'react';
import HTML from './HTML.js';

const THEME_COLORS = {
    gold: { base: '#d99a35', soft: 'rgba(217,154,53,0.22)' },
    green: { base: '#5ea25e', soft: 'rgba(94,162,94,0.2)' },
    brown: { base: '#a0764f', soft: 'rgba(160,118,79,0.2)' }
};
const STATUS_COLORS = {
    active: { background: '#c8e6c9', color: '#1b5e20' },
    upcoming: { background: '#bbdefb', color: '#0d47a1' },
    ended: { background: '#eceff1', color: '#607d8b' },
    permanent: { background: '#ffe082', color: '#795548' }
};
function RocomActivityCalendarCard({ data }) {
    return (React.createElement(HTML, { style: { width: '1280px', background: '#f4ecdc' } },
        React.createElement("div", { style: {
                width: '1280px',
                padding: '26px',
                boxSizing: 'border-box',
                background: '#f4ecdc',
                color: '#33271a',
                fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif'
            } },
            React.createElement("div", { style: {
                    borderRadius: '28px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, #f7ecd5 0%, #efddbc 100%)',
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
                        React.createElement("div", { style: { fontSize: '42px', letterSpacing: '4px', fontWeight: 800, color: '#10100e' } }, data.title),
                        React.createElement("div", { style: { marginTop: '6px', color: '#6b4a13', fontSize: '16px' } }, data.subtitle)),
                    React.createElement("span", { style: { padding: '10px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.72)', color: '#4a2d0b', fontSize: '19px', fontWeight: 800 } },
                        "\u5171 ",
                        data.activity_count,
                        " \u4E2A\u6D3B\u52A8")),
                React.createElement("main", { style: { display: 'grid', gap: '18px', padding: '22px 30px 30px' } },
                    data.empty ? (React.createElement("div", { style: {
                            padding: '44px',
                            textAlign: 'center',
                            borderRadius: '20px',
                            border: '1px dashed rgba(120, 102, 81, 0.35)',
                            color: '#8d6e63',
                            fontSize: '18px'
                        } }, "\u6682\u65E0\u8FDB\u884C\u4E2D\u7684\u6D3B\u52A8\u3002")) : (React.createElement(React.Fragment, null,
                        data.lanes.map((lane, laneIndex) => (React.createElement("section", { key: `lane-${laneIndex}`, style: {
                                position: 'relative',
                                minHeight: '72px',
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.42)',
                                border: '1px solid rgba(143,113,73,0.1)'
                            } },
                            data.axis_dates.map(axis => (React.createElement("div", { key: axis.label, style: { position: 'absolute', top: 0, bottom: 0, left: `${axis.left_pct}%`, borderLeft: '1px dashed rgba(143,113,73,0.2)' } }))),
                            data.now_line ? (React.createElement("div", { style: { position: 'absolute', top: 0, bottom: 0, left: `${data.now_line.left_pct}%`, borderLeft: '2px solid #d05a2c', zIndex: 2 } },
                                React.createElement("span", { style: {
                                        position: 'absolute',
                                        top: '-9px',
                                        left: '-20px',
                                        padding: '1px 6px',
                                        borderRadius: '999px',
                                        background: '#d05a2c',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 800
                                    } }, data.now_line.label))) : null,
                            lane.map(item => {
                                const theme = THEME_COLORS[item.theme] ?? THEME_COLORS.gold;
                                return (React.createElement("div", { key: `${item.id}-${item.name}-${laneIndex}`, style: {
                                        position: 'absolute',
                                        left: `${item.left_pct}%`,
                                        width: `${item.width_pct}%`,
                                        top: '10px',
                                        minHeight: '52px',
                                        padding: '7px 12px',
                                        borderRadius: '12px',
                                        background: theme.soft,
                                        borderLeft: `5px solid ${theme.base}`,
                                        overflow: 'hidden'
                                    } },
                                    React.createElement("div", { style: { fontSize: '15px', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' } }, item.name),
                                    React.createElement("div", { style: { marginTop: '2px', fontSize: '12px', color: '#7f6e57', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' } }, item.time_label)));
                            })))),
                        React.createElement("div", { style: { display: 'grid', gap: '10px' } }, data.activities.map((activity, index) => {
                            const status = STATUS_COLORS[activity.statusClass] ?? STATUS_COLORS.active;
                            const theme = THEME_COLORS[activity.theme] ?? THEME_COLORS.gold;
                            return (React.createElement("article", { key: `${activity.id}-${activity.name}-${index}`, style: {
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '14px',
                                    padding: '13px 16px',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.66)',
                                    borderLeft: `5px solid ${theme.base}`
                                } },
                                React.createElement("span", { style: { flex: 'none', minWidth: '28px', textAlign: 'center', color: '#a89a83', fontSize: '16px', fontWeight: 800 } }, index + 1),
                                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
                                        React.createElement("span", { style: { fontSize: '18px', fontWeight: 800 } }, activity.name),
                                        React.createElement("span", { style: { padding: '3px 10px', borderRadius: '999px', ...status, fontSize: '12px', fontWeight: 700 } }, activity.statusText)),
                                    React.createElement("div", { style: { marginTop: '4px', fontSize: '13px', color: '#7f6e57' } },
                                        activity.time_label,
                                        activity.rewards_text !== '暂无奖励信息' ? ` · 奖励：${activity.rewards_text}` : ''),
                                    activity.description ? React.createElement("div", { style: { marginTop: '4px', fontSize: '13px', color: '#9a876d' } }, activity.description) : null)));
                        })))),
                    React.createElement("div", { style: { textAlign: 'right', color: '#9a876d', fontSize: '13px' } },
                        data.commandHint,
                        " \u00B7 ",
                        data.copyright))))));
}

export { RocomActivityCalendarCard as default };
