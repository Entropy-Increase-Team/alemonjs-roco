/*
 * 说明：后端 payload 字段大量为 unknown，字符串兜底链刻意使用 ||（空字符串同样视为缺失），
 * 因此关闭 prefer-nullish-coalescing 检查。
 */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { requestWeGame } from '@src/model/wegameAccount';

const CHINA_TIMEZONE = 'Asia/Shanghai';
const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVITY_THEMES = ['gold', 'green', 'brown'];

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const chinaDateFormatter = new Intl.DateTimeFormat('zh-CN', { timeZone: CHINA_TIMEZONE, month: '2-digit', day: '2-digit' });
const chinaDateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: CHINA_TIMEZONE,
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});
const chinaDatePartsFormatter = new Intl.DateTimeFormat('zh-CN', { timeZone: CHINA_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' });

function formatDateText(timestampMs: unknown, withTime = false): string {
  const numeric = Number(timestampMs);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '--';
  }

  const formatter = withTime ? chinaDateTimeFormatter : chinaDateFormatter;

  return formatter.format(new Date(numeric)).replace(/\//gu, '.');
}

function getChinaDateParts(date = new Date()): { year: number; month: number; day: number } {
  const parts: Record<string, number> = {};

  for (const item of chinaDatePartsFormatter.formatToParts(date)) {
    if (item.type !== 'literal') {
      parts[item.type] = Number(item.value);
    }
  }

  return { year: parts.year, month: parts.month, day: parts.day };
}

function chinaDateToTimestampMs(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): number {
  return Date.UTC(year, month - 1, day, hour - 8, minute, second);
}

function parseChinaDateText(value = '', endOfDay = false): number {
  const text = normalizeText(value);

  if (!text) {
    return 0;
  }

  const localMatch = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/u);

  if (localMatch) {
    const [, year, month, day, hour, minute, second] = localMatch;
    const hasTime = hour !== undefined;

    return chinaDateToTimestampMs(
      Number(year),
      Number(month),
      Number(day),
      hasTime ? Number(hour) : endOfDay ? 23 : 0,
      hasTime ? Number(minute) : endOfDay ? 59 : 0,
      hasTime ? Number(second || 0) : endOfDay ? 59 : 0
    );
  }

  const parsed = Date.parse(text);

  return Number.isFinite(parsed) ? parsed : 0;
}

function parseActivityTimestampMs(value: unknown, fallbackDate = '', endOfDay = false): number {
  const numeric = Number(value);

  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric > 10_000_000_000 ? numeric : numeric * 1000;
  }

  return parseChinaDateText(normalizeText(value) || fallbackDate, endOfDay);
}

function extractActivitySource(payload: Record<string, unknown> = {}): unknown[] {
  if (!isPlainObject(payload)) {
    return [];
  }

  for (const key of ['activityCalendar', 'calendar', 'otherActivities', 'other_activities', 'activities', 'list', 'items']) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  if (isPlainObject(payload.data)) {
    return extractActivitySource(payload.data);
  }

  return [];
}

function rewardName(item: unknown): string {
  if (isPlainObject(item)) {
    return normalizeText(item.name || item.goods_name || item.pet_name || item.title);
  }

  return normalizeText(item);
}

function extractRewards(activity: Record<string, unknown>): Array<{ kind: string; name: string }> {
  const rewards: Array<{ kind: string; name: string }> = [];

  for (const [kind, key] of [
    ['prop', 'get_props'],
    ['prop', 'get_extra_props'],
    ['pet', 'get_pets']
  ] as Array<[string, string]>) {
    const value = Array.isArray(activity[key]) ? activity[key] : [];

    for (const item of value) {
      const name = rewardName(item);

      if (name) {
        rewards.push({ kind, name });
      }
    }
  }

  return rewards;
}

function buildRewardText(rewards: Array<{ kind: string; name: string }>): string {
  return rewards.length > 0
    ? rewards
        .slice(0, 6)
        .map(item => item.name)
        .join('、')
    : '暂无奖励信息';
}

