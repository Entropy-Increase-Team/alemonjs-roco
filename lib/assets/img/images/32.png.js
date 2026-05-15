const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../32-CoPS9oUf.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
