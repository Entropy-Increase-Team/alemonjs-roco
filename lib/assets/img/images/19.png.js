const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../19-eccgx6uY.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
