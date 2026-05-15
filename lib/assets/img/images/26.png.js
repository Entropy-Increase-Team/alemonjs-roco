const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../26-cW5qewQz.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
