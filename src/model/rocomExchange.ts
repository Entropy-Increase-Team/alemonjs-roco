import { requestWeGame, resolveActiveWeGameCredential, type WeGameContext } from '@src/model/wegameAccount';

type ExchangePoster = {
  userName: string;
  userLevel: number;
  isOnline: boolean;
  userId: string;
  wantText: string;
  provideItems: string[];
  timeLabel: string;
  isExpired: boolean;
  avatarUrl: string;
};

type ExchangeHallResult = {
  pageNo: number;
  totalPages: number;
  refresh: boolean;
  filterLabel: string;
  commandHint: string;
  posters: ExchangePoster[];
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function toNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);

  return Number.isFinite(numeric) ? numeric : fallback;
}

function resolveAccountType(loginType?: string): string | undefined {
  const normalized = normalizeText(loginType).toLowerCase();

  if (normalized === 'qq') {
    return '1';
  }

  if (normalized === 'wechat') {
    return '2';
  }

  return undefined;
}

function formatPosterTime(value: unknown): string {
  const numeric = Number(value);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '未知';
  }

  const date = new Date(numeric * 1000);

  if (Number.isNaN(date.getTime())) {
    return '未知';
  }

  const pad = (num: number) => String(num).padStart(2, '0');

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseExchangeArgs(text: string): { pageNo: number; refresh: boolean } {
  const raw = normalizeText(text);

  if (!raw) {
    return {
      pageNo: 1,
      refresh: false
    };
  }

  const tokens = raw.split(/\s+/u).filter(Boolean);
  let pageNo = 1;
  let refresh = false;

  for (const token of tokens) {
    const normalized = normalizeText(token).toLowerCase();

    if (normalized === '刷新' || normalized === 'refresh') {
      refresh = true;
      continue;
    }

    if (/^\d+$/u.test(token)) {
      pageNo = Number(token);
      continue;
    }

    throw new Error('格式：+交换大厅 [页码] [刷新]');
  }

  if (pageNo < 1 || pageNo > 50) {
    throw new Error('页码仅支持 1-50');
  }

  return {
    pageNo,
    refresh
  };
}

function normalizePoster(poster: Record<string, unknown>): ExchangePoster {
  const userInfo =
    poster.user_info && typeof poster.user_info === 'object' && !Array.isArray(poster.user_info) ? (poster.user_info as Record<string, unknown>) : {};
  const expireTime = Number(poster.expire_time);
  const nowSeconds = Math.floor(Date.now() / 1000);

  return {
    userName: normalizeText(userInfo.nickname) || '未知玩家',
    userLevel: toNumber(userInfo.level, 0),
    isOnline: Number(userInfo.online_status) === 1,
    userId: normalizeText(userInfo.role_id) || '未知',
    wantText: normalizeText(poster.want_item_name ?? poster.message) || '交友',
    provideItems: Array.isArray(poster.offer_items) ? poster.offer_items.map(item => normalizeText(item)).filter(Boolean) : [],
    timeLabel: formatPosterTime(poster.create_time),
    isExpired: Number.isFinite(expireTime) ? nowSeconds >= expireTime : false,
    avatarUrl: normalizeText(userInfo.avatar_url)
  };
}

export async function getRocomExchangeHall(context: WeGameContext, rawArgs = '') {
  const args = parseExchangeArgs(rawArgs);
  const { credential } = await resolveActiveWeGameCredential(context);

  if (!credential?.frameworkToken) {
    throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
  }

  const params: Record<string, string> = {
    page_no: String(args.pageNo),
    refresh: args.refresh ? 'true' : 'false'
  };
  const accountType = resolveAccountType(credential.loginType);

  if (accountType) {
    params.account_type = accountType;
  }

  const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/exchange/posters', {
    method: 'GET',
    headers: {
      'X-Framework-Token': credential.frameworkToken
    },
    params
  });
  const posters = Array.isArray(payload.posters) ? (payload.posters as Array<Record<string, unknown>>) : [];

  if (posters.length === 0) {
    throw new Error(args.pageNo > 1 ? '该页没有更多交换大厅海报了' : '当前交换大厅暂无海报');
  }

  return {
    pageNo: toNumber(payload.page_no, args.pageNo),
    totalPages: Math.max(1, toNumber(payload.total_pages, 1)),
    refresh: args.refresh,
    filterLabel: args.refresh ? '强制刷新' : '默认筛选',
    commandHint: '+交换大厅 <页码> [刷新]',
    posters: posters.map(item => normalizePoster(item))
  } satisfies ExchangeHallResult;
}

export function buildRocomExchangeText(payload: ExchangeHallResult): string {
  const lines = ['交换大厅', `页码：${payload.pageNo} / ${payload.totalPages}`, payload.refresh ? '模式：强制刷新' : '模式：普通查询', ''];

  payload.posters.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.userName} Lv.${item.userLevel} ${item.isOnline ? '[在线]' : '[离线]'}`);
    lines.push(`角色ID：${item.userId}`);
    lines.push(`需求：${item.wantText}`);
    if (item.provideItems.length > 0) {
      lines.push(`提供：${item.provideItems.join('、')}`);
    }
    lines.push(`发布时间：${item.timeLabel}${item.isExpired ? ' · 已过期' : ''}`);
    lines.push('');
  });

  return lines.join('\n').trim();
}
