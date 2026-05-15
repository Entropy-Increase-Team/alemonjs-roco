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
rocoQuickGroup.use(['帮助', 'help'], () => import('./response/rocomHelp.js'));
rocoQuickGroup.use(['账号列表'], () => import('./response/rocomAccounts.js'));
rocoQuickGroup.use(['档案'], () => import('./response/rocomProfile.js'));
rocoQuickGroup.use(['uid', 'UID'], () => import('./response/rocomSearch.js'));
rocoQuickGroup.use(['家园', 'home', '刷新家园', 'rehome'], () => import('./response/rocomHome.js'));
rocoQuickGroup.use(['大赛战绩', '战绩'], () => import('./response/rocomRecord.js'));
rocoQuickGroup.use(['精灵列表'], () => import('./response/rocomPets.js'));
rocoQuickGroup.use(['查看阵容', '阵容详情', '阵容'], () => import('./response/rocomLineup.js'));
rocoQuickGroup.use(['交换大厅', '大厅'], () => import('./response/rocomExchange.js'));
rocoQuickGroup.use(['订阅远行商人', '订阅旅行商人', '取消订阅远行商人', '取消订阅旅行商人'], () => import('./response/rocomMerchantSubscription.js'));
rocoQuickGroup.use(['尺寸查询', '精灵尺寸', '远行商人', '旅行商人', '商人信息'], () => import('./response/rocomTools.js'));
rocoQuickGroup.use(['查蛋', '精灵查蛋', '配种'], () => import('./response/rocomEggs.js'));
const baseGroup = router.group({
    routeText: {
        prefixes: ['#', '＃', '/'],
        stripPrefix: true
    },
    keyPolicy: {
        maxWords: 1
    }
});
baseGroup.use(['roco帮助', 'rocohelp', '洛克帮助', '洛克help'], () => import('./response/rocomHelp.js'));
baseGroup.use(['roco账号列表', '洛克账号列表', '洛克王国账号列表'], () => import('./response/rocomAccounts.js'));
baseGroup.use(['roco档案', '洛克档案', '洛克王国档案'], () => import('./response/rocomProfile.js'));
baseGroup.use(['rocouid', '洛克uid', '洛克王国uid', 'rocoUID', '洛克UID', '洛克王国UID'], () => import('./response/rocomSearch.js'));
baseGroup.use([
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
], () => import('./response/rocomHome.js'));
baseGroup.use(['roco大赛战绩', '洛克大赛战绩', '洛克王国大赛战绩', 'roco战绩', '洛克战绩', '洛克王国战绩'], () => import('./response/rocomRecord.js'));
baseGroup.use(['roco精灵列表', '洛克精灵列表', '洛克王国精灵列表'], () => import('./response/rocomPets.js'));
baseGroup.use(['roco查看阵容', '洛克查看阵容', '洛克王国查看阵容', 'roco阵容详情', '洛克阵容详情', '洛克王国阵容详情', 'roco阵容', '洛克阵容', '洛克王国阵容'], () => import('./response/rocomLineup.js'));
baseGroup.use(['roco交换大厅', '洛克交换大厅', '洛克王国交换大厅', 'roco大厅', '洛克大厅', '洛克王国大厅'], () => import('./response/rocomExchange.js'));
baseGroup.use([
    'roco订阅远行商人',
    '洛克订阅远行商人',
    '洛克王国订阅远行商人',
    'roco订阅旅行商人',
    '洛克订阅旅行商人',
    '洛克王国订阅旅行商人',
    'roco取消订阅远行商人',
    '洛克取消订阅远行商人',
    '洛克王国取消订阅远行商人',
    'roco取消订阅旅行商人',
    '洛克取消订阅旅行商人',
    '洛克王国取消订阅旅行商人'
], () => import('./response/rocomMerchantSubscription.js'));
baseGroup.use([
    'roco尺寸查询',
    '洛克尺寸查询',
    '洛克王国尺寸查询',
    'roco精灵尺寸',
    '洛克精灵尺寸',
    '洛克王国精灵尺寸',
    'roco远行商人',
    '洛克远行商人',
    '洛克王国远行商人',
    'roco旅行商人',
    '洛克旅行商人',
    '洛克王国旅行商人',
    'roco商人信息',
    '洛克商人信息',
    '洛克王国商人信息'
], () => import('./response/rocomTools.js'));
baseGroup.use(['roco查蛋', '洛克查蛋', '洛克王国查蛋', 'roco精灵查蛋', '洛克精灵查蛋', '洛克王国精灵查蛋', 'roco配种', '洛克配种', '洛克王国配种'], () => import('./response/rocomEggs.js'));
baseGroup.use({
    path: 'roco图鉴',
    schema: {
        usage: '#洛克图鉴 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: '洛克图鉴',
    schema: {
        usage: '#洛克图鉴 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: '洛克王国图鉴',
    schema: {
        usage: '#洛克图鉴 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: 'roco查询',
    schema: {
        usage: '#洛克查询 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: '洛克查询',
    schema: {
        usage: '#洛克查询 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: '洛克王国查询',
    schema: {
        usage: '#洛克查询 <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: 'rococw',
    schema: {
        usage: '#洛克cw <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: '洛克cw',
    schema: {
        usage: '#洛克cw <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use({
    path: '洛克王国cw',
    schema: {
        usage: '#洛克cw <宠物名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/petDetail.js'));
baseGroup.use([
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
], () => import('./response/petList.js'));
baseGroup.use({
    path: 'roco技能',
    schema: {
        usage: '#洛克技能 <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/skillSearch.js'));
baseGroup.use({
    path: '洛克技能',
    schema: {
        usage: '#洛克技能 <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/skillSearch.js'));
baseGroup.use({
    path: '洛克王国技能',
    schema: {
        usage: '#洛克技能 <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/skillSearch.js'));
baseGroup.use({
    path: 'rocojn',
    schema: {
        usage: '#洛克jn <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/skillSearch.js'));
baseGroup.use({
    path: '洛克jn',
    schema: {
        usage: '#洛克jn <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/skillSearch.js'));
baseGroup.use({
    path: '洛克王国jn',
    schema: {
        usage: '#洛克jn <技能名>',
        args: [{ name: 'keyword', rules: [{ required: true, type: 'rest' }] }]
    }
}, () => import('./response/skillSearch.js'));
baseGroup.use(['roco活动', '洛克活动', '洛克王国活动', 'roco日历', '洛克日历', '洛克王国日历', 'rocohdrl', '洛克hdrl', '洛克王国hdrl'], () => import('./response/active.js'));
baseGroup.use(['roco公告', '洛克公告', '洛克王国公告'], () => import('./response/announcement.js'));
baseGroup.use(['wg帮助', 'wghelp'], () => import('./response/wegameHelp.js'));
baseGroup.use(['wg配置'], () => import('./response/wegameConfig.js'));
baseGroup.use(['wg模块下载'], () => import('./response/wegameModuleDownload.js'));
baseGroup.use(['wg模块'], () => import('./response/wegameModules.js'));
baseGroup.use(['wg更新'], () => import('./response/wegameUpdate.js'));
baseGroup.use(['wgqq登陆', 'wgwx登陆', 'wg账号列表'], () => import('./response/wegameAccount.js'));
baseGroup.use({
    path: 'wg切换账号',
    schema: {
        usage: '#wg切换账号 <序号>',
        args: [{ name: 'index', rules: [{ required: true }] }]
    }
}, () => import('./response/wegameAccount.js'));
baseGroup.use({
    path: 'wg删除账号',
    schema: {
        usage: '#wg删除账号 <序号>',
        args: [{ name: 'index', rules: [{ required: true }] }]
    }
}, () => import('./response/wegameAccount.js'));
var router$1 = router.define;

export { router$1 as default };
