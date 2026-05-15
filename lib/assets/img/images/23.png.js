const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../23-Bp-yJwaA.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
