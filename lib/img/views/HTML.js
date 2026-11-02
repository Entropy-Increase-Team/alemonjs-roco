import _lvy_styles_1a82e70a29d8f05426f5f8f6_default from "../../_virtual/_lvy-styles_1a82e70a29d8f05426f5f8f6.js";
import _lvy_asset_104_default from "../../_virtual/_lvy-asset_104.js";
import React from "react";
import classNames from "classnames";

// src/img/views/HTML.tsx
const HTML = (props) => {
	const { children, className, style, ...reSet } = props;
	return /* @__PURE__ */ React.createElement("html", {
		className: "p-0 m-0",
		style: {
			margin: 0,
			padding: 0,
			width: "fit-content"
		}
	}, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("link", {
		type: "text/css",
		rel: "stylesheet",
		href: _lvy_styles_1a82e70a29d8f05426f5f8f6_default
	}), /* @__PURE__ */ React.createElement("meta", {
		httpEquiv: "content-type",
		content: "text/html;charset=utf-8"
	}), /* @__PURE__ */ React.createElement("style", { dangerouslySetInnerHTML: { __html: `
              @font-face {
                font-family: 'tttgbnumber';
                src: url('${_lvy_asset_104_default}'); 
                font-weight: normal; 
                font-style: normal; 
              }
              body { 
                font-family: 'tttgbnumber', 
                system-ui, sans-serif; 
              }
            ` } })), /* @__PURE__ */ React.createElement("body", {
		className: classNames("p-0 m-0", className),
		style: {
			margin: 0,
			padding: 0,
			display: "inline-block",
			width: "fit-content",
			textAlign: "left",
			...style
		},
		...reSet
	}, children));
};

export { HTML as default };