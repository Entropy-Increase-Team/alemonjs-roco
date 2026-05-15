const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../75-BszH-584.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
