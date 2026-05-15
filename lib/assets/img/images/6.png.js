const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../6-Bv8vejBT.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
