const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../31-Csk30HR5.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
