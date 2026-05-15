const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../72-pkjAtlTX.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
