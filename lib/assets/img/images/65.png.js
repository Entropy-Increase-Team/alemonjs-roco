const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../65-D6wTanWl.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
