import React from 'react';
import HTML from './HTML.js';

const pageWidth = 1280;
function renderPetLine(list) {
    return (React.createElement("div", { style: { display: 'flex', gap: '4px', alignItems: 'center' } }, list.map((pet, index) => (React.createElement("div", { key: `${pet.name}-${index}`, style: {
            width: '28px',
            height: '28px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.18)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)'
        } }, pet.icon ? (React.createElement("img", { src: pet.icon, alt: pet.name, style: {
            width: '100%',
            height: '100%',
            objectFit: 'contain'
        } })) : (React.createElement("span", { style: { color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 700 } }, index + 1)))))));
}
function renderEmptyBlock() {
    return (React.createElement("div", { style: {
            width: '100%',
            minHeight: '260px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(61,61,61,0.55)',
            fontSize: '34px',
            fontWeight: 900,
            background: 'rgba(255,255,255,0.42)'
        } }, "\u6682\u65E0\u6570\u636E"));
}
function RocomProfileCard({ data }) {
    return (React.createElement(HTML, { style: { background: 'transparent', width: `${pageWidth}px` } },
        React.createElement("div", { style: {
                width: `${pageWidth}px`,
                padding: '18px 34px 28px',
                boxSizing: 'border-box',
                background: 'radial-gradient(circle at top left, rgba(255,197,95,0.16), transparent 24%), linear-gradient(180deg, #27211d 0%, #181411 100%)',
                color: '#fff'
            } },
            React.createElement("div", { style: {
                    width: '1120px',
                    minHeight: '670px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column'
                } },
                React.createElement("div", { style: {
                        width: '357px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 22px',
                        borderRadius: '999px',
                        background: 'linear-gradient(180deg, rgba(255,208,116,0.22) 0%, rgba(255,208,116,0.08) 100%)',
                        border: '1px solid rgba(255,203,115,0.2)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)'
                    } },
                    React.createElement("div", { style: {
                            fontSize: '30px',
                            fontWeight: 900,
                            letterSpacing: '4px',
                            color: '#ffcb73',
                            textShadow: '0 2px 8px rgba(0,0,0,0.28)'
                        } }, "WEGAME AI \u6D1B\u514B\u6863\u6848")),
                React.createElement("div", { style: { display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 18px', flex: 1 } },
                    React.createElement("div", { style: { width: '574px', display: 'flex', flexDirection: 'column', gap: '20px' } },
                        React.createElement("section", { style: {
                                width: '100%',
                                minHeight: '180px',
                                borderRadius: '17px',
                                padding: '14px 18px 16px',
                                boxSizing: 'border-box',
                                background: '#f3eee2',
                                color: '#272727'
                            } },
                            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '18px' } },
                                React.createElement("div", { style: {
                                        position: 'relative',
                                        width: '116px',
                                        height: '116px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    } },
                                    React.createElement("div", { style: {
                                            position: 'absolute',
                                            inset: '0',
                                            borderRadius: '50%',
                                            background: '#fbf7ee'
                                        } }),
                                    React.createElement("div", { style: {
                                            position: 'absolute',
                                            inset: '2px',
                                            borderRadius: '50%',
                                            background: '#1f1f1f'
                                        } }),
                                    data.userAvatar ? (React.createElement("img", { src: data.userAvatar, alt: data.userName, style: {
                                            position: 'relative',
                                            zIndex: 1,
                                            width: '108px',
                                            height: '108px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        } })) : null),
                                React.createElement("div", { style: { minWidth: 0, flex: 1 } },
                                    React.createElement("div", { style: { display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' } },
                                        React.createElement("span", { style: { fontSize: '34px', fontWeight: 900, lineHeight: 1, color: '#272727' } }, data.userName),
                                        React.createElement("span", { style: { fontSize: '22px', fontWeight: 900, color: '#6a604d' } },
                                            "Lv. ",
                                            data.userLevel)),
                                    React.createElement("div", { style: { marginTop: '10px', fontSize: '18px', color: '#5d5445', fontWeight: 700 } },
                                        "ID:",
                                        data.userUid))),
                            React.createElement("div", { style: { display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '28px' } },
                                React.createElement("div", { style: {
                                        flex: 1,
                                        height: '32px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(180deg, #eee5d2 0%, #e4dac4 100%)',
                                        padding: '0 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    } },
                                    React.createElement("div", { style: { color: '#423c38', fontSize: '16px', fontWeight: 700 } }, "\u5165\u5B66\u5929\u6570"),
                                    React.createElement("div", { style: { color: 'rgba(61,61,61,0.7)', fontSize: '18px', fontWeight: 900 } }, data.enrollDays)),
                                React.createElement("div", { style: {
                                        flex: 1,
                                        height: '32px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(180deg, #eee5d2 0%, #e4dac4 100%)',
                                        padding: '0 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    } },
                                    React.createElement("div", { style: { color: '#423c38', fontSize: '16px', fontWeight: 700 } }, "\u9B54\u6CD5\u5E08\u661F\u7EA7"),
                                    React.createElement("div", { style: { color: 'rgba(61,61,61,0.7)', fontSize: '16px', fontWeight: 900 } }, data.starName)))),
                        React.createElement("section", { style: {
                                width: '100%',
                                minHeight: '366px',
                                borderRadius: '17px',
                                padding: '10px 25px 0 21px',
                                boxSizing: 'border-box',
                                background: '#f3eee2',
                                color: '#272727',
                                display: 'flex',
                                gap: '18px'
                            } }, data.hasAiProfileData ? (React.createElement(React.Fragment, null,
                            React.createElement("div", { style: {
                                    width: '205px',
                                    minHeight: '323px',
                                    borderRadius: '17px',
                                    background: 'linear-gradient(180deg, #4b4037 0%, #332a24 100%)',
                                    position: 'relative',
                                    padding: '34px 14px 14px',
                                    boxSizing: 'border-box',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                                    transform: 'rotate(-0.26deg)',
                                    overflow: 'hidden'
                                } },
                                React.createElement("div", { style: {
                                        position: 'relative',
                                        color: '#f2f0df',
                                        fontSize: '19px',
                                        fontWeight: 900,
                                        lineHeight: 1.15,
                                        minHeight: '40px',
                                        textAlign: 'center',
                                        zIndex: 2
                                    } }, data.summaryTitleParts.map((item, index) => (React.createElement("span", { key: `${item}-${index}`, style: { display: 'block' } }, item)))),
                                React.createElement("div", { style: {
                                        width: '169px',
                                        height: '178px',
                                        margin: '8px auto 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    } }, data.bestPetImage ? (React.createElement("img", { src: data.bestPetImage, alt: data.bestPetName, style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    } })) : null),
                                React.createElement("div", { style: {
                                        position: 'absolute',
                                        right: '8px',
                                        bottom: '42px',
                                        width: '134px',
                                        height: '57px',
                                        borderRadius: '999px',
                                        background: 'linear-gradient(180deg, #ffcf74 0%, #f2b54f 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#8b3a00',
                                        fontSize: '24px',
                                        fontWeight: 900,
                                        boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                                    } }, data.scoreText),
                                React.createElement("div", { style: {
                                        position: 'absolute',
                                        left: '0',
                                        right: '0',
                                        bottom: '8px',
                                        textAlign: 'center',
                                        color: '#fbf7ee',
                                        fontSize: '22px',
                                        fontWeight: 900
                                    } }, data.bestPetName)),
                            React.createElement("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' } },
                                React.createElement("div", { style: {
                                        flex: 1,
                                        minHeight: '250px',
                                        borderRadius: '17px',
                                        background: '#f7f2e8',
                                        padding: '14px',
                                        boxSizing: 'border-box',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)'
                                    } },
                                    React.createElement("svg", { viewBox: '0 0 260 220', style: { width: '100%', height: '100%' } },
                                        data.radarPolygons.map((polygon, index) => (React.createElement("polygon", { key: `${polygon}-${index}`, points: polygon, fill: 'none', stroke: index === data.radarPolygons.length - 1 ? 'rgba(210,163,73,0.55)' : 'rgba(0,0,0,0.09)', strokeWidth: '1.5' }))),
                                        React.createElement("polygon", { points: data.radarAreaPoints, fill: 'rgba(255,186,0,0.22)', stroke: 'rgba(230,149,0,0.95)', strokeWidth: '3' }),
                                        data.radarAxisLabels.map(label => (React.createElement("text", { key: `${label.name}-${label.x}-${label.y}`, x: label.x, y: label.y, textAnchor: label.anchor, fill: '#4b3d30', fontSize: '16', fontWeight: '700' }, label.name))),
                                        data.radarValueBadges.map((badge, index) => (React.createElement("g", { key: `${badge.value}-${index}`, transform: `translate(${badge.x}, ${badge.y})` },
                                            React.createElement("rect", { width: badge.width, height: '24', rx: '12', fill: 'rgba(39,39,39,0.82)' }),
                                            React.createElement("text", { x: badge.width / 2, y: '16', textAnchor: 'middle', fill: '#ffcf74', fontSize: '13', fontWeight: '700' }, badge.value)))),
                                        data.radarDots.map(dot => (React.createElement("circle", { key: `${dot.key}-${dot.x}-${dot.y}`, cx: dot.x, cy: dot.y, r: '5', fill: '#f0a53a' }))))),
                                React.createElement("div", { style: {
                                        minHeight: '120px',
                                        borderRadius: '17px',
                                        background: '#e8e1d1',
                                        padding: '16px 14px 12px 18px',
                                        boxSizing: 'border-box',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
                                        position: 'relative'
                                    } },
                                    React.createElement("div", { style: {
                                            position: 'absolute',
                                            left: '-8px',
                                            top: '-14px',
                                            width: '94px',
                                            height: '34px',
                                            borderRadius: '16px',
                                            background: '#efc86a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#1f1f1f',
                                            fontSize: '14px',
                                            fontWeight: 900,
                                            transform: 'rotate(-5.8deg)'
                                        } }, "AI\u70B9\u8BC4"),
                                    React.createElement("div", { style: {
                                            color: '#7f7b77',
                                            fontSize: '13px',
                                            lineHeight: 1.53,
                                            fontWeight: 400,
                                            letterSpacing: '1.3px',
                                            paddingRight: '4px',
                                            paddingTop: '18px'
                                        } }, data.aiCommentText))))) : (renderEmptyBlock()))),
                    React.createElement("div", { style: { width: '477px', display: 'flex', flexDirection: 'column', gap: '20px' } },
                        React.createElement("section", { style: {
                                width: '100%',
                                minHeight: '265px',
                                borderRadius: '17px',
                                padding: '12px 30px 20px 16px',
                                boxSizing: 'border-box',
                                background: '#f3eee2',
                                color: '#272727'
                            } },
                            React.createElement("div", { style: { fontSize: '20px', fontWeight: 900, lineHeight: 1.2 } }, "\u6211\u7684\u6536\u85CF"),
                            React.createElement("div", { style: {
                                    marginTop: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '18px',
                                    position: 'relative',
                                    paddingBottom: '16px'
                                } },
                                React.createElement("div", { style: {
                                        position: 'absolute',
                                        left: '4px',
                                        right: '0',
                                        bottom: '0',
                                        height: '3px',
                                        background: 'repeating-linear-gradient(to right, rgba(125, 117, 104, 0.55) 0, rgba(125, 117, 104, 0.55) 4px, transparent 4px, transparent 9px)'
                                    } }),
                                React.createElement("div", { style: {
                                        width: '134px',
                                        height: '120px',
                                        paddingTop: '26px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        background: 'linear-gradient(180deg, #e8dfcd 0%, #d9ccb4 100%)',
                                        borderRadius: '18px'
                                    } },
                                    React.createElement("div", { style: { display: 'flex', alignItems: 'baseline', gap: '6px' } },
                                        React.createElement("span", { style: { color: '#3d3d3d', fontSize: '30px', fontWeight: 900, lineHeight: 1 } }, data.currentCollectionCount),
                                        React.createElement("span", { style: { color: 'rgba(61,61,61,0.7)', fontSize: '18px', fontWeight: 900, lineHeight: 1 } },
                                            "/ ",
                                            data.totalCollectionCount)),
                                    React.createElement("div", { style: {
                                            marginTop: '14px',
                                            color: '#f4eee1',
                                            fontSize: '17px',
                                            fontWeight: 900,
                                            background: '#8d6c3f',
                                            padding: '6px 14px',
                                            borderRadius: '999px'
                                        } }, "\u641C\u96C6\u60C5\u51B5")),
                                React.createElement("div", { style: { flex: 1 } },
                                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', gap: '10px' } }, [
                                        ['了不起精灵', data.amazingSpriteCount],
                                        ['异色精灵', data.shinySpriteCount],
                                        ['炫彩精灵', data.colorfulSpriteCount]
                                    ].map(([label, value]) => (React.createElement("div", { key: label, style: {
                                            position: 'relative',
                                            flex: 1,
                                            minWidth: '79px',
                                            height: '64px',
                                            borderRadius: '12px',
                                            background: '#e8e1d1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '8px 10px 6px'
                                        } },
                                        React.createElement("div", { style: {
                                                position: 'absolute',
                                                top: '-10px',
                                                width: '34px',
                                                height: '18px',
                                                borderRadius: '999px',
                                                background: '#d0b37e'
                                            } }),
                                        React.createElement("span", { style: { color: '#3d3d3d', fontSize: '15px', fontWeight: 700, lineHeight: 1.4, whiteSpace: 'nowrap' } }, label),
                                        React.createElement("span", { style: { marginTop: '2px', color: 'rgba(61,61,61,0.7)', fontSize: '22px', fontWeight: 900, lineHeight: 1.1 } }, value))))),
                                    React.createElement("div", { style: {
                                            marginTop: '8px',
                                            height: '45px',
                                            borderRadius: '11px',
                                            background: '#f1b958',
                                            color: '#ca5d00',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0 14px',
                                            fontSize: '18px',
                                            fontWeight: 900
                                        } },
                                        React.createElement("span", null, data.collectionHint),
                                        React.createElement("span", null, '>')))),
                            React.createElement("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '22px', marginLeft: '4px' } },
                                React.createElement("div", { style: {
                                        width: '208px',
                                        height: '32px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(180deg, #eee5d2 0%, #e4dac4 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0 16px'
                                    } },
                                    React.createElement("span", { style: { color: '#3d3d3d', fontSize: '18px', fontWeight: 700 } }, "\u65F6\u88C5\u6536\u85CF"),
                                    React.createElement("span", { style: { color: 'rgba(61,61,61,0.7)', fontSize: '18px', fontWeight: 900 } }, data.fashionCollectionCount)),
                                React.createElement("div", { style: {
                                        width: '208px',
                                        height: '32px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(180deg, #eee5d2 0%, #e4dac4 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0 16px'
                                    } },
                                    React.createElement("span", { style: { color: '#3d3d3d', fontSize: '18px', fontWeight: 700 } }, "\u9053\u5177\u6536\u85CF"),
                                    React.createElement("span", { style: { color: 'rgba(61,61,61,0.7)', fontSize: '18px', fontWeight: 900 } }, data.itemCount)))),
                        React.createElement("section", { style: {
                                width: '100%',
                                minHeight: '281px',
                                borderRadius: '17px',
                                padding: '12px 27px 18px 16px',
                                boxSizing: 'border-box',
                                background: '#f3eee2',
                                color: '#272727'
                            } },
                            React.createElement("div", { style: { fontSize: '20px', fontWeight: 900, lineHeight: 1.2 } }, "\u95EA\u8000\u5927\u8D5B"),
                            data.hasBattleData ? (React.createElement(React.Fragment, null,
                                React.createElement("div", { style: {
                                        marginTop: '12px',
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'flex-start',
                                        paddingBottom: '14px',
                                        borderBottom: '3px solid #e6dcc7'
                                    } },
                                    React.createElement("div", { style: { width: '142px', minHeight: '86px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, data.tierBadgeUrl ? (React.createElement("img", { src: data.tierBadgeUrl, alt: '', style: {
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'contain'
                                        } })) : null),
                                    React.createElement("div", { style: { flex: 1 } },
                                        React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', gap: '8px' } }, [
                                            ['对战胜率', data.winRate],
                                            ['对战场次', data.totalMatch],
                                            ['对战胜场', data.totalWin]
                                        ].map(([label, value]) => (React.createElement("div", { key: label, style: {
                                                width: '108px',
                                                height: '46px',
                                                borderRadius: '12px',
                                                background: '#e8e1d1',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            } },
                                            React.createElement("span", { style: { color: '#3d3d3d', fontSize: '16px', fontWeight: 700 } }, label),
                                            React.createElement("span", { style: { color: 'rgba(61,61,61,0.74)', fontSize: '18px', fontWeight: 900, marginTop: '2px' } }, value))))),
                                        React.createElement("div", { style: {
                                                marginTop: '8px',
                                                height: '45px',
                                                borderRadius: '12px',
                                                background: '#f1b958',
                                                color: '#ca5d00',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0 14px',
                                                fontSize: '18px',
                                                fontWeight: 900
                                            } },
                                            React.createElement("span", null, "\u67E5\u770B\u751F\u6DAF"),
                                            React.createElement("span", null, '>')))),
                                React.createElement("div", { style: {
                                        marginTop: '18px',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                        height: '148px',
                                        borderRadius: '18px',
                                        background: 'linear-gradient(180deg, #f7f0df 0%, #ecdfc5 100%)'
                                    } },
                                    React.createElement("div", { style: {
                                            position: 'absolute',
                                            top: '-14px',
                                            left: '-2px',
                                            padding: '8px 18px',
                                            borderRadius: '16px',
                                            background: '#efc86a',
                                            color: '#1f1f1f',
                                            fontSize: '14px',
                                            fontWeight: 900,
                                            transform: 'rotate(-3deg)'
                                        } }, "\u6700\u8FD1\u4E00\u573A\u6BD4\u8D5B"),
                                    React.createElement("div", { style: {
                                            width: '100%',
                                            height: '112px',
                                            margin: '0 12px',
                                            borderRadius: '16px',
                                            background: 'linear-gradient(180deg, #f3e6c9 0%, #e7d7b5 100%)',
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 74px 1fr',
                                            alignItems: 'center'
                                        } },
                                        React.createElement("div", { style: { padding: '8px 10px 8px 11px', display: 'flex', flexDirection: 'column', gap: '6px' } },
                                            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                                                React.createElement("div", { style: {
                                                        width: '29px',
                                                        height: '29px',
                                                        borderRadius: '50%',
                                                        overflow: 'hidden',
                                                        background: '#d6c6a9'
                                                    } }, data.userAvatar ? (React.createElement("img", { src: data.userAvatar, alt: data.userName, style: {
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    } })) : null),
                                                React.createElement("span", { style: {
                                                        color: '#272727',
                                                        fontSize: '13px',
                                                        fontWeight: 800,
                                                        maxWidth: '126px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    } }, data.userName)),
                                            renderPetLine(data.leftTeamPets)),
                                        React.createElement("div", { style: {
                                                justifySelf: 'center',
                                                width: '51px',
                                                height: '42px',
                                                borderRadius: '16px',
                                                background: data.matchResult === 'win'
                                                    ? 'linear-gradient(180deg, #f6d071 0%, #efb54e 100%)'
                                                    : 'linear-gradient(180deg, #fa8f97 0%, #f46c73 100%)',
                                                color: data.matchResult === 'win' ? '#8b3a00' : '#fff8f8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '18px',
                                                fontWeight: 900,
                                                boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
                                                border: data.matchResult === 'win' ? '1px solid rgba(180, 124, 32, 0.22)' : '1px solid rgba(176, 67, 76, 0.22)'
                                            } }, data.matchResult === 'win' ? '胜' : '败'),
                                        React.createElement("div", { style: { padding: '8px 11px 8px 10px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' } },
                                            React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                                                React.createElement("span", { style: {
                                                        color: '#272727',
                                                        fontSize: '13px',
                                                        fontWeight: 800,
                                                        maxWidth: '100px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    } }, data.opponentName),
                                                React.createElement("div", { style: {
                                                        width: '29px',
                                                        height: '29px',
                                                        borderRadius: '50%',
                                                        overflow: 'hidden',
                                                        background: '#d6c6a9'
                                                    } }, data.opponentAvatar ? (React.createElement("img", { src: data.opponentAvatar, alt: data.opponentName, style: {
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    } })) : null)),
                                            renderPetLine(data.rightTeamPets)))))) : (React.createElement("div", { style: { marginTop: '14px' } }, renderEmptyBlock())))))))));
}

export { RocomProfileCard as default };
