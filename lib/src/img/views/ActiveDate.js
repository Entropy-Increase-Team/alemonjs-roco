import React from 'react';
import HTML from './HTML.js';

function ActiveDate() {
    return (React.createElement(HTML, null,
        React.createElement("img", { src: 'https://game.gtimg.cn/images/rocom/act/a20250812preview/web/part4-avif/part4-img.avif' })));
}

export { ActiveDate as default };
