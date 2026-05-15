import { commandKeyConfig } from '@src/constants/commandKeys';
import { Router } from 'alemonjs';

const router = Router.create({
  events: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
});

const baseGroup = router.group({
  routeText: {
    prefixes: [...commandKeyConfig.basePrefixes],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 1
  }
});

const rocoQuickGroup = router.group({
  routeText: {
    prefixes: [commandKeyConfig.plusPrefix],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 1
  }
});

function registerBaseAliases(paths: string[], importer: () => Promise<unknown>) {
  for (const path of paths) {
    baseGroup.use(path, importer);
  }
}

function registerQuickAliases(paths: string[], importer: () => Promise<unknown>) {
  for (const path of paths) {
    rocoQuickGroup.use(path, importer);
  }
}

function buildNamespacedKeys(namespaces: readonly string[], suffixes: readonly string[]) {
  return namespaces.flatMap(namespace => suffixes.map(suffix => `${namespace}${suffix}`));
}

const rocoNamespaces = commandKeyConfig.rocoNamespaces;
const wgNamespaces = commandKeyConfig.wegameNamespaces;

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['帮助', 'help', '菜单']), () => import('@src/response/rocomHelp'));
registerQuickAliases(['帮助', 'help', '菜单'], () => import('@src/response/rocomHelp'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['账号列表']), () => import('@src/response/rocomAccounts'));
registerQuickAliases(['账号列表'], () => import('@src/response/rocomAccounts'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['档案']), () => import('@src/response/rocomProfile'));
registerQuickAliases(['档案'], () => import('@src/response/rocomProfile'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['uid', 'UID']), () => import('@src/response/rocomSearch'));
registerQuickAliases(['uid', 'UID'], () => import('@src/response/rocomSearch'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['家园', 'home', '刷新家园', 'rehome']), () => import('@src/response/rocomHome'));
registerQuickAliases(['家园', 'home', '刷新家园', 'rehome'], () => import('@src/response/rocomHome'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['大赛战绩', '战绩']), () => import('@src/response/rocomRecord'));
registerQuickAliases(['大赛战绩', '战绩'], () => import('@src/response/rocomRecord'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['精灵列表']), () => import('@src/response/rocomPets'));
registerQuickAliases(['精灵列表'], () => import('@src/response/rocomPets'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['查看阵容', '阵容详情', '阵容']), () => import('@src/response/rocomLineup'));
registerQuickAliases(['查看阵容', '阵容详情', '阵容'], () => import('@src/response/rocomLineup'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['交换大厅', '大厅']), () => import('@src/response/rocomExchange'));
registerQuickAliases(['交换大厅', '大厅'], () => import('@src/response/rocomExchange'));

registerBaseAliases(
  buildNamespacedKeys(rocoNamespaces, ['订阅远行商人', '订阅旅行商人', '取消订阅远行商人', '取消订阅旅行商人']),
  () => import('@src/response/rocomMerchantSubscription')
);
registerQuickAliases(['订阅远行商人', '订阅旅行商人', '取消订阅远行商人', '取消订阅旅行商人'], () => import('@src/response/rocomMerchantSubscription'));

registerBaseAliases(
  buildNamespacedKeys(rocoNamespaces, ['尺寸查询', '精灵尺寸', '远行商人', '旅行商人', '商人信息']),
  () => import('@src/response/rocomTools')
);
registerQuickAliases(['尺寸查询', '精灵尺寸', '远行商人', '旅行商人', '商人信息'], () => import('@src/response/rocomTools'));

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['查蛋', '精灵查蛋', '配种']), () => import('@src/response/rocomEggs'));
registerQuickAliases(['查蛋', '精灵查蛋', '配种'], () => import('@src/response/rocomEggs'));

for (const path of buildNamespacedKeys(rocoNamespaces, ['图鉴'])) {
  baseGroup.use(
    {
      path,
      schema: {
        usage: '#洛克图鉴 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
      }
    },
    () => import('@src/response/petDetail')
  );
}

for (const path of buildNamespacedKeys(rocoNamespaces, ['查询'])) {
  baseGroup.use(
    {
      path,
      schema: {
        usage: '#洛克查询 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
      }
    },
    () => import('@src/response/petDetail')
  );
}

for (const path of buildNamespacedKeys(rocoNamespaces, ['cw'])) {
  baseGroup.use(
    {
      path,
      schema: {
        usage: '#洛克cw <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
      }
    },
    () => import('@src/response/petDetail')
  );
}

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['宠物', '宠物列表', '精灵', 'cwlb']), () => import('@src/response/petList'));

for (const path of buildNamespacedKeys(rocoNamespaces, ['技能'])) {
  baseGroup.use(
    {
      path,
      schema: {
        usage: '#洛克技能 <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
      }
    },
    () => import('@src/response/skillSearch')
  );
}

for (const path of buildNamespacedKeys(rocoNamespaces, ['jn'])) {
  baseGroup.use(
    {
      path,
      schema: {
        usage: '#洛克jn <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
      }
    },
    () => import('@src/response/skillSearch')
  );
}

registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['活动', '日历', 'hdrl']), () => import('@src/response/active'));
registerBaseAliases(buildNamespacedKeys(rocoNamespaces, ['公告']), () => import('@src/response/announcement'));

registerBaseAliases(buildNamespacedKeys(wgNamespaces, ['帮助', 'help', '菜单']), () => import('@src/response/wegameHelp'));
registerBaseAliases(buildNamespacedKeys(wgNamespaces, ['配置']), () => import('@src/response/wegameConfig'));
registerBaseAliases(buildNamespacedKeys(wgNamespaces, ['模块下载']), () => import('@src/response/wegameModuleDownload'));
registerBaseAliases(buildNamespacedKeys(wgNamespaces, ['模块']), () => import('@src/response/wegameModules'));
registerBaseAliases(buildNamespacedKeys(wgNamespaces, ['更新']), () => import('@src/response/wegameUpdate'));
registerBaseAliases(buildNamespacedKeys(wgNamespaces, ['qq登陆', 'wx登陆', '账号列表']), () => import('@src/response/wegameAccount'));

for (const path of buildNamespacedKeys(wgNamespaces, ['切换账号'])) {
  baseGroup.use(
    {
      path,
      schema: {
        usage: '#wg切换账号 <序号>',
        args: [{ name: 'index', rules: [{ required: true }] }]
      }
    },
    () => import('@src/response/wegameAccount')
  );
}

for (const path of buildNamespacedKeys(wgNamespaces, ['删除账号'])) {
  baseGroup.use(
    {
      path,
      schema: {
        usage: '#wg删除账号 <序号>',
        args: [{ name: 'index', rules: [{ required: true }] }]
      }
    },
    () => import('@src/response/wegameAccount')
  );
}

export default router.define;
