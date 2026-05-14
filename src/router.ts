import { Router } from 'alemonjs';

/**
 * 洛克王国宠物图鉴机器人
 *
 * #roco帮助 / #rk帮助
 * #roco图鉴 迪莫
 * #roco宠物 / #洛克宠物 火
 * #roco技能 闪光冲击 *
 *
 * --- 预计新增一下功能
 * --- 来源 bilibili wiki https://wiki.biligame.com/rocom/%E9%A6%96%E9%A1%B5
 * #roco属性克制
 * #roco阵容搭配
 * #roco任务一览
 * #roco副本挑战
 * #roco精灵图鉴
 * #roco物品图鉴
 * #roco技能图鉴
 * #roco活动
 * #roco攻略
 * #roco阵容
 * #roco升级经验表
 */

const router = Router.create({
  events: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
});

const rocomGroup = router.group({
  routeText: {
    prefixes: ['+', '#洛克王国世界', '#洛克世界', '#洛克'],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 2
  }
});

const wegameGroup = router.group({
  routeText: {
    prefixes: ['#wg', '＃wg', '!wg', '！wg', '/wg'],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 2
  }
});

const rocoLegacyGroup = router.group({
  routeText: {
    prefixes: ['#roco', '＃roco', '!roco', '！roco', '/roco', '#洛克', '＃洛克', '!洛克', '！洛克', '/洛克'],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 1
  }
});

const rocoHelpGroup = router.group({
  routeText: {
    prefixes: ['#roco', '＃roco', '!roco', '！roco', '/roco'],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 1
  }
});

rocomGroup.use('帮助', () => import('@src/response/rocomHelp'));
rocomGroup.use('help', () => import('@src/response/rocomHelp'));
rocomGroup.use('菜单', () => import('@src/response/rocomHelp'));
rocomGroup.use('账号列表', () => import('@src/response/rocomAccounts'));
rocomGroup.use('档案', () => import('@src/response/rocomProfile'));
rocomGroup.use('uid', () => import('@src/response/rocomSearch'));
rocomGroup.use('UID', () => import('@src/response/rocomSearch'));
rocomGroup.use('家园', () => import('@src/response/rocomHome'));
rocomGroup.use('home', () => import('@src/response/rocomHome'));
rocomGroup.use('刷新家园', () => import('@src/response/rocomHome'));
rocomGroup.use('rehome', () => import('@src/response/rocomHome'));
rocomGroup.use('大赛战绩', () => import('@src/response/rocomRecord'));
rocomGroup.use('战绩', () => import('@src/response/rocomRecord'));
rocomGroup.use('精灵列表', () => import('@src/response/rocomPets'));
rocomGroup.use('查看阵容', () => import('@src/response/rocomLineup'));
rocomGroup.use('阵容详情', () => import('@src/response/rocomLineup'));
rocomGroup.use('阵容', () => import('@src/response/rocomLineup'));
rocomGroup.use('交换大厅', () => import('@src/response/rocomExchange'));
rocomGroup.use('大厅', () => import('@src/response/rocomExchange'));
rocomGroup.use('订阅远行商人', () => import('@src/response/rocomMerchantSubscription'));
rocomGroup.use('订阅旅行商人', () => import('@src/response/rocomMerchantSubscription'));
rocomGroup.use('取消订阅远行商人', () => import('@src/response/rocomMerchantSubscription'));
rocomGroup.use('取消订阅旅行商人', () => import('@src/response/rocomMerchantSubscription'));
rocomGroup.use('尺寸查询', () => import('@src/response/rocomTools'));
rocomGroup.use('精灵尺寸', () => import('@src/response/rocomTools'));
rocomGroup.use('远行商人', () => import('@src/response/rocomTools'));
rocomGroup.use('旅行商人', () => import('@src/response/rocomTools'));
rocomGroup.use('商人信息', () => import('@src/response/rocomTools'));
rocomGroup.use('查蛋', () => import('@src/response/rocomEggs'));
rocomGroup.use('精灵查蛋', () => import('@src/response/rocomEggs'));
rocomGroup.use('配种', () => import('@src/response/rocomEggs'));
rocoLegacyGroup.use(
  {
    path: '图鉴',
    schema: {
      usage: '#roco图鉴 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
rocoLegacyGroup.use(
  {
    path: '查询',
    schema: {
      usage: '#roco查询 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
rocoLegacyGroup.use(
  {
    path: 'cw',
    schema: {
      usage: '#rococw <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
rocoLegacyGroup.use('宠物', () => import('@src/response/petList'));
rocoLegacyGroup.use('宠物列表', () => import('@src/response/petList'));
rocoLegacyGroup.use('精灵', () => import('@src/response/petList'));
rocoLegacyGroup.use('cwlb', () => import('@src/response/petList'));
rocoLegacyGroup.use(
  {
    path: '技能',
    schema: {
      usage: '#roco技能 <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
rocoLegacyGroup.use(
  {
    path: 'jn',
    schema: {
      usage: '#rocojn <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
rocoLegacyGroup.use('活动', () => import('@src/response/active'));
rocoLegacyGroup.use('日历', () => import('@src/response/active'));
rocoLegacyGroup.use('hdrl', () => import('@src/response/active'));
rocoLegacyGroup.use('公告', () => import('@src/response/announcement'));
rocoHelpGroup.use('帮助', () => import('@src/response/help'));
rocoHelpGroup.use('help', () => import('@src/response/help'));

wegameGroup.use('帮助', () => import('@src/response/wegameHelp'));
wegameGroup.use('help', () => import('@src/response/wegameHelp'));
wegameGroup.use('菜单', () => import('@src/response/wegameHelp'));
wegameGroup.use('配置', () => import('@src/response/wegameConfig'));
wegameGroup.use('模块下载', () => import('@src/response/wegameModuleDownload'));
wegameGroup.use('模块', () => import('@src/response/wegameModules'));
wegameGroup.use('更新', () => import('@src/response/wegameUpdate'));
wegameGroup.use('qq登陆', () => import('@src/response/wegameAccount'));
wegameGroup.use('wx登陆', () => import('@src/response/wegameAccount'));
wegameGroup.use('账号列表', () => import('@src/response/wegameAccount'));
wegameGroup.use(
  {
    path: '切换账号',
    schema: {
      usage: '#wg切换账号 <序号>',
      args: [{ name: 'index', rules: [{ required: true }] }]
    }
  },
  () => import('@src/response/wegameAccount')
);
wegameGroup.use(
  {
    path: '删除账号',
    schema: {
      usage: '#wg删除账号 <序号>',
      args: [{ name: 'index', rules: [{ required: true }] }]
    }
  },
  () => import('@src/response/wegameAccount')
);

rocomGroup.use('qq登陆', () => import('@src/response/wegameAccount'));
rocomGroup.use('wx登陆', () => import('@src/response/wegameAccount'));
rocomGroup.use('wg账号列表', () => import('@src/response/wegameAccount'));
rocomGroup.use(
  {
    path: 'wg切换账号',
    schema: {
      usage: '+wg切换账号 <序号>',
      args: [{ name: 'index', rules: [{ required: true }] }]
    }
  },
  () => import('@src/response/wegameAccount')
);
rocomGroup.use(
  {
    path: 'wg删除账号',
    schema: {
      usage: '+wg删除账号 <序号>',
      args: [{ name: 'index', rules: [{ required: true }] }]
    }
  },
  () => import('@src/response/wegameAccount')
);

export default router.define;
