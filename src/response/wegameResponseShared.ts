import { Format } from 'alemonjs';

export function buildTextFormat(text: string) {
  const format = Format.create();
  const md = Format.createMarkdown();

  md.addText(text);
  format.addMarkdown(md);

  return format;
}

function normalizeImageValue(image: string): string {
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

export function buildTextImageFormat(text: string, image: string) {
  const format = buildTextFormat(text);

  format.addImage(normalizeImageValue(image));

  return format;
}

export function getLoginStatusText(status: string) {
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

export function extractAccountIndex(raw: string, usage: string): number {
  const value = String(raw ?? '').trim();

  if (!/^\d+$/u.test(value)) {
    throw new Error(`格式：${usage}`);
  }

  return Number(value);
}
