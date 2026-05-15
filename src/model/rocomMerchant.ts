import { requestWeGame } from '@src/model/wegameAccount';

type MerchantProduct = {
  name: string;
  image: string;
  timeLabel: string;
  type: string;
};

export type RocomMerchantCardData = {
  title: string;
  subtitle: string;
  productCount: number;
  roundLabel: string;
  countdown: string;
  products: Array<{
    name: string;
    image: string;
    timeLabel: string;
    type: string;
    slotLabel: string;
  }>;
};

type MerchantRound = {
  date: string;
  current: number | null;
  total: number;
  roundId: string;
  isOpen: boolean;
  countdown: string;
  startTime: Date | null;
  endTime: Date | null;
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function padNumber(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateTime(value: unknown): string {
  const date = value instanceof Date ? value : new Date(Number(value));

  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return `${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;
}

function formatCountdown(diffMs = 0): string {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}小时${minutes}分钟`;
  }

  if (hours > 0) {
    return `${hours}小时`;
  }

  return `${minutes}分钟`;
}

export function getCurrentMerchantRound(now = new Date()): MerchantRound {
  const current = now instanceof Date ? now : new Date(now);
  const start = new Date(current);

  start.setHours(8, 0, 0, 0);

  const roundWindowMs = 4 * 60 * 60 * 1000;
  const marketEnd = new Date(start.getTime() + 4 * roundWindowMs);
  let roundIndex: number | null = null;
  let roundStart: Date | null = null;
  let roundEnd: Date | null = null;

  if (current >= start && current < marketEnd) {
    roundIndex = Math.floor((current.getTime() - start.getTime()) / roundWindowMs) + 1;
    roundStart = new Date(start.getTime() + (roundIndex - 1) * roundWindowMs);
    roundEnd = new Date(roundStart.getTime() + roundWindowMs);
  }

  const dateLabel = `${current.getFullYear()}-${padNumber(current.getMonth() + 1)}-${padNumber(current.getDate())}`;

  return {
    date: dateLabel,
    current: roundIndex,
    total: 4,
    roundId: `${dateLabel}-${roundIndex ?? 'closed'}`,
    isOpen: roundIndex !== null,
    countdown: roundEnd ? formatCountdown(roundEnd.getTime() - current.getTime()) : '未开市',
    startTime: roundStart,
    endTime: roundEnd
  };
}

export function normalizeMerchantActivities(payload: Record<string, unknown> = {}) {
  const merchantActivities = Array.isArray(payload.merchantActivities)
    ? (payload.merchantActivities as Array<Record<string, unknown>>)
    : Array.isArray(payload.merchant_activities)
      ? (payload.merchant_activities as Array<Record<string, unknown>>)
      : [];
  const otherActivities = Array.isArray(payload.otherActivities)
    ? (payload.otherActivities as Array<Record<string, unknown>>)
    : Array.isArray(payload.other_activities)
      ? (payload.other_activities as Array<Record<string, unknown>>)
      : [];

  return {
    merchantActivities,
    otherActivities
  };
}

function isMerchantItemActive(item: Record<string, unknown> = {}, nowMs = Date.now()): boolean {
  const startTime = item.start_time;
  const endTime = item.end_time;

  if (startTime === undefined || endTime === undefined) {
    return true;
  }

  const start = Number(startTime);
  const end = Number(endTime);

  if (!Number.isFinite(start) || !Number.isFinite(end) || start === 0 || end === 0) {
    return true;
  }

  return start <= nowMs && nowMs < end;
}

export function formatMerchantWindow(item: Record<string, unknown> = {}): string {
  const startTime = Number(item.start_time);
  const endTime = Number(item.end_time);

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime === 0 || endTime === 0) {
    return '当前轮次';
  }

  const startLabel = formatDateTime(startTime);
  const endLabel = formatDateTime(endTime);

  if (startLabel === '--' || endLabel === '--') {
    return '当前轮次';
  }

  if (startLabel.slice(0, 5) === endLabel.slice(0, 5)) {
    return `${startLabel} - ${endLabel.slice(6)}`;
  }

  return `${startLabel} - ${endLabel}`;
}

export function extractMerchantProducts(payload: Record<string, unknown> = {}, options?: { nowMs?: number; fallbackImage?: string }) {
  const nowMs = Number(options?.nowMs) || Date.now();
  const fallbackImage = normalizeText(options?.fallbackImage);
  const { merchantActivities, otherActivities } = normalizeMerchantActivities(payload);
  const activity = merchantActivities[0] ?? {};
  const props = Array.isArray(activity.get_props) ? activity.get_props : [];
  const pets = Array.isArray(activity.get_pets) ? activity.get_pets : [];
  const extraProps = Array.isArray(activity.get_extra_props) ? activity.get_extra_props : [];
  const products: MerchantProduct[] = [];

  const pushProduct = (item: Record<string, unknown>, type: string) => {
    if (!isMerchantItemActive(item, nowMs)) {
      return;
    }

    products.push({
      name: normalizeText(item.name ?? `未知${type}`) || `未知${type}`,
      image: normalizeText(item.icon_url) || fallbackImage,
      timeLabel: formatMerchantWindow(item),
      type
    });
  };

  props.forEach(item => pushProduct(item as Record<string, unknown>, '商品'));
  extraProps.forEach(item => pushProduct(item as Record<string, unknown>, '额外道具'));
  pets.forEach(item => pushProduct(item as Record<string, unknown>, '精灵'));

  return {
    activity,
    merchantActivities,
    otherActivities,
    products
  };
}

export function fetchRocomMerchantInfo(refresh = false): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/merchant/info', {
    method: 'GET',
    params: refresh ? { refresh: 'true' } : undefined
  });
}

export function buildRocomMerchantText(payload: Record<string, unknown>, now = new Date()): string {
  const { activity, products } = extractMerchantProducts(payload);
  const roundInfo = getCurrentMerchantRound(now);
  const lines = [
    normalizeText(activity.name) || '远行商人',
    `当前轮次：${roundInfo.current ?? '未开放'} / ${roundInfo.total}`,
    `剩余时间：${roundInfo.countdown}`
  ];

  if (products.length === 0) {
    lines.push('', '当前轮次暂无商品。');

    return lines.join('\n');
  }

  lines.push('');
  products.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`类型：${item.type}`);
    lines.push(`时间：${item.timeLabel}`);
  });

  return lines.join('\n');
}

export function buildRocomMerchantCardData(payload: Record<string, unknown>, now = new Date()): RocomMerchantCardData {
  const { activity, products } = extractMerchantProducts(payload);
  const roundInfo = getCurrentMerchantRound(now);

  return {
    title: normalizeText(activity.name) || '远行商人',
    subtitle: normalizeText(activity.start_date) || '每日 08:00 / 12:00 / 16:00 / 20:00 刷新',
    productCount: products.length,
    roundLabel: `第 ${roundInfo.current ?? '未开放'} / ${roundInfo.total} 轮`,
    countdown: roundInfo.countdown,
    products: products.map((item, index) => ({
      name: item.name,
      image: item.image,
      timeLabel: item.timeLabel,
      type: item.type,
      slotLabel: `展位 ${index + 1}`
    }))
  };
}
