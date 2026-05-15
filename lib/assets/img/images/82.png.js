const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../82-DcqqDH3W.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
