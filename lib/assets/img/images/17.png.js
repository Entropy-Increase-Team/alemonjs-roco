const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../17-B38tT8LJ.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
