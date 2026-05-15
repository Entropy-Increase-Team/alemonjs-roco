const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../../assets/40-BOHlKUuo.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
