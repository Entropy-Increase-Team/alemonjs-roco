import React from 'react';
import HTML from './HTML.js';

function WeGameHelpCard({ data }) {
    return (React.createElement(HTML, { style: { background: '#f3f5f8' } },
        React.createElement("div", { style: {
                margin: 0,
                padding: '20px',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                fontFamily: '"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif',
                color: '#111827',
                background: '#f3f5f8',
                boxSizing: 'border-box'
            } },
            React.createElement("main", { style: {
                    width: '100%',
                    maxWidth: '1176px',
                    padding: '24px 24px 20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    background: '#ffffff',
                    boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
                    boxSizing: 'border-box'
                } },
                React.createElement("header", { style: {
                        paddingBottom: '16px',
                        marginBottom: '16px',
                        borderBottom: '1px solid #e5e7eb'
                    } },
                    React.createElement("div", { style: { minWidth: 0 } },
                        React.createElement("span", { style: {
                                display: 'inline-block',
                                marginBottom: '8px',
                                color: '#6b7280',
                                fontSize: '13px',
                                fontWeight: 600
                            } }, "WeGame Plugin"),
                        React.createElement("h1", { style: {
                                margin: '0 0 6px',
                                fontSize: '34px',
                                lineHeight: 1.2,
                                fontWeight: 700,
                                color: '#111827'
                            } }, data.title),
                        React.createElement("p", { style: {
                                margin: 0,
                                fontSize: '18px',
                                lineHeight: 1.5,
                                color: '#4b5563'
                            } }, data.subtitle))),
                data.categories.map((group, index) => (React.createElement("section", { key: `${group.title}-${index}`, style: {
                        marginTop: index === 0 ? 0 : '18px'
                    } },
                    React.createElement("div", { style: {
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: '12px',
                            marginBottom: '10px'
                        } },
                        React.createElement("div", { style: { minWidth: 0 } },
                            React.createElement("h2", { style: {
                                    margin: 0,
                                    fontSize: '24px',
                                    lineHeight: 1.2,
                                    fontWeight: 700,
                                    color: '#111827'
                                } }, group.title)),
                        React.createElement("span", { style: {
                                color: '#6b7280',
                                fontSize: '14px',
                                lineHeight: 1.4,
                                whiteSpace: 'nowrap'
                            } },
                            group.items.length,
                            " \u6761\u547D\u4EE4")),
                    React.createElement("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 340px)',
                            gap: '18px'
                        } }, group.items.map((item, itemIndex) => (React.createElement("article", { key: `${group.title}-${item.title}-${itemIndex}`, style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            minHeight: '84px',
                            padding: '14px',
                            border: '1px solid #d9dee7',
                            borderRadius: '12px',
                            background: '#ffffff',
                            boxSizing: 'border-box'
                        } },
                        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                            React.createElement("div", { style: {
                                    marginBottom: '4px',
                                    color: '#111827',
                                    fontSize: '18px',
                                    lineHeight: 1.3,
                                    fontWeight: 700,
                                    wordBreak: 'break-word'
                                } }, item.title),
                            React.createElement("div", { style: {
                                    color: '#4b5563',
                                    fontSize: '14px',
                                    lineHeight: 1.5,
                                    wordBreak: 'break-word'
                                } }, item.desc))))))))),
                React.createElement("footer", { style: {
                        marginTop: '20px',
                        paddingTop: '14px',
                        borderTop: '1px solid #e5e7eb',
                        textAlign: 'center'
                    } },
                    React.createElement("div", { style: {
                            color: '#6b7280',
                            fontSize: '14px',
                            lineHeight: 1.5
                        } }, data.footerBrand))))));
}

export { WeGameHelpCard as default };
