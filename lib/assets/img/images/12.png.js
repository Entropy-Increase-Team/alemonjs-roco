const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../12-DPmw1uNR.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
