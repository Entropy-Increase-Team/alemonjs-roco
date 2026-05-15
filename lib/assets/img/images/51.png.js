const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../51-Q_A4inJ9.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
