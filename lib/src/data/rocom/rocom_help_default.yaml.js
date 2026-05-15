const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../assets/rocom_help_default-BxPp25dw.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
