const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../14-CQ9XtfEv.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
