const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../49-lbWc6wEB.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
