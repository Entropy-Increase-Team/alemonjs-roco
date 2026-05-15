const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../96-B1cJXiWn.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
