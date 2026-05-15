const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../22-B8tZt5zH.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
