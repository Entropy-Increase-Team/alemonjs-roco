import { Router } from 'alemonjs';

const router = Router.create({
  events: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
});

const rocoQuickGroup = router.group({
  routeText: {
    prefixes: ['+'],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 1
  }
});

rocoQuickGroup.use(['帮助', 'help'], () => import('@src/response/rocomHelp'));
rocoQuickGroup.use(['账号列表'], () => import('@src/response/rocomAccounts'));
rocoQuickGroup.use(['档案'], () => import('@src/response/rocomProfile'));
rocoQuickGroup.use(['uid', 'UID'], () => import('@src/response/rocomSearch'));
rocoQuickGroup.use(['家园', 'home', '刷新家园', 'rehome'], () => import('@src/response/rocomHome'));
rocoQuickGroup.use(['家园精灵', '家园详情', 'homepets', 'homepet', 'homeinfo'], () => import('@src/response/rocomHomePets'));
rocoQuickGroup.use(['大赛战绩', '战绩'], () => import('@src/response/rocomRecord'));
rocoQuickGroup.use(['精灵列表'], () => import('@src/response/rocomPets'));
rocoQuickGroup.use(['阵容解析', '解析阵容', '分享码解析'], () => import('@src/response/rocomLineupParse'));
rocoQuickGroup.use(['查看阵容', '阵容详情'], () => import('@src/response/rocomLineupDetail'));
rocoQuickGroup.use(['阵容'], () => import('@src/response/rocomLineupList'));
rocoQuickGroup.use(['交换大厅', '大厅'], () => import('@src/response/rocomExchange'));
rocoQuickGroup.use(['今日远行商人', '今日旅行商人'], () => import('@src/response/rocomMerchantToday'));
rocoQuickGroup.use(['商人商品', '商人道具', '商人商品列表'], () => import('@src/response/rocomMerchantCatalog'));
rocoQuickGroup.use(['订阅远行商人', '订阅旅行商人'], () => import('@src/response/rocomMerchantSubscribe'));
rocoQuickGroup.use(['取消订阅远行商人', '取消订阅旅行商人'], () => import('@src/response/rocomMerchantUnsubscribe'));
rocoQuickGroup.use(['尺寸查询', '精灵尺寸'], () => import('@src/response/rocomSize'));
rocoQuickGroup.use(['远行商人', '旅行商人', '商人信息'], () => import('@src/response/rocomMerchant'));
rocoQuickGroup.use(['日历', '活动日历'], () => import('@src/response/rocomCalendar'));
rocoQuickGroup.use(['强制更新'], () => import('@src/response/rocomUpdateForce'));
rocoQuickGroup.use(['更新'], () => import('@src/response/rocomUpdate'));
rocoQuickGroup.use(['查蛋', '精灵查蛋'], () => import('@src/response/rocomEggQuery'));
rocoQuickGroup.use(['配种'], () => import('@src/response/rocomBreeding'));
rocoQuickGroup.use(['绑定UID'], () => import('@src/response/rocomBindUid'));
rocoQuickGroup.use(['换蛋广场', '蛋广场'], () => import('@src/response/rocomEggExchangeList'));
rocoQuickGroup.use(['发布换蛋帖'], () => import('@src/response/rocomEggExchangePost'));
rocoQuickGroup.use(['我的换蛋帖'], () => import('@src/response/rocomEggExchangeMine'));
rocoQuickGroup.use(['关闭换蛋帖'], () => import('@src/response/rocomEggExchangeClose'));
rocoQuickGroup.use(['订阅换蛋'], () => import('@src/response/rocomEggSubscribe'));
rocoQuickGroup.use(['取消换蛋订阅'], () => import('@src/response/rocomEggUnsubscribe'));
rocoQuickGroup.use(['订阅家园'], () => import('@src/response/rocomHomeSubscribe'));
rocoQuickGroup.use(['取消订阅家园'], () => import('@src/response/rocomHomeUnsubscribe'));
rocoQuickGroup.use(['家园状态'], () => import('@src/response/rocomHomeStatus'));
rocoQuickGroup.use(['我的家园订阅'], () => import('@src/response/rocomHomeSubscriptionList'));

const baseGroup = router.group({
  routeText: {
    prefixes: ['/', '#', '＃'],
    stripPrefix: true
  },
  keyPolicy: {
    maxWords: 1
  }
});

