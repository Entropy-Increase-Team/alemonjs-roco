import { Format } from 'alemonjs';

function buildTextFormat(text) {
    const format = Format.create();
    const md = Format.createMarkdown();
    md.addText(text);
    format.addMarkdown(md);
    return format;
}
function normalizeImageValue(image) {
    const value = String(image ?? '').trim();
    if (!value) {
        return value;
    }
    const dataUrlMatch = value.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/u);
    if (dataUrlMatch?.[1]) {
        return `base64://${dataUrlMatch[1]}`;
    }
    return value;
}
function buildTextImageFormat(text, image) {
    const format = buildTextFormat(text);
    format.addImage(normalizeImageValue(image));
    return format;
}
function getLoginStatusText(status) {
    if (status === 'pending') {
        return '等待扫码';
    }
    if (status === 'scanned') {
        return '已扫码，等待手机确认';
    }
    if (status === 'processing') {
        return '已确认，正在换取 WeGame 凭证';
    }
    if (status === 'done') {
        return '登录成功';
    }
    if (status === 'expired') {
        return '二维码已过期';
    }
    return status || '状态未知';
}
function extractAccountIndex(raw, usage) {
    const value = String(raw ?? '').trim();
    if (!/^\d+$/u.test(value)) {
        throw new Error(`格式：${usage}`);
    }
    return Number(value);
}

export { buildTextFormat, buildTextImageFormat, extractAccountIndex, getLoginStatusText };
