const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../15-uoBJO8Bo.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
