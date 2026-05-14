import { isHttpOk, requestText } from '@src/model/http';

/** 公告条目 */
export interface AnnouncementItem {
  id: number;
  title: string;
  date: string;
  category: '最新' | '公告' | '资讯' | '活动';
}

/** 公告详情 */
export interface AnnouncementDetail {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
  coverUrl: string;
  tagIds: string;
}

/** 公告分类 tag ID 映射 */
// const TAG_MAP: Record<string, AnnouncementItem['category']> = {
//   135110: '最新',
//   135111: '公告',
//   135112: '资讯',
//   135113: '活动'
// };

/** 分类名称 → tag ID */
export const CATEGORY_TAG_MAP: Record<string, string> = {
  最新: '135110',
  公告: '135111',
  资讯: '135112',
  活动: '135113'
};

/** API JSONP 响应中的单条新闻 */
interface NewsItem {
  iNewsId: number;
  sTitle: string;
  sIdxTime: string;
  sTagIds: string;
}

/** 详情 API 响应结构 */
interface DetailResponse {
  status: number;
  msg: {
    iNewsId: number;
    sTitle: string;
    sIdxTime: string;
    sAuthor: string;
    sContent: string;
    sIMG: string;
    sTagIds: string;
  };
}

/** API JSONP 响应结构 */
interface NewsResponse {
  status: number;
  msg: {
    total: number;
    pagesize: number;
    totalpage: number;
    page: number;
    result: NewsItem[];
  };
}

const API_BASE = 'https://apps.game.qq.com/wmp/v3.1/';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';

function buildUrl(tagId: string, page: number, pageSize: number): string {
  const ts = Date.now();
  const params = new URLSearchParams({
    p0: '467',
    p1: 'searchNewsKeywordsList',
    page: String(page),
    pagesize: String(pageSize),
    order: 'sIdxTime',
    r0: 'script',
    r1: `NewsObj${ts}`,
    type: 'iTag',
    id: tagId,
    source: 'web_pc'
  });

  return `${API_BASE}?${params.toString()}`;
}

function parseJsonp<T>(text: string): T {
  // 去掉 "var xxxObj=" 前缀和结尾分号
  const json = text.replace(/^var\s+\w+=/, '').replace(/;?\s*$/, '');

  return JSON.parse(json) as T;
}

/** 分类优先级（越靠前优先级越高） */
const CATEGORY_PRIORITY: { id: string; category: AnnouncementItem['category'] }[] = [
  { id: '135111', category: '公告' },
  { id: '135113', category: '活动' },
  { id: '135112', category: '资讯' },
  { id: '135110', category: '最新' }
];

function resolveCategory(tagIds: string): AnnouncementItem['category'] {
  const ids = new Set(tagIds.split(','));

  for (const { id, category } of CATEGORY_PRIORITY) {
    if (ids.has(id)) {
      return category;
    }
  }

  return '公告';
}

/**
 * 从官方 API 获取公告列表
 * @param tagId 分类 tag, 默认 135110(最新), 135111(公告), 135112(资讯), 135113(活动)
 */
export async function fetchAnnouncements(tagId = '135110', page = 1, pageSize = 6): Promise<{ items: AnnouncementItem[]; total: number; totalPages: number }> {
  const url = buildUrl(tagId, page, pageSize);

  const res = await requestText({
    url,
    method: 'GET',
    headers: {
      'User-Agent': USER_AGENT,
      Referer: 'https://rocom.qq.com/',
      Accept: '*/*'
    },
    timeout: 15000
  });

  if (!isHttpOk(res.status)) {
    throw new Error(`公告 API 请求失败: HTTP ${res.status}`);
  }

  const text = res.data;
  const data = parseJsonp<NewsResponse>(text);

  if (data.status !== 0) {
    throw new Error(`公告 API 返回错误: status=${data.status}`);
  }

  const items: AnnouncementItem[] = data.msg.result.map(item => ({
    id: item.iNewsId,
    title: item.sTitle,
    date: item.sIdxTime,
    category: resolveCategory(item.sTagIds)
  }));

  return {
    items,
    total: data.msg.total,
    totalPages: data.msg.totalpage
  };
}

/**
 * 获取单条公告详情
 * @param id 文章 ID (iNewsId)
 */
export async function fetchAnnouncementDetail(id: number): Promise<AnnouncementDetail> {
  const params = new URLSearchParams({
    p0: '467',
    source: 'web_pc',
    id: String(id)
  });

  const url = `${API_BASE}public/searchNews.php?${params.toString()}`;

  const res = await requestText({
    url,
    method: 'GET',
    headers: {
      'User-Agent': USER_AGENT,
      Referer: 'https://rocom.qq.com/',
      Accept: '*/*'
    },
    timeout: 15000
  });

  if (!isHttpOk(res.status)) {
    throw new Error(`公告详情 API 请求失败: HTTP ${res.status}`);
  }

  const text = res.data;
  const data = parseJsonp<DetailResponse>(text);

  if (data.status !== 0) {
    throw new Error(`公告详情 API 返回错误: status=${data.status}`);
  }

  const msg = data.msg;

  return {
    id: msg.iNewsId,
    title: msg.sTitle,
    date: msg.sIdxTime,
    author: msg.sAuthor,
    content: msg.sContent,
    coverUrl: msg.sIMG.startsWith('//') ? `https:${msg.sIMG}` : msg.sIMG,
    tagIds: msg.sTagIds
  };
}