export type ActivityItem = {
  id: string;
  name: string;
  desc: string;
  description: string;
  cover: string;
  start_ts: number;
  end_ts: number;
  start: string;
  end: string;
  statusText: string;
  statusClass: 'active' | 'upcoming' | 'ended' | 'permanent';
  is_unlimited: boolean;
  is_perm: boolean;
  rewards: Array<{ kind: string; name: string }>;
  rewards_text: string;
  sort: number;
  time_label: string;
  left_pct: number;
  width_pct: number;
  hide_start: boolean;
  theme: string;
};

export type ActivityCalendarCardData = {
  title: string;
  subtitle: string;
  activity_count: number;
  activities: ActivityItem[];
  lanes: ActivityItem[][];
  axis_dates: Array<{ label: string; left_pct: number }>;
  now_line: { label: string; left_pct: number } | null;
  empty: boolean;
  commandHint: string;
  copyright: string;
};

function packLanes(items: ActivityItem[]): ActivityItem[][] {
  const lanes: ActivityItem[][] = [];

  for (const item of items) {
    const lane = lanes.find(current => item.start_ts >= current[current.length - 1].end_ts + DAY_MS);

    if (lane) {
      lane.push(item);
    } else {
      lanes.push([item]);
    }
  }

  return lanes;
}

function buildActivityTimeLabel(activity: { is_perm: boolean; hide_start: boolean; start: string; end: string }): string {
  if (activity.is_perm) {
    return `${activity.start} 开启`;
  }

  if (activity.hide_start) {
    return `截止 ${activity.end}`;
  }

  return `${activity.start} - ${activity.end}`;
}

export function fetchActivitiesInfo(refresh = false, userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/activities/info', {
    method: 'GET',
    params: {
      ...(refresh ? { refresh: 'true' } : {}),
      user_identifier: userIdentifier
    },
    headers: { 'X-User-Identifier': userIdentifier }
  });
}

export function extractActivities(payload: Record<string, unknown> = {}): ActivityItem[] {
  const source = extractActivitySource(payload);
  const nowMs = Date.now();

  return source
    .filter(item => isPlainObject(item) && !item.is_deleted)
    .map((rawItem): ActivityItem | null => {
      const item = rawItem as Record<string, unknown>;
      let startTs = parseActivityTimestampMs(item.start_time || item.startAt || item.start_at || item.start_ts, normalizeText(item.start_date || ''));
      let endTs = parseActivityTimestampMs(item.end_time || item.endAt || item.end_at || item.end_ts, normalizeText(item.end_date || ''), true);
      const isUnlimited = Boolean(item.is_unlimited);

      if (!startTs && !endTs && !isUnlimited) {
        return null;
      }

      if (isUnlimited && !endTs) {
        endTs = startTs ? startTs + 365 * DAY_MS : nowMs + 365 * DAY_MS;
      }

      if (!startTs) {
        startTs = nowMs;
      }

      if (!endTs || endTs <= startTs) {
        endTs = startTs + DAY_MS;
      }

      const isPermanent = isUnlimited || endTs - startTs >= 300 * DAY_MS;
      const rewards = extractRewards(item);
      let statusText = '进行中';
      let statusClass: ActivityItem['statusClass'] = 'active';

      if (nowMs < startTs) {
        statusText = '未开始';
        statusClass = 'upcoming';
      } else if (nowMs > endTs && !isUnlimited) {
        statusText = '已结束';
        statusClass = 'ended';
      } else if (isPermanent) {
        statusText = '常驻';
        statusClass = 'permanent';
      }

      return {
        id: normalizeText(item._id || item.id),
        name: normalizeText(item.name || item.title) || '未命名活动',
        desc: normalizeText(item.description || item.desc) || '活动',
        description: normalizeText(item.description || item.desc),
        cover: normalizeText(item.cover_url || item.cover || item.pic),
        start_ts: startTs,
        end_ts: endTs,
        start: formatDateText(startTs, true),
        end: formatDateText(endTs, true),
        statusText,
        statusClass,
        is_unlimited: isUnlimited,
        is_perm: isPermanent,
        rewards,
        rewards_text: buildRewardText(rewards),
        sort: Number(item.sort) || 999,
        time_label: formatDateText(startTs) === formatDateText(endTs) ? formatDateText(startTs) : `${formatDateText(startTs)} ~ ${formatDateText(endTs)}`,
        left_pct: 0,
        width_pct: 0,
        hide_start: false,
        theme: 'gold'
      };
    })
    .filter((item): item is ActivityItem => item !== null)
    .sort((a, b) => Number(a.is_perm) - Number(b.is_perm) || a.start_ts - b.start_ts || a.sort - b.sort);
}

