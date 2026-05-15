const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../99-e8q3Ydfe.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