baseGroup.use(['roco帮助', 'rocohelp', '洛克帮助', '洛克help'], () => import('@src/response/rocomHelp'));
baseGroup.use(['roco账号列表', '洛克账号列表', '洛克王国账号列表'], () => import('@src/response/rocomAccounts'));
baseGroup.use(['roco档案', '洛克档案', '洛克王国档案'], () => import('@src/response/rocomProfile'));
baseGroup.use(['rocouid', '洛克uid', '洛克王国uid', 'rocoUID', '洛克UID', '洛克王国UID'], () => import('@src/response/rocomSearch'));
baseGroup.use(
  [
    'roco家园',
    '洛克家园',
    '洛克王国家园',
    'rocohome',
    '洛克home',
    '洛克王国home',
    'roco刷新家园',
    '洛克刷新家园',
    '洛克王国刷新家园',
    'rocorehome',
    '洛克rehome',
    '洛克王国rehome'
  ],
  () => import('@src/response/rocomHome')
);
baseGroup.use(['roco大赛战绩', '洛克大赛战绩', '洛克王国大赛战绩', 'roco战绩', '洛克战绩', '洛克王国战绩'], () => import('@src/response/rocomRecord'));
baseGroup.use(['roco精灵列表', '洛克精灵列表', '洛克王国精灵列表'], () => import('@src/response/rocomPets'));
baseGroup.use(
  ['roco家园精灵', '洛克家园精灵', '洛克王国家园精灵', 'roco家园详情', '洛克家园详情', '洛克王国家园详情'],
  () => import('@src/response/rocomHomePets')
);
baseGroup.use(
  [
    'roco阵容解析',
    '洛克阵容解析',
    '洛克王国阵容解析',
    'roco解析阵容',
    '洛克解析阵容',
    '洛克王国解析阵容',
    'roco分享码解析',
    '洛克分享码解析',
    '洛克王国分享码解析'
  ],
  () => import('@src/response/rocomLineupParse')
);
baseGroup.use(
  ['roco查看阵容', '洛克查看阵容', '洛克王国查看阵容', 'roco阵容详情', '洛克阵容详情', '洛克王国阵容详情'],
  () => import('@src/response/rocomLineupDetail')
);
baseGroup.use(['roco阵容', '洛克阵容', '洛克王国阵容'], () => import('@src/response/rocomLineupList'));
baseGroup.use(['roco交换大厅', '洛克交换大厅', '洛克王国交换大厅', 'roco大厅', '洛克大厅', '洛克王国大厅'], () => import('@src/response/rocomExchange'));
baseGroup.use(
  ['roco今日远行商人', '洛克今日远行商人', '洛克王国今日远行商人', 'roco今日旅行商人', '洛克今日旅行商人', '洛克王国今日旅行商人'],
  () => import('@src/response/rocomMerchantToday')
);
baseGroup.use(
  [
    'roco商人商品',
    '洛克商人商品',
    '洛克王国商人商品',
    'roco商人道具',
    '洛克商人道具',
    '洛克王国商人道具',
    'roco商人商品列表',
    '洛克商人商品列表',
    '洛克王国商人商品列表'
  ],
  () => import('@src/response/rocomMerchantCatalog')
);
baseGroup.use(
  ['roco订阅远行商人', '洛克订阅远行商人', '洛克王国订阅远行商人', 'roco订阅旅行商人', '洛克订阅旅行商人', '洛克王国订阅旅行商人'],
  () => import('@src/response/rocomMerchantSubscribe')
);
baseGroup.use(
  ['roco取消订阅远行商人', '洛克取消订阅远行商人', '洛克王国取消订阅远行商人', 'roco取消订阅旅行商人', '洛克取消订阅旅行商人', '洛克王国取消订阅旅行商人'],
  () => import('@src/response/rocomMerchantUnsubscribe')
);
baseGroup.use(
  ['roco尺寸查询', '洛克尺寸查询', '洛克王国尺寸查询', 'roco精灵尺寸', '洛克精灵尺寸', '洛克王国精灵尺寸'],
  () => import('@src/response/rocomSize')
);
baseGroup.use(
  ['roco远行商人', '洛克远行商人', '洛克王国远行商人', 'roco旅行商人', '洛克旅行商人', '洛克王国旅行商人', 'roco商人信息', '洛克商人信息', '洛克王国商人信息'],
  () => import('@src/response/rocomMerchant')
);
baseGroup.use(['roco日历', '洛克日历', '洛克王国日历', 'roco活动日历', '洛克活动日历', '洛克王国活动日历'], () => import('@src/response/rocomCalendar'));
baseGroup.use(['roco强制更新', '洛克强制更新', '洛克王国强制更新'], () => import('@src/response/rocomUpdateForce'));
baseGroup.use(['roco更新', '洛克更新', '洛克王国更新'], () => import('@src/response/rocomUpdate'));
baseGroup.use(['roco查蛋', '洛克查蛋', '洛克王国查蛋', 'roco精灵查蛋', '洛克精灵查蛋', '洛克王国精灵查蛋'], () => import('@src/response/rocomEggQuery'));
baseGroup.use(['roco配种', '洛克配种', '洛克王国配种'], () => import('@src/response/rocomBreeding'));
baseGroup.use(['roco绑定UID', '洛克绑定UID', '洛克王国绑定UID'], () => import('@src/response/rocomBindUid'));
baseGroup.use(
  ['roco换蛋广场', '洛克换蛋广场', '洛克王国换蛋广场', 'roco蛋广场', '洛克蛋广场', '洛克王国蛋广场'],
  () => import('@src/response/rocomEggExchangeList')
);
baseGroup.use(['roco发布换蛋帖', '洛克发布换蛋帖', '洛克王国发布换蛋帖'], () => import('@src/response/rocomEggExchangePost'));
baseGroup.use(['roco我的换蛋帖', '洛克我的换蛋帖', '洛克王国我的换蛋帖'], () => import('@src/response/rocomEggExchangeMine'));
baseGroup.use(['roco关闭换蛋帖', '洛克关闭换蛋帖', '洛克王国关闭换蛋帖'], () => import('@src/response/rocomEggExchangeClose'));
baseGroup.use(['roco订阅换蛋', '洛克订阅换蛋', '洛克王国订阅换蛋'], () => import('@src/response/rocomEggSubscribe'));
baseGroup.use(['roco取消换蛋订阅', '洛克取消换蛋订阅', '洛克王国取消换蛋订阅'], () => import('@src/response/rocomEggUnsubscribe'));
baseGroup.use(['roco订阅家园', '洛克订阅家园', '洛克王国订阅家园'], () => import('@src/response/rocomHomeSubscribe'));
baseGroup.use(['roco取消订阅家园', '洛克取消订阅家园', '洛克王国取消订阅家园'], () => import('@src/response/rocomHomeUnsubscribe'));
baseGroup.use(['roco家园状态', '洛克家园状态', '洛克王国家园状态'], () => import('@src/response/rocomHomeStatus'));
baseGroup.use(['roco我的家园订阅', '洛克我的家园订阅', '洛克王国我的家园订阅'], () => import('@src/response/rocomHomeSubscriptionList'));

