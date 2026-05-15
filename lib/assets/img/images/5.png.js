const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../5-C7XgBEXr.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
