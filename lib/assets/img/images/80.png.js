const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../80-DB6DofV9.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
