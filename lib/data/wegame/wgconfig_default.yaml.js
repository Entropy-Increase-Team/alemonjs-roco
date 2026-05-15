const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/wgconfig_default-iEhpnCdD.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
