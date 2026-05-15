const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../62-A85dDXW1.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
