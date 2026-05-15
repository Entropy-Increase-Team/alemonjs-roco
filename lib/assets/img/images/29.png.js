const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../29-8vRm3U3K.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
