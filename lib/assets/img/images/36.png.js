const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../36-zMfCttma.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
