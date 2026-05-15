const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../91-LX8JZO28.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
