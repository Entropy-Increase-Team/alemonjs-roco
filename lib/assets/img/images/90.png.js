const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../90-CxNI5P35.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
