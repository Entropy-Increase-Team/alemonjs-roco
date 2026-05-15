const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../42-BCh_0V3H.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
