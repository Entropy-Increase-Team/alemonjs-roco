const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../59-CMFdU1Co.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
