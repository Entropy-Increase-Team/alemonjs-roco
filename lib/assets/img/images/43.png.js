const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../43-BoKUF5E2.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
