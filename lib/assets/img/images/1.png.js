const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../1-CL_sBT6c.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
