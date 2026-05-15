import rocomDefaultConfig from './config_default.yaml';
import rocomHelpDefaultConfig from './rocom_help_default.yaml';
import { storeKeys } from '@src/constants/storeKeys';

type RocomHelpGroup = {
  group: string;
  list: Array<{
    title: string;
    desc: string;
  }>;
};

function normalizeText(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizeRocomHelpGroups(input: unknown): RocomHelpGroup[] {
  const groups = Array.isArray(input)
    ? input
    : input && typeof input === 'object' && Array.isArray((input as Record<string, unknown>).groups)
      ? ((input as Record<string, unknown>).groups as unknown[])
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
                title: normalizeText(row.title),
                desc: normalizeText(row.desc)
              };
            })
            .filter((entry): entry is { title: string; desc: string } => Boolean(entry))
        : [];

      return {
        group: normalizeText(group.group),
        list
      };
    })
    .filter((group): group is RocomHelpGroup => Boolean(group));
}

export const rocomDefaultConfigData = rocomDefaultConfig as unknown as Record<string, unknown>;

export const rocomModuleMeta = {
  code: 'rocom',
  name: '洛克',
  description: '洛克业务模块，提供档案、家园、战绩、阵容、交换大厅、查蛋与远行商人订阅能力。',
  version: '0.2.1',
  apiDoc: 'modules/rocom/Rocom-API.md',
  commandPrefixes: ['+', '#roco', '＃roco', '/roco', '#洛克', '＃洛克', '/洛克', '#洛克王国', '＃洛克王国', '/洛克王国'] as string[],
  commands: [
    '#洛克帮助',
    '#洛克账号列表',
    '#洛克档案',
    '#洛克uid',
    '#洛克家园',
    '#洛克刷新家园',
    '#洛克战绩',
    '#洛克精灵列表',
    '#洛克阵容',
    '#洛克查看阵容',
    '#洛克交换大厅',
    '#洛克尺寸查询',
    '#洛克远行商人',
    '#洛克订阅远行商人',
    '#洛克取消订阅远行商人',
    '#洛克查蛋',
    '#洛克配种'
  ],
  help: {
    title: '#洛克帮助',
    desc: '查看洛克帮助；也可使用 +帮助'
  },
  config: {
    storeKey: storeKeys.config.rocom
  }
} as const;

const rocomHelpYamlGroups = normalizeRocomHelpGroups(rocomHelpDefaultConfig);

export const rocomHelpDefaultGroups = rocomHelpYamlGroups.map(group => ({
  groupTitle: group.group,
  menuItems: group.list.map(item => ({
    cmd: item.title,
    desc: item.desc
  }))
}));
