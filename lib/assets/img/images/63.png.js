const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../63-B2roZBnj.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
