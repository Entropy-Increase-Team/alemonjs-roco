import fileUrl from '../../assets/css/input.scss.js';
import fileUrl$1 from '../../assets/font/tttgbnumber.ttf.js';
import classNames from 'classnames';
import React from 'react';

const HTML = (props) => {
    const { children, className, style, ...reSet } = props;
    return (React.createElement("html", { className: 'p-0 m-0', style: { margin: 0, padding: 0, width: 'fit-content' } },
        React.createElement("head", null,
            React.createElement("link", { type: 'text/css', rel: 'stylesheet', href: fileUrl }),
            React.createElement("meta", { httpEquiv: 'content-type', content: 'text/html;charset=utf-8' }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
              @font-face {
                font-family: 'tttgbnumber';
                src: url('${fileUrl$1}'); 
                font-weight: normal; 
                font-style: normal; 
              }
              body { 
                font-family: 'tttgbnumber', 
                system-ui, sans-serif; 
              }
            `
                } })),
        React.createElement("body", { className: classNames('p-0 m-0', className), style: {
                margin: 0,
                padding: 0,
                display: 'inline-block',
                width: 'fit-content',
                textAlign: 'left',
                ...style
            }, ...reSet }, children)));
};

export { HTML as default };
