import { rocomHelpDefaultGroups, rocomModuleMeta } from '@src/data/rocom/defaults';
import { readRocomHelpConfig } from '@src/model/wegameResource';

type RocomHelpGroup = {
  groupTitle: string;
  menuItems: Array<{
    cmd: string;
    desc: string;
  }>;
};

type HelpCardItem = {
  title: string;
  desc: string;
  example: string;
};

type HelpCardCategory = {
  title: string;
  items: HelpCardItem[];
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

export function getRocomCommandPrefixes(): string[] {
  const values = rocomModuleMeta.commandPrefixes;

  return values.map(item => normalizeText(item)).filter(Boolean);
}

function buildRocoMainHelpSubtitle(): string {
  return '支持前缀：+ / #roco / #洛克 / #洛克王国';
}

function normalizeMenuGroups(groups: Array<Record<string, unknown>>): RocomHelpGroup[] {
  return groups
    .map(group => ({
      groupTitle: normalizeText(group.group ?? '常用命令'),
      menuItems: Array.isArray(group.list)
        ? group.list
            .map(item => {
              const row = item as Record<string, unknown>;

              return {
                cmd: normalizeText(row.title),
                desc: normalizeText(row.desc)
              };
            })
            .filter(item => item.cmd || item.desc)
        : []
    }))
    .filter(group => group.groupTitle || group.menuItems.length > 0);
}

function normalizeHelpConfig(input: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(input)) {
    return input.filter(item => item && typeof item === 'object') as Array<Record<string, unknown>>;
  }

  if (!input || typeof input !== 'object') {
    return [];
  }

  const groups = (input as Record<string, unknown>).groups;

  return Array.isArray(groups) ? (groups.filter(item => item && typeof item === 'object') as Array<Record<string, unknown>>) : [];
}

function getDefaultRocomHelpGroups(): RocomHelpGroup[] {
  return rocomHelpDefaultGroups.map(group => ({
    groupTitle: group.groupTitle,
    menuItems: group.menuItems.map(item => ({
      cmd: item.cmd,
      desc: item.desc
    }))
  }));
}

export async function getRocomHelpGroups(): Promise<RocomHelpGroup[]> {
  const userGroups = normalizeMenuGroups(normalizeHelpConfig(await readRocomHelpConfig()));

  if (userGroups.length > 0) {
    return userGroups;
  }

  return getDefaultRocomHelpGroups();
}

function toHelpCardCategories(groups: RocomHelpGroup[]): HelpCardCategory[] {
  return groups.map(group => ({
    title: group.groupTitle,
    items: group.menuItems.map(item => ({
      title: item.cmd,
      desc: item.desc,
      example: item.cmd
    }))
  }));
}

function findHelpGroups(groups: RocomHelpGroup[], titles: string[]): RocomHelpGroup[] {
  const titleSet = new Set(titles);

  return groups.filter(group => titleSet.has(group.groupTitle));
}

function hasMenuItems(groups: RocomHelpGroup[]): boolean {
  return groups.some(group => group.menuItems.length > 0);
}

function pickRocoMainGroups(groups: RocomHelpGroup[]): RocomHelpGroup[] {
  const exact = findHelpGroups(groups, ['洛克王国世界']);

  if (hasMenuItems(exact)) {
    const wikiGroups = findHelpGroups(groups, ['图鉴资料']);

    if (hasMenuItems(wikiGroups)) {
      return [...exact, ...wikiGroups];
    }

    return exact;
  }

  const filtered = groups.filter(group => !['WeGame 登录', 'WeGame 管理'].includes(group.groupTitle));

  if (hasMenuItems(filtered)) {
    return filtered;
  }

  return groups;
}

async function getResolvedRocoMainGroups(): Promise<RocomHelpGroup[]> {
  const groups = await getRocomHelpGroups();
  const picked = pickRocoMainGroups(groups);

  if (hasMenuItems(picked)) {
    return picked;
  }

  return pickRocoMainGroups(getDefaultRocomHelpGroups());
}

export async function buildRocomHelpText(): Promise<string> {
  const groups = await getRocomHelpGroups();
  const lines = ['洛克王国世界帮助', buildRocoMainHelpSubtitle()];

  for (const group of groups) {
    lines.push('');
    lines.push(`${group.groupTitle}：`);

    for (const item of group.menuItems) {
      lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
    }
  }

  return lines.join('\n');
}

export function buildRocoMainHelpText(): Promise<string> {
  return (async () => {
    const groups = await getResolvedRocoMainGroups();
    const lines = ['洛克王国世界帮助', buildRocoMainHelpSubtitle()];

    for (const group of groups) {
      lines.push('');
      lines.push(`${group.groupTitle}：`);

      for (const item of group.menuItems) {
        lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
      }
    }

    return lines.join('\n');
  })();
}

export function buildRocoWikiHelpText(): Promise<string> {
  return buildRocoMainHelpText();
}

export async function getRocomHelpCardData() {
  const groups = await getRocomHelpGroups();
  const subtitle = buildRocoMainHelpSubtitle();

  return {
    title: '洛克王国世界帮助',
    subtitle,
    prefixTitle: '支持前缀',
    prefixText: subtitle.replace(/^支持前缀：/, ''),
    footerBrand: 'ALemonJS & WeGame Roco Kingdom Plugin',
    footerNote: 'ALemonJS & WeGame Roco Kingdom Plugin',
    categories: toHelpCardCategories(groups)
  };
}

export async function getWeGameHelpCardData() {
  const groups = await getRocomHelpGroups();
  const picked = findHelpGroups(groups, ['WeGame 登录', 'WeGame 管理']);

  return {
    title: 'WeGame 帮助',
    subtitle: '默认前缀：#wg',
    prefixTitle: '支持前缀',
    prefixText: '#wg',
    footerBrand: 'ALemonJS & WeGame Roco Kingdom Plugin',
    footerNote: 'ALemonJS & WeGame Roco Kingdom Plugin',
    categories: toHelpCardCategories(picked)
  };
}

export function getRocoWikiHelpCardData() {
  return getRocoMainHelpCardData();
}

export async function getRocoMainHelpCardData() {
  const picked = await getResolvedRocoMainGroups();
  const subtitle = buildRocoMainHelpSubtitle();

  return {
    title: '洛克王国世界帮助',
    subtitle,
    prefixTitle: '支持前缀',
    prefixText: subtitle.replace(/^支持前缀：/, ''),
    footerBrand: 'ALemonJS & WeGame Roco Kingdom Plugin',
    footerNote: 'ALemonJS & WeGame Roco Kingdom Plugin',
    categories: toHelpCardCategories(picked)
  };
}
