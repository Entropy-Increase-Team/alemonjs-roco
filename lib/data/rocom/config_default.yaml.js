const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/config_default-DaxyqT30.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
