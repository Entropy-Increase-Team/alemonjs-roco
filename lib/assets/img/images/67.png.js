const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../67-Mc2BlMbH.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
