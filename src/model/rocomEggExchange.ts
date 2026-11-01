import { requestWeGame } from '@src/model/wegameAccount';

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);

  return Number.isFinite(num) ? num : fallback;
}

function formatPostTime(value: unknown): string {
  const text = normalizeText(value);

  if (!text) {
    return '未知';
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return text;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export type EggExchangePost = Record<string, unknown>;

export function fetchEggExchanges(pageNo: number, userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/community/egg-exchanges', {
    method: 'GET',
    params: {
      page_no: String(pageNo),
      user_identifier: userIdentifier
    },
    headers: { 'X-User-Identifier': userIdentifier }
  });
}

export function postEggExchange(data: { have_text: string; want_text: string; remark?: string }, userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/community/egg-exchanges', {
    method: 'POST',
    data,
    headers: {
      'X-User-Identifier': userIdentifier,
      'Content-Type': 'application/json'
    }
  });
}

export function fetchMyEggExchanges(userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/community/egg-exchanges/my', {
    method: 'GET',
    params: { user_identifier: userIdentifier },
    headers: { 'X-User-Identifier': userIdentifier }
  });
}

export function closeEggExchange(postId: string, userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>(`/api/v1/games/rocom/community/egg-exchanges/${encodeURIComponent(postId)}/close`, {
    method: 'POST',
    data: { close_reason: 'cancel' },
    headers: {
      'X-User-Identifier': userIdentifier,
      'Content-Type': 'application/json'
    }
  });
}

export function createEggExchangeSubscription(filters: Record<string, string>, userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/community/egg-exchange-subscriptions', {
    method: 'POST',
    data: { filters },
    headers: {
      'X-User-Identifier': userIdentifier,
      'Content-Type': 'application/json'
    }
  });
}

export function fetchEggExchangeSubscriptions(userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/community/egg-exchange-subscriptions', {
    method: 'GET',
    params: { user_identifier: userIdentifier },
    headers: { 'X-User-Identifier': userIdentifier }
  });
}

export function deleteEggExchangeSubscription(subscriptionId: string, userIdentifier = ''): Promise<Record<string, unknown>> {
  return requestWeGame<Record<string, unknown>>(`/api/v1/games/rocom/community/egg-exchange-subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: 'DELETE',
    params: { user_identifier: userIdentifier },
    headers: { 'X-User-Identifier': userIdentifier }
  });
}

export function buildExchangeListText(items: EggExchangePost[], pageInfo: { page_no: number; total_pages: number; total: number }): string {
  if (items.length === 0) {
    return '当前没有换蛋帖。';
  }

  const lines = items.map((item, index) => {
    const pinned = normalizeText(item.pinned_until) ? '📌' : '';
    const id = normalizeText(item.id) || '?';
    const have = normalizeText(item.have_text) || '未填写';
    const want = normalizeText(item.want_text) || '未填写';
    const note = normalizeText(item.want_note);
    const remark = normalizeText(item.remark);
    const time = formatPostTime(item.created_at);

    let line = `${index + 1}. ${pinned}[${id}] 我有：${have} → 想要：${want}`;

    if (note) {
      line += `（${note}）`;
    }

    if (remark) {
      line += `\n   备注：${remark}`;
    }

    line += `  ${time}`;

    return line;
  });

  if (pageInfo.total_pages > 1) {
    lines.push(`第 ${pageInfo.page_no} 页 / 共 ${pageInfo.total_pages} 页（共 ${pageInfo.total} 条）`);
  }

  lines.push('');
  lines.push('用「+换蛋广场 <页码>」翻页');

  return lines.join('\n');
}

export function buildMyPostsText(items: EggExchangePost[]): string {
  if (items.length === 0) {
    return '你当前没有换蛋帖。';
  }

  const statusMap: Record<string, string> = {
    active: '✅ 生效中',
    closed: '🔒 已关闭',
    deleted: '❌ 已删除'
  };
  const reviewMap: Record<string, string> = {
    pending: '⏳ 待审核',
    manual_pending: '⏳ 人工审核中',
    approved: '✅ 已通过',
    rejected: '❌ 已拒绝'
  };

  const lines = items.map((item, index) => {
    const status = statusMap[normalizeText(item.status)] || normalizeText(item.status) || '未知';
    const review = reviewMap[normalizeText(item.review_status)] || normalizeText(item.review_status) || '未知';
    const have = normalizeText(item.have_text) || '未填写';
    const want = normalizeText(item.want_text) || '未填写';
    const postId = normalizeText(item.post_id);

    return `${index + 1}. [${postId}] 我有：${have} → 想要：${want}\n   状态：${status} | 审核：${review}`;
  });

  lines.push('');
  lines.push('用「+关闭换蛋帖 <帖子ID>」关闭帖子');

  return lines.join('\n');
}

/** 解析「订阅换蛋」筛选条件：想要:上岸蛙 补充:固执 学号:123 */
export function parseSubscribeFilters(raw = ''): Record<string, string> {
  const filters: Record<string, string> = {};
  const tokens = normalizeText(raw).split(/\s+/u).filter(Boolean);

  for (const token of tokens) {
    const colonMatch = token.match(/^(.+?)[:：](.+)$/u);

    if (colonMatch) {
      const key = normalizeText(colonMatch[1]);
      const value = normalizeText(colonMatch[2]);
      const keyMap: Record<string, string> = {
        想要: 'want_text',
        我有: 'have_text',
        补充: 'want_note',
        学号: 'id',
        搜索: 'q'
      };
      const mappedKey = keyMap[key] || key;

      if (mappedKey && value) {
        filters[mappedKey] = value;
      }

      continue;
    }

    if (token) {
      filters.want_text = filters.want_text ? `${filters.want_text} ${token}` : token;
    }
  }

  return filters;
}

export function parseExchangePageArg(raw: string): number {
  const text = normalizeText(raw);

  if (!text) {
    return 1;
  }

  const pageNo = toNumber(text, 0);

  if (pageNo < 1) {
    throw new Error('页码必须大于等于 1');
  }

  if (pageNo > 50) {
    throw new Error('页码暂仅支持到 50');
  }

  return pageNo;
}
