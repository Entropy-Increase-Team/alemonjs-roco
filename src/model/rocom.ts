import { rocomHelpDefaultGroups, rocomModuleMeta } from '@src/data/rocom/defaults';
import { readRocomHelpConfig } from '@src/model/wegameResource';

type RocomHelpGroup = {
  groupTitle: string;
  menuItems: Array<{
    cmd: string;
    desc: string;
  }>;
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

export function getRocomCommandPrefixes(): string[] {
  const values = rocomModuleMeta.commandPrefixes;

  return values.map(item => normalizeText(item)).filter(Boolean);
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

export async function getRocomHelpGroups(): Promise<RocomHelpGroup[]> {
  const userGroups = normalizeMenuGroups(normalizeHelpConfig(await readRocomHelpConfig()));

  if (userGroups.length > 0) {
    return userGroups;
  }

  return rocomHelpDefaultGroups.map(group => ({
    groupTitle: group.groupTitle,
    menuItems: group.menuItems.map(item => ({
      cmd: item.cmd,
      desc: item.desc
    }))
  }));
}

export async function buildRocomHelpText(): Promise<string> {
  const groups = await getRocomHelpGroups();
  const lines = ['洛克王国世界帮助', `支持前缀：${getRocomCommandPrefixes().join(' / ')}`];

  for (const group of groups) {
    lines.push('');
    lines.push(`${group.groupTitle}：`);

    for (const item of group.menuItems) {
      lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
    }
  }

  return lines.join('\n');
}
