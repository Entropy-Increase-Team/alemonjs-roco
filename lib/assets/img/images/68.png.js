const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../68-BCf9yhxe.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
