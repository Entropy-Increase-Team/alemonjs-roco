const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../../assets/74-BkvHUUCh.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
