const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../66-Cds_e1tz.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
