import { requestWeGame, resolveActiveWeGameCredential, type WeGameContext } from '@src/model/wegameAccount';

type LineupCard = {
  id: string;
  name: string;
  tags: string[];
  pets: Array<{
    name: string;
    imageUrl: string;
  }>;
  authorName: string;
  likes: number;
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

function parseLineupListArgs(rawText: string): { category: string; pageNo: number } {
  const raw = normalizeText(rawText);

  if (!raw) {
    return {
      category: '',
      pageNo: 1
    };
  }

  const tokens = raw.split(/\s+/u).filter(Boolean);
  const categoryTokens: string[] = [];
  let pageNo = 1;

  for (const token of tokens) {
    if (/^\d+$/u.test(token)) {
      pageNo = Number(token);
      continue;
    }

    categoryTokens.push(token);
  }

  if (pageNo < 1 || pageNo > 50) {
    throw new Error('页码仅支持 1-50');
  }

  return {
    category: categoryTokens.join(' ').trim(),
    pageNo
  };
}

function parseLineupId(rawText: string): string {
  const lineupId = normalizeText(rawText);

  if (!lineupId) {
    throw new Error('格式：+查看阵容 <阵容码>');
  }

  return lineupId;
}

function normalizeLineupCard(lineup: Record<string, unknown>): LineupCard {
  const lineupPets =
    lineup.lineup && typeof lineup.lineup === 'object' && !Array.isArray(lineup.lineup)
      ? ((lineup.lineup as Record<string, unknown>).pets as Array<Record<string, unknown>> | undefined)
      : [];

  return {
    id: normalizeText(lineup.id ?? lineup.code),
    name: normalizeText(lineup.name) || '未命名阵容',
    tags: Array.isArray(lineup.tags) ? lineup.tags.map(item => normalizeText(item)).filter(Boolean) : [],
    pets: Array.isArray(lineupPets)
      ? lineupPets
          .map(item => ({
            name: normalizeText(item?.localized_zh_name ?? item?.localizedZhName ?? item?.pet_name ?? item?.name),
            imageUrl: normalizeText(item?.pet_img_url ?? item?.image_url ?? item?.img_url ?? item?.pet_image ?? item?.pet_img ?? item?.avatar ?? item?.icon)
          }))
          .filter(item => item.name)
      : [],
    authorName: normalizeText(lineup.author_name) || '匿名作者',
    likes: toNumber(lineup.likes, 0)
  };
}

export async function getRocomLineupList(context: WeGameContext, rawArgs = '') {
  const args = parseLineupListArgs(rawArgs);
  const { credential } = await resolveActiveWeGameCredential(context);

  if (!credential?.frameworkToken) {
    throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
  }

  const params: Record<string, string> = {
    page_no: String(args.pageNo)
  };
  const accountType = resolveAccountType(credential.loginType);

  if (args.category) {
    params.category = args.category;
  }

  if (accountType) {
    params.account_type = accountType;
  }

  const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/lineup/list', {
    method: 'GET',
    headers: {
      'X-Framework-Token': credential.frameworkToken
    },
    params
  });
  const lineups = Array.isArray(payload.lineups) ? (payload.lineups as Array<Record<string, unknown>>) : [];

  if (lineups.length === 0) {
    throw new Error(args.pageNo > 1 ? '该页没有更多阵容数据了' : '当前没有可用的阵容数据');
  }

  return {
    category: args.category,
    pageNo: toNumber(payload.page_no, args.pageNo),
    totalPages: Math.max(1, toNumber(payload.total_pages, 1)),
    lineups: lineups.map(item => normalizeLineupCard(item))
  };
}

export function buildRocomLineupListText(payload: { category: string; pageNo: number; totalPages: number; lineups: LineupCard[] }): string {
  const lines = ['阵容助手', `页码：${payload.pageNo} / ${payload.totalPages}`];

  if (payload.category) {
    lines.push(`分类：${payload.category}`);
  }

  lines.push('');
  payload.lineups.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name}`);
    lines.push(`阵容码：${item.id}`);
    lines.push(`作者：${item.authorName} · 点赞：${item.likes}`);
    if (item.tags.length > 0) {
      lines.push(`标签：${item.tags.join(' / ')}`);
    }
    if (item.pets.length > 0) {
      lines.push(
        `成员：${item.pets
          .slice(0, 6)
          .map(pet => pet.name)
          .join('、')}`
      );
    }
    lines.push('');
  });

  lines.push('详情：+查看阵容 <阵容码>');

  return lines.join('\n').trim();
}

export async function getRocomLineupDetail(context: WeGameContext, rawArgs = '') {
  const lineupId = parseLineupId(rawArgs);
  const { credential } = await resolveActiveWeGameCredential(context);

  if (!credential?.frameworkToken) {
    throw new Error('当前没有可用的 WeGame 凭证，请先发送 #wgqq登陆 或 #wgwx登陆');
  }

  const accountType = resolveAccountType(credential.loginType);
  let totalPages = 1;

  for (let pageNo = 1; pageNo <= Math.min(totalPages, 10); pageNo += 1) {
    const params: Record<string, string> = {
      page_no: String(pageNo)
    };

    if (accountType) {
      params.account_type = accountType;
    }

    const payload = await requestWeGame<Record<string, unknown>>('/api/v1/games/rocom/lineup/list', {
      method: 'GET',
      headers: {
        'X-Framework-Token': credential.frameworkToken
      },
      params
    });
    const lineups = Array.isArray(payload.lineups) ? (payload.lineups as Array<Record<string, unknown>>) : [];

    totalPages = Math.max(1, toNumber(payload.total_pages, 1));

    const target = lineups.find(item => normalizeText(item.id) === lineupId);

    if (target) {
      return normalizeLineupCard(target);
    }
  }

  throw new Error(`未找到阵容码为 ${lineupId} 的阵容`);
}

export function buildRocomLineupDetailText(payload: LineupCard): string {
  return [
    payload.name,
    `阵容码：${payload.id}`,
    `作者：${payload.authorName}`,
    `点赞：${payload.likes}`,
    payload.tags.length > 0 ? `标签：${payload.tags.join(' / ')}` : '',
    payload.pets.length > 0 ? `成员：${payload.pets.map(pet => pet.name).join('、')}` : ''
  ]
    .filter(Boolean)
    .join('\n');
}
