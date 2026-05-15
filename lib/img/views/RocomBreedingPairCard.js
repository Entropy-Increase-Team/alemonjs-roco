import React from 'react';
import HTML from './HTML.js';

const width = 820;
function RocomBreedingPairCard({ data }) {
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
                        } }, "\uD83E\uDD5A \u914D\u79CD\u5224\u5B9A"),
                    React.createElement("div", { style: { color: '#9e8e76', fontSize: '15px', marginTop: '6px' } }, "\u7CBE\u7075\u914D\u79CD\u517C\u5BB9\u6027\u68C0\u67E5")),
                React.createElement("div", { style: {
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '18px',
                        padding: '22px 28px',
                        marginBottom: '20px',
                        border: '1px solid rgba(201, 121, 38, 0.25)'
                    } },
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 70px 1fr', gap: '12px', alignItems: 'stretch' } },
                        React.createElement("div", { style: {
                                background: 'rgba(255,255,255,0.72)',
                                borderRadius: '16px',
                                padding: '18px 20px',
                                textAlign: 'center',
                                border: '1px solid rgba(201, 121, 38, 0.18)'
                            } },
                            React.createElement("div", { style: { color: '#8c7a61', fontSize: '14px', fontWeight: 700 } }, "\u6BCD\u4F53 (\u540E\u8005)"),
                            React.createElement("div", { style: { marginTop: '8px', color: '#5a3e1b', fontSize: '28px', fontWeight: 900 } }, data.mother.name),
                            React.createElement("div", { style: { marginTop: '8px', color: '#6b5846', fontSize: '16px' } }, data.mother.typeLabel),
                            React.createElement("div", { style: { fontSize: '12px', color: '#8c7a61', marginTop: '4px' } }, data.mother.eggGroupsLabel)),
                        React.createElement("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '38px'
                            } }, "\u26A1"),
                        React.createElement("div", { style: {
                                background: 'rgba(255,255,255,0.72)',
                                borderRadius: '16px',
                                padding: '18px 20px',
                                textAlign: 'center',
                                border: '1px solid rgba(201, 121, 38, 0.18)'
                            } },
                            React.createElement("div", { style: { color: '#8c7a61', fontSize: '14px', fontWeight: 700 } }, "\u7236\u4F53 (\u524D\u8005)"),
                            React.createElement("div", { style: { marginTop: '8px', color: '#5a3e1b', fontSize: '28px', fontWeight: 900 } }, data.father.name),
                            React.createElement("div", { style: { marginTop: '8px', color: '#6b5846', fontSize: '16px' } }, data.father.typeLabel),
                            React.createElement("div", { style: { fontSize: '12px', color: '#8c7a61', marginTop: '4px' } }, data.father.eggGroupsLabel))),
                    data.compatible ? (React.createElement("div", { style: {
                            marginTop: '18px',
                            borderRadius: '16px',
                            padding: '18px 20px',
                            background: 'linear-gradient(135deg, rgba(220,252,231,0.95), rgba(187,247,208,0.92))',
                            border: '1px solid rgba(34,197,94,0.25)',
                            textAlign: 'center'
                        } },
                        React.createElement("div", { style: { fontSize: '28px', fontWeight: 900, color: '#166534' } }, "\u2705 \u53EF\u4EE5\u914D\u79CD"),
                        React.createElement("div", { style: { marginTop: '6px', fontSize: '15px', color: '#166534' } }, "\u5171\u4EAB\u86CB\u7EC4\u5339\u914D\uFF0C\u53EF\u4EE5\u4EA7\u51FA\u7CBE\u7075\u86CB"),
                        React.createElement("div", { style: { display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' } }, data.sharedEggGroupLabels.map(item => (React.createElement("span", { key: item, style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.78)',
                                color: '#166534',
                                fontSize: '14px',
                                fontWeight: 900
                            } }, item)))))) : (React.createElement("div", { style: {
                            marginTop: '18px',
                            borderRadius: '16px',
                            padding: '18px 20px',
                            background: 'linear-gradient(135deg, rgba(254,226,226,0.95), rgba(254,202,202,0.92))',
                            border: '1px solid rgba(239,68,68,0.25)',
                            textAlign: 'center'
                        } },
                        React.createElement("div", { style: { fontSize: '28px', fontWeight: 900, color: '#991b1b' } }, "\u274C \u65E0\u6CD5\u914D\u79CD"),
                        data.reasons.map(reason => (React.createElement("div", { key: reason, style: { marginTop: '6px', fontSize: '15px', color: '#b91c1c' } }, reason))))),
                    data.compatible ? (React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' } }, [
                        ['孵化时长', data.hatchLabel],
                        ['体重范围', data.weightLabel],
                        ['身高范围', data.heightLabel]
                    ].map(([label, value]) => (React.createElement("div", { key: label, style: {
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            border: '1px solid rgba(201, 121, 38, 0.15)'
                        } },
                        React.createElement("div", { style: { fontSize: '12px', color: '#8c7a61', marginBottom: '4px', letterSpacing: '1px' } }, label),
                        React.createElement("div", { style: { fontSize: '16px', fontWeight: 900, color: '#5a3e1b' } }, value)))))) : null),
                React.createElement("div", { style: { fontSize: '15px', textAlign: 'center', color: '#9e8e76', marginTop: '10px' } }, data.commandHint),
                React.createElement("div", { style: { fontSize: '14px', textAlign: 'center', color: '#b09d84', marginTop: '6px' } }, data.copyright)))));
}

export { RocomBreedingPairCard as default };
