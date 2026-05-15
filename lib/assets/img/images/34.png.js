const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../34-FeuK5lhS.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
