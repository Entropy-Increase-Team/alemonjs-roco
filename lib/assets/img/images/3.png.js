const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../3-dIW0k7ci.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
