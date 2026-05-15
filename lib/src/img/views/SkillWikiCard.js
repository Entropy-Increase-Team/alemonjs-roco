import React from 'react';
import HTML from './HTML.js';

const width = 920;
function SkillWikiCard({ data }) {
    return (React.createElement(HTML, { style: { width: `${width}px`, background: 'linear-gradient(180deg, #f6f1e5 0%, #ece6d9 100%)' } },
        React.createElement("div", { style: {
                width: '920px',
                margin: '0 auto',
                padding: '22px 18px 28px',
                boxSizing: 'border-box',
                color: '#2a2218'
            } },
            React.createElement("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 260px',
                    gap: '16px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(250,244,233,0.96))',
                    border: '1px solid rgba(113, 96, 78, 0.18)',
                    borderRadius: '28px',
                    padding: '22px 24px',
                    boxShadow: '0 18px 40px rgba(77, 56, 30, 0.08)'
                } },
                React.createElement("div", null,
                    React.createElement("div", { style: { color: '#2f6fda', fontSize: '18px', letterSpacing: '1px', fontWeight: 900 } }, "ROCOM BWIKI STYLE"),
                    React.createElement("h1", { style: {
                            margin: '8px 0 0',
                            fontSize: '48px',
                            lineHeight: 1.05,
                            wordBreak: 'break-word'
                        } }, data.name),
                    React.createElement("div", { style: { display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' } }, [data.attribute, data.category].map(item => (React.createElement("span", { key: item, style: {
                            borderRadius: '999px',
                            padding: '8px 14px',
                            fontSize: '18px',
                            background: 'rgba(42, 34, 24, 0.06)',
                            border: '1px solid rgba(42, 34, 24, 0.08)'
                        } }, item)))),
                    React.createElement("div", { style: {
                            marginTop: '18px',
                            fontSize: '18px',
                            lineHeight: 1.8,
                            color: '#786451',
                            wordBreak: 'break-word'
                        } }, data.description)),
                React.createElement("div", { style: { display: 'grid', gap: '14px', alignContent: 'center' } },
                    React.createElement("div", { style: {
                            borderRadius: '24px',
                            padding: '18px 20px',
                            background: 'rgba(255,255,255,0.8)',
                            border: '1px solid rgba(42, 34, 24, 0.08)',
                            textAlign: 'center'
                        } },
                        React.createElement("div", { style: { fontSize: '18px', color: '#786451' } }, "PP"),
                        React.createElement("div", { style: { marginTop: '8px', fontSize: '52px', color: '#d57f24', fontWeight: 900 } }, data.cost)),
                    React.createElement("div", { style: {
                            borderRadius: '24px',
                            padding: '18px 20px',
                            background: 'linear-gradient(135deg, rgba(213,127,36,0.12), rgba(255,238,214,0.92))',
                            border: '1px solid rgba(42, 34, 24, 0.08)',
                            textAlign: 'center'
                        } },
                        React.createElement("div", { style: { fontSize: '18px', color: '#786451' } }, "\u5A01\u529B"),
                        React.createElement("div", { style: { marginTop: '8px', fontSize: '52px', color: '#d57f24', fontWeight: 900 } }, data.power)))),
            React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '18px' } },
                React.createElement("section", { style: {
                        background: 'rgba(252, 249, 242, 0.95)',
                        border: '1px solid rgba(113, 96, 78, 0.18)',
                        borderRadius: '24px',
                        padding: '18px 20px',
                        boxShadow: '0 12px 30px rgba(77, 56, 30, 0.05)'
                    } },
                    React.createElement("div", { style: { fontSize: '26px', marginBottom: '14px', fontWeight: 900 } }, "\u6280\u80FD\u8BF4\u660E"),
                    React.createElement("div", { style: { fontSize: '18px', lineHeight: 1.9, color: '#4d4032', wordBreak: 'break-word' } }, data.description)),
                React.createElement("section", { style: {
                        background: 'rgba(252, 249, 242, 0.95)',
                        border: '1px solid rgba(113, 96, 78, 0.18)',
                        borderRadius: '24px',
                        padding: '18px 20px',
                        boxShadow: '0 12px 30px rgba(77, 56, 30, 0.05)'
                    } },
                    React.createElement("div", { style: { fontSize: '26px', marginBottom: '14px', fontWeight: 900 } }, "\u57FA\u7840\u4FE1\u606F"),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' } }, [
                        ['属性', data.attribute],
                        ['类别', data.category],
                        ['PP', data.cost],
                        ['威力', data.power]
                    ].map(([label, value]) => (React.createElement("div", { key: label, style: {
                            borderRadius: '18px',
                            padding: '18px',
                            background: 'rgba(255,255,255,0.82)',
                            border: '1px solid rgba(42, 34, 24, 0.06)'
                        } },
                        React.createElement("div", { style: { fontSize: '17px', color: '#786451' } }, label),
                        React.createElement("div", { style: { marginTop: '8px', fontSize: '24px', fontWeight: 700, wordBreak: 'break-word' } }, value))))))),
            React.createElement("div", { style: {
                    marginTop: '18px',
                    padding: '16px 8px 0',
                    borderTop: '1px solid rgba(113, 96, 78, 0.16)',
                    display: 'grid',
                    gap: '6px',
                    color: '#7a6757',
                    fontSize: '15px',
                    wordBreak: 'break-word'
                } },
                React.createElement("div", null, data.commandHint),
                React.createElement("div", null, data.resultHint),
                React.createElement("div", null,
                    "Updated: ",
                    data.updatedAt),
                React.createElement("div", null, data.copyright)))));
}

export { SkillWikiCard as default };
