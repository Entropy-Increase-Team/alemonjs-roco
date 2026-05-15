const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../100-tL0jZf8W.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
