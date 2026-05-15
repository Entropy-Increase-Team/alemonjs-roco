const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../89-qWsC2iNq.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
