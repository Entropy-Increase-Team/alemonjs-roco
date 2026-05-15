const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../57-D3rsopz3.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
