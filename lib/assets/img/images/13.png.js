const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../13-C2QDa2iL.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
