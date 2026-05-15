const reg = ['win32'].includes(process.platform) ? /^file:\/\/\// : /^file:\/\// ;
const fileUrl = new URL('../../../../assets/83-CT_ofmi-.png', import.meta.url).href.replace(reg, '');

export { fileUrl as default };
