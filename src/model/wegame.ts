import { rocomModuleMeta } from '@src/data/rocom/defaults';

const WEGAME_PREFIX = '#wg';

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

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function formatCommand(command = ''): string {
  return `${WEGAME_PREFIX}${normalizeText(command)}`;
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

export function getInstalledWeGameModules(): Array<WeGameModuleMeta & { installed: true; enabled: true }> {
  return getBuiltinWeGameModules().map(({ source: _source, ...item }) => item);
}

export function buildWeGameHelpText(): string {
  const installed = getInstalledWeGameModules();

  if (installed.length > 0) {
    const helpItems = installed
      .map(item => {
        const title = item.help?.title ?? item.commands.find(command => /(帮助|help)/i.test(command)) ?? `${item.name}帮助`;
        const desc = item.help?.desc ?? `${item.name}帮助`;

        return `- ${title} | ${desc}`;
      })
      .join('\n');

    const lines = [
      '当前应用已内建以下游戏能力，优先使用对应模块帮助：',
      helpItems,
      '',
      'WeGame 核心命令：',
      `- ${formatCommand('帮助')} | 查看帮助`,
      `- ${formatCommand('qq登陆')} | 使用 QQ 扫码登录 WeGame`,
      `- ${formatCommand('wx登陆')} | 使用微信扫码登录 WeGame`,
      `- ${formatCommand('账号列表')} | 查看当前已绑定 WeGame 账号`,
      `- ${formatCommand('模块')} | 查看当前应用已接入模块`
    ];

    return lines.join('\n');
  }

  const lines = [
    'WeGame 帮助',
    `- ${formatCommand('帮助')} | 查看帮助`,
    `- ${formatCommand('qq登陆')} | 使用 QQ 扫码登录 WeGame`,
    `- ${formatCommand('wx登陆')} | 使用微信扫码登录 WeGame`,
    `- ${formatCommand('账号列表')} | 查看当前已绑定 WeGame 账号`
  ];

  return lines.join('\n');
}

export function buildWeGameCatalogText(): string {
  const lines = ['当前应用已接入的游戏模块', ''];
  const installed = getBuiltinWeGameModules();

  if (installed.length === 0) {
    lines.push('暂无。');

    return lines.join('\n');
  }

  for (const item of installed) {
    lines.push(`- ${item.code} | ${item.name} | 应用内建模块`);
  }

  lines.push('');
  lines.push('当前应用是功能服务型应用，不提供仓库下载、模块拉取或 Git 更新管理。');

  return lines.join('\n');
}

export function buildWeGameModuleManagementDisabledText(action: 'download' | 'update'): string {
  return action === 'download'
    ? ['当前应用是功能服务型应用，不提供模块仓库下载。', `可用命令：${formatCommand('模块')} 查看当前已接入模块。`].join('\n')
    : ['当前应用是功能服务型应用，不负责仓库或模块更新管理。', '如需更新能力，请更新应用发布版本或使用单独的管理型工具。'].join('\n');
}

export { WEGAME_PREFIX };