export function buildActivityCalendarCardData(payload: Record<string, unknown> = {}): ActivityCalendarCardData {
  const activities = extractActivities(payload);
  const now = new Date();
  const nowMs = now.getTime();
  const today = getChinaDateParts(now);
  const todayMidnightMs = chinaDateToTimestampMs(today.year, today.month, today.day);
  const minTs = todayMidnightMs - 10 * DAY_MS;
  const maxTs = todayMidnightMs + 50 * DAY_MS;
  const totalDuration = Math.max(maxTs - minTs, 1);
  const normalItems: ActivityItem[] = [];
  const permanentItems: ActivityItem[] = [];
  const keyDates = new Set<number>();

  for (const sourceActivity of activities) {
    const item: ActivityItem = { ...sourceActivity };
    let leftPct = ((item.start_ts - minTs) / totalDuration) * 100;
    let rightPct = ((item.end_ts - minTs) / totalDuration) * 100;

    if (item.is_perm) {
      rightPct = 100;
    }

    leftPct = clamp(leftPct, 0, 100);
    rightPct = clamp(rightPct, 0, 100);

    const widthPct = Math.max(12.5, rightPct - leftPct);

    if (leftPct + widthPct > 100) {
      leftPct = Math.max(0, 100 - widthPct);
    }

    item.left_pct = Number(leftPct.toFixed(3));
    item.width_pct = Number(widthPct.toFixed(3));
    item.hide_start = item.start_ts < minTs;
    item.time_label = buildActivityTimeLabel(item);

    if (item.is_perm) {
      permanentItems.push(item);
    } else {
      normalItems.push(item);

      if (minTs <= item.start_ts && item.start_ts <= maxTs) {
        keyDates.add(item.start_ts);
      }
    }
  }

  const lanes = [...packLanes(normalItems), ...packLanes(permanentItems)].map((lane, laneIndex) => lane.map((item, itemIndex) => ({
      ...item,
      theme: ACTIVITY_THEMES[(laneIndex + itemIndex) % ACTIVITY_THEMES.length]
    }))
  );

  const axisDates: Array<{ label: string; left_pct: number }> = [];
  let lastTs = 0;

  for (const ts of [...keyDates].sort((a, b) => a - b)) {
    if (ts - lastTs < 4 * DAY_MS) {
      continue;
    }

    lastTs = ts;
    axisDates.push({
      label: formatDateText(ts),
      left_pct: Number((((ts - minTs) / totalDuration) * 100).toFixed(3))
    });
  }

  const nowPct = ((nowMs - minTs) / totalDuration) * 100;
  const nowLine = nowPct >= 0 && nowPct <= 100 ? { label: 'TODAY', left_pct: Number(nowPct.toFixed(3)) } : null;

  return {
    title: '洛克活动日历',
    subtitle: `显示 ${formatDateText(nowMs)} 前 10 天至后 50 天活动`,
    activity_count: activities.length,
    activities,
    lanes,
    axis_dates: axisDates,
    now_line: nowLine,
    empty: activities.length === 0,
    commandHint: '发送 +日历 / +活动',
    copyright: 'alemonjs-roco · Roco Kingdom'
  };
}

export function buildActivityCalendarText(payload: Record<string, unknown> = {}): string {
  const activities = extractActivities(payload);

  if (activities.length === 0) {
    return ['洛克活动日历', '', '暂无进行中的活动。'].join('\n');
  }

  const lines = ['洛克活动日历', `当前共 ${activities.length} 个活动`, ''];

  activities.forEach((activity, index) => {
    lines.push(`${index + 1}. ${activity.name}`);
    lines.push(`状态：${activity.statusText}`);
    lines.push(`时间：${activity.time_label}`);

    if (activity.description) {
      lines.push(`说明：${activity.description}`);
    }

    if (activity.rewards.length > 0) {
      lines.push(`奖励：${activity.rewards.map(item => item.name).join('、')}`);
    }

    if (index !== activities.length - 1) {
      lines.push('');
    }
  });

  return lines.join('\n');
}
