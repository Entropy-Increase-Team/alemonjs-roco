import React from 'react';
import HTML from './HTML.js';

const width = 820;
function RocomBreedingWantCard({ data }) {
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
                        } }, "\u76EE\u6807\u914D\u79CD\u65B9\u6848"),
                    React.createElement("div", { style: { color: '#9e8e76', fontSize: '15px', marginTop: '6px' } },
                        "\u60F3\u8981\u5B75\u51FA\u300C",
                        data.target.name,
                        "\u300D\u65F6\uFF0C\u6BCD\u4F53\u5E94\u56FA\u5B9A\u4E3A\u76EE\u6807\u7CBE\u7075")),
                React.createElement("div", { style: {
                        background: 'rgba(255,255,255,0.94)',
                        borderRadius: '20px',
                        padding: '22px',
                        boxShadow: '0 10px 24px rgba(40, 31, 23, 0.08)',
                        marginTop: '18px'
                    } },
                    React.createElement("div", { style: { fontSize: '30px', fontWeight: 800, color: '#4d3624' } },
                        data.target.name,
                        " #",
                        data.target.id),
                    React.createElement("div", { style: { marginTop: '10px', color: '#75563d', fontSize: '19px', lineHeight: 1.8 } },
                        "\u5C5E\u6027\uFF1A",
                        data.target.typeLabel,
                        React.createElement("br", null),
                        "\u86CB\u7EC4\uFF1A",
                        data.eggGroupsLabel,
                        React.createElement("br", null),
                        "\u6027\u522B\u6BD4\uFF1A\u96C4\u6027 ",
                        data.maleRateLabel,
                        "% \uFF5C \u96CC\u6027 ",
                        data.femaleRateLabel,
                        "%"),
                    data.isUndiscovered ? (React.createElement("div", { style: {
                            marginTop: '16px',
                            padding: '16px 18px',
                            borderRadius: '14px',
                            background: 'rgba(240, 98, 82, 0.12)',
                            color: '#8a3d2e',
                            fontSize: '18px'
                        } }, "\u8BE5\u7CBE\u7075\u5C5E\u4E8E\u672A\u53D1\u73B0\u86CB\u7EC4\uFF0C\u65E0\u6CD5\u901A\u8FC7\u5E38\u89C4\u914D\u79CD\u83B7\u5F97\u3002")) : data.fathers.length === 0 ? (React.createElement("div", { style: {
                            marginTop: '16px',
                            padding: '16px 18px',
                            borderRadius: '14px',
                            background: 'rgba(240, 98, 82, 0.12)',
                            color: '#8a3d2e',
                            fontSize: '18px'
                        } }, "\u6CA1\u6709\u627E\u5230\u53EF\u4E0E\u8BE5\u76EE\u6807\u7CBE\u7075\u5171\u4EAB\u86CB\u7EC4\u7684\u7236\u4F53\u5019\u9009\u3002")) : (React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', marginTop: '18px' } }, data.fathers.map((item, index) => (React.createElement("div", { key: `${item.id}-${index}`, style: {
                            background: 'rgba(244, 236, 224, 0.95)',
                            borderRadius: '18px',
                            padding: '16px 18px',
                            border: '1px solid rgba(201, 121, 38, 0.12)'
                        } },
                        React.createElement("div", { style: { fontSize: '24px', fontWeight: 700, color: '#4b3524' } },
                            item.name,
                            " #",
                            item.id),
                        React.createElement("div", { style: { marginTop: '8px', color: '#735640', fontSize: '17px', lineHeight: 1.7 } },
                            "\u5C5E\u6027\uFF1A",
                            item.typeLabel,
                            React.createElement("br", null),
                            "\u86CB\u7EC4\uFF1A",
                            item.eggGroupsLabel,
                            React.createElement("br", null),
                            "\u8EAB\u9AD8\uFF1A",
                            item.heightLabel,
                            " \uFF5C \u4F53\u91CD\uFF1A",
                            item.weightLabel))))))),
                React.createElement("div", { style: {
                        marginTop: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '18px',
                        color: '#9e8e76',
                        fontSize: '15px'
                    } },
                    React.createElement("span", null, data.commandHint),
                    React.createElement("span", null, data.copyright))))));
}

export { RocomBreedingWantCard as default };
