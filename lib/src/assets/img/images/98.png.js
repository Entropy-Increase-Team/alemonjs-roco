const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../../assets/98-CbdMX9ii.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