baseGroup.use(
  {
    path: 'roco图鉴',
    schema: {
      usage: '#洛克图鉴 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: '洛克图鉴',
    schema: {
      usage: '#洛克图鉴 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: '洛克王国图鉴',
    schema: {
      usage: '#洛克图鉴 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: 'roco查询',
    schema: {
      usage: '#洛克查询 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: '洛克查询',
    schema: {
      usage: '#洛克查询 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: '洛克王国查询',
    schema: {
      usage: '#洛克查询 <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: 'rococw',
    schema: {
      usage: '#洛克cw <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: '洛克cw',
    schema: {
      usage: '#洛克cw <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  {
    path: '洛克王国cw',
    schema: {
      usage: '#洛克cw <宠物名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/petDetail')
);
baseGroup.use(
  [
    'roco宠物',
    '洛克宠物',
    '洛克王国宠物',
    'roco宠物列表',
    '洛克宠物列表',
    '洛克王国宠物列表',
    'roco精灵',
    '洛克精灵',
    '洛克王国精灵',
    'rococwlb',
    '洛克cwlb',
    '洛克王国cwlb'
  ],
  () => import('@src/response/petList')
);
baseGroup.use(
  {
    path: 'roco技能',
    schema: {
      usage: '#洛克技能 <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
baseGroup.use(
  {
    path: '洛克技能',
    schema: {
      usage: '#洛克技能 <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
baseGroup.use(
  {
    path: '洛克王国技能',
    schema: {
      usage: '#洛克技能 <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
baseGroup.use(
  {
    path: 'rocojn',
    schema: {
      usage: '#洛克jn <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
baseGroup.use(
  {
    path: '洛克jn',
    schema: {
      usage: '#洛克jn <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
baseGroup.use(
  {
    path: '洛克王国jn',
    schema: {
      usage: '#洛克jn <技能名>',
      args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
  },
  () => import('@src/response/skillSearch')
);
baseGroup.use(
  ['roco活动', '洛克活动', '洛克王国活动', 'roco日历', '洛克日历', '洛克王国日历', 'rocohdrl', '洛克hdrl', '洛克王国hdrl'],
  () => import('@src/response/active')
);
baseGroup.use(['roco公告', '洛克公告', '洛克王国公告'], () => import('@src/response/announcement'));

/**
 * WeGame相关功能
 */
baseGroup.use(['wg帮助', 'wghelp'], () => import('@src/response/wegameHelp'));
baseGroup.use(['wg配置'], () => import('@src/response/wegameConfig'));
baseGroup.use(['wg模块下载'], () => import('@src/response/wegameModuleDownload'));
baseGroup.use(['wg模块'], () => import('@src/response/wegameModules'));
baseGroup.use(['wg更新'], () => import('@src/response/wegameUpdate'));
baseGroup.use(['wgqq登陆', 'wgqq登录'], () => import('@src/response/wegameLoginQq'));
baseGroup.use(['wgwx登陆', 'wgwx登录'], () => import('@src/response/wegameLoginWx'));
baseGroup.use(['wg账号列表'], () => import('@src/response/wegameBindingList'));
baseGroup.use(
  {
    path: 'wg切换账号',
    schema: {
      usage: '#wg切换账号 <序号>',
      args: [{ name: 'index', rules: [{ required: true }] }]
    }
  },
  () => import('@src/response/wegameSwitchBinding')
);
baseGroup.use(
  {
    path: 'wg删除账号',
    schema: {
      usage: '#wg删除账号 <序号>',
      args: [{ name: 'index', rules: [{ required: true }] }]
    }
  },
  () => import('@src/response/wegameDeleteBinding')
);

export default router.define;
