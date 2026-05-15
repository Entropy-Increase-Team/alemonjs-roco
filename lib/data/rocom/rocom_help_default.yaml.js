const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../assets/rocom_help_default-BWo8NVoS.yaml', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
