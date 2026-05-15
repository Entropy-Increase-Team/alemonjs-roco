import { rocomModuleMeta } from '@src/data/rocom/defaults';
import { wegameHelpDefaultConfigData } from '@src/data/wegame/defaults';

const WEGAME_PREFIX = '#wg';
const WEGAME_HELP_PREFIX = '/wg';

type WeGameModuleMeta = {
  code: string;
  name: string;
  description: string;
  version: string;
  commandPrefixes: readonly string[];
  commands: readonly string[];
  help: {
    title: string;
    desc: string;
  } | null;
};

type InstalledWeGameModule = WeGameModuleMeta & {
  installed: true;
  enabled: true;
  source: 'builtin';
};

type WeGameHelpGroup = {
  groupTitle: string;
  menuItems: Array<{
    cmd: string;
    desc: string;
  }>;
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function formatCommand(command = ''): string {
  return `${WEGAME_PREFIX}${normalizeText(command)}`;
}

function formatHelpCommand(command = ''): string {
  const text = normalizeText(command);

  if (!text) {
    return WEGAME_HELP_PREFIX;
  }

  return text.replace(/^#wg/u, WEGAME_HELP_PREFIX);
}

function getBuiltinWeGameModules(): InstalledWeGameModule[] {
  return [
    {
      ...rocomModuleMeta,
      installed: true as const,
      enabled: true as const,
      source: 'builtin' as const
    }
  ];
}

function normalizeHelpGroups(input: unknown): WeGameHelpGroup[] {
  const groups =
    input && typeof input === 'object' && !Array.isArray(input) && Array.isArray((input as Record<string, unknown>).help_group)
      ? ((input as Record<string, unknown>).help_group as unknown[])
      : [];

  return groups
    .map(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return null;
      }

      const group = item as Record<string, unknown>;
      const list = Array.isArray(group.list)
        ? group.list
            .map(entry => {
              if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                return null;
              }

              const row = entry as Record<string, unknown>;

              return {
                cmd: formatHelpCommand(normalizeText(row.title)),
                desc: normalizeText(row.desc)
              };
            })
            .filter((entry): entry is { cmd: string; desc: string } => Boolean(entry))
        : [];

      return {
        groupTitle: normalizeText(group.group),
        menuItems: list
      };
    })
    .filter((group): group is WeGameHelpGroup => Boolean(group));
}

function getWeGameHelpGroups(): WeGameHelpGroup[] {
  return normalizeHelpGroups(wegameHelpDefaultConfigData);
}

export function buildWeGameHelpText(): string {
  const groups = getWeGameHelpGroups();
  const lines = ['WeGame 帮助', `默认前缀：${WEGAME_HELP_PREFIX}`];

  for (const group of groups) {
    lines.push('');
    lines.push(`${group.groupTitle}：`);

    for (const item of group.menuItems) {
      lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
    }
  }

  return lines.join('\n');
}

export function buildWeGameInstalledModuleHintText(): string {
  return [
    '已安装游戏组件，常用核心命令：',
    '`#wg更新` - 更新 WeGame 核心插件与全部已安装模块',
    '`#wg更新 [模块名]` - 仅更新指定模块',
    '更多帮助请查看 +帮助'
  ].join('\n');
}

export function getWeGameHelpCardData() {
  const groups = getWeGameHelpGroups();

  return {
    title: 'WeGame 帮助',
    subtitle: `默认前缀：${WEGAME_HELP_PREFIX}`,
    prefixTitle: '默认前缀',
    prefixText: WEGAME_HELP_PREFIX,
    footerBrand: 'WeGame-plugin',
    footerNote: 'WeGame-plugin',
    categories: groups.map(group => ({
      title: group.groupTitle,
      items: group.menuItems.map(item => ({
        title: item.cmd,
        desc: item.desc,
        example: item.cmd
      }))
    }))
  };
}

export function getInstalledWeGameModules(): Array<WeGameModuleMeta & { installed: true; enabled: true }> {
  return getBuiltinWeGameModules().map(({ source: _source, ...item }) => item);
}

export function hasInstalledWeGameModules(): boolean {
  return getBuiltinWeGameModules().length > 0;
}

export function buildWeGameCatalogText(): string {
  const lines = ['WeGame 模块列表', '仓库：当前应用内建模块', '默认分支：当前应用发布版本', ''];
  const installed = getBuiltinWeGameModules();

  lines.push('已安装模块：');

  if (installed.length === 0) {
    lines.push('暂无');

    return lines.join('\n');
  }

  for (const item of installed) {
    lines.push(`- ${item.code} | ${item.name}`);
  }

  lines.push('');
  lines.push('远程可下载模块：');
  lines.push('当前应用不提供远程模块仓库。');
  lines.push('');
  lines.push(`下载命令：${formatCommand('模块下载 <模块名>')}`);
  lines.push(`更新命令：${formatCommand('更新 [模块名]')}`);

  return lines.join('\n');
}

export function buildWeGameModuleManagementDisabledText(action: 'download' | 'update'): string {
  return action === 'download'
    ? ['当前应用不提供模块仓库下载。', `可发送 ${formatCommand('模块')} 查看当前已接入模块。`, '如需新增能力，请更新当前应用版本。'].join('\n')
    : ['当前应用不负责仓库或模块在线更新。', '如需更新能力，请更新当前应用发布版本。', `可发送 ${formatCommand('模块')} 查看当前已接入模块。`].join('\n');
}

export { WEGAME_PREFIX };
