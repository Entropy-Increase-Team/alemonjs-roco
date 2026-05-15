const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../../assets/52-B5Qdh-Y-.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
