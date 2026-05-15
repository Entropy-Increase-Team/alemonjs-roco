import ActiveDate from '@src/img/views/ActiveDate';
import AnnouncementCard from '@src/img/views/AnnouncementCard';
import AnnouncementDetailCard from '@src/img/views/AnnouncementDetailCard';
import ALemonJSHelpCard from '@src/img/views/Help';
import PetDetailCard from '@src/img/views/PetDetailCard';
import PetListCard from '@src/img/views/PetListCard';
import RocomAccountListCard from '@src/img/views/RocomAccountListCard';
import RocomExchangeCard from '@src/img/views/RocomExchangeCard';
import RocomHomeCard from '@src/img/views/RocomHomeCard';
import RocomMerchantCard from '@src/img/views/RocomMerchantCard';
import RocomPetPackageCard from '@src/img/views/RocomPetPackageCard';
import RocomProfileCard from '@src/img/views/RocomProfileCard';
import RocomRecordCard from '@src/img/views/RocomRecordCard';
import WeGameBindingListCard from '@src/img/views/WeGameBindingListCard';
import WeGameHelpCard from '@src/img/views/WeGameHelp';
import { defineConfig } from 'jsxp';
import React from 'react';

const DEMO_IMG = 'https://static.gametalk.qq.com/image/467/1774694411_ec4b49435c17f0672b19e0aba9fd231f.jpg';
const DEMO_ICON = 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg';

export default defineConfig({
  routes: {
    '/roco-help': {
      component: (
        <ALemonJSHelpCard
          data={{
            title: '洛克王国世界帮助',
            subtitle: '支持前缀：+ / #roco / #洛克 / #洛克王国',
            prefixTitle: '支持前缀',
            prefixText: '+ / #roco / #洛克 / #洛克王国',
            footerBrand: 'ALemonJS & WeGame Roco Kingdom Plugin',
            footerNote: 'ALemonJS & WeGame Roco Kingdom Plugin',
            categories: [
              {
                title: '洛克王国世界',
                items: [
                  { title: '+帮助', desc: '查看洛克王国世界帮助', example: '+帮助' },
                  { title: '+账号列表', desc: '查询可识别的洛克角色账号', example: '+账号列表' },
                  { title: '+家园', desc: '查询当前绑定角色的家园信息', example: '+家园' },
                  { title: '+战绩', desc: '查询闪耀大赛战绩', example: '+战绩' }
                ]
              },
              {
                title: '图鉴资料',
                items: [
                  { title: '#roco帮助', desc: '查看图鉴资料帮助图', example: '#roco帮助' },
                  { title: '#roco图鉴 迪莫', desc: '查询宠物图鉴详情', example: '#roco图鉴 迪莫' },
                  { title: '#roco宠物 火', desc: '查看宠物列表；可加属性筛选', example: '#roco宠物 火' },
                  { title: '#roco技能 闪光冲击', desc: '查询技能信息', example: '#roco技能 闪光冲击' }
                ]
              }
            ]
          }}
        />
      )
    },
    '/wegame-help': {
      component: (
        <WeGameHelpCard
          data={{
            title: 'WeGame 帮助',
            subtitle: '默认前缀：#wg',
            footerBrand: 'WeGame-plugin',
            categories: [
              {
                title: '基础指令',
                items: [
                  { title: '#wg帮助', desc: '查看 WeGame 帮助' },
                  { title: '#wgqq登陆', desc: '使用 QQ 扫码登录 WeGame' },
                  { title: '#wgwx登陆', desc: '使用微信扫码登录 WeGame' },
                  { title: '#wg账号列表', desc: '查看当前已绑定的 WeGame 账号' },
                  { title: '#wg切换账号 1', desc: '切换默认 WeGame 账号' },
                  { title: '#wg删除账号 1', desc: '删除指定 WeGame 绑定' }
                ]
              },
              {
                title: '游戏模块',
                items: [{ title: '#洛克帮助', desc: '查看当前内建洛克模块帮助' }]
              }
            ]
          }}
        />
      )
    },
    '/rocom-accounts': {
      component: (
        <RocomAccountListCard
          data={{
            title: '洛克王国世界账号列表',
            subtitle: '当前共识别到 2 个可用洛克角色',
            bindings: [
              {
                index: 1,
                bindingIndex: '1',
                nickname: '阿柠檬',
                roleId: '437023912',
                tgpId: '10010001',
                loginType: 'QQ扫码',
                levelText: 'Lv.60',
                starName: '高级魔法师',
                updatedAt: '2026-05-15 19:48:00',
                statusText: '主账号 | 有效 | 在线',
                isPrimary: true,
                badges: [
                  { text: '主账号', type: 'primary' },
                  { text: '有效', type: 'valid' },
                  { text: '在线', type: 'online' }
                ]
              },
              {
                index: 2,
                bindingIndex: '2',
                nickname: '小洛克',
                roleId: '437088888',
                tgpId: '10010002',
                loginType: '微信扫码',
                levelText: 'Lv.48',
                starName: '初级魔法师',
                updatedAt: '2026-05-15 12:15:00',
                statusText: '有效 | 离线',
                isPrimary: false,
                badges: [
                  { text: '有效', type: 'valid' },
                  { text: '离线', type: 'offline' }
                ]
              }
            ],
            emptyText: '暂无可识别的账号信息',
            tip: '发送 #wg切换账号 <绑定序号> 切换默认账号',
            copyright: 'alemonjs-roco · RoCom'
          }}
        />
      )
    },
    '/wegame-bindings': {
      component: (
        <WeGameBindingListCard
          data={{
            title: 'WeGame 账号列表',
            subtitle: '当前共绑定 2 个 WeGame 账号',
            bindings: [
              {
                index: 1,
                total: 2,
                nickname: '阿柠檬',
                statusText: '主账号 | 有效',
                loginType: 'QQ登录',
                tgpId: '10010001',
                updatedAt: '2026-05-15 19:48:00',
                roleId: '437023912',
                isPrimary: true,
                badges: [
                  { text: '主账号', type: 'primary' },
                  { text: '有效', type: 'valid' }
                ]
              },
              {
                index: 2,
                total: 2,
                nickname: '小洛克',
                statusText: '有效',
                loginType: '微信登录',
                tgpId: '10010002',
                updatedAt: '2026-05-15 12:15:00',
                roleId: '437088888',
                isPrimary: false,
                badges: [{ text: '有效', type: 'valid' }]
              }
            ],
            emptyText: '暂无已绑定的 WeGame 账号',
            tip: '发送 #wgqq登陆 或 #wgwx登陆 绑定账号',
            copyright: 'alemonjs-roco · WeGame'
          }}
        />
      )
    },
    '/rocom-home': {
      component: (
        <RocomHomeCard
          data={{
            title: '洛克家园',
            homeName: '阿柠檬的魔法家园',
            uid: '437023912',
            subtitle: '家园概览',
            updatedAt: '2026-05-15 19:48:00',
            summaryCards: [
              { label: '家园等级', value: '12' },
              { label: '家园繁荣度', value: '4830' },
              { label: '收藏进度', value: '21/80' },
              { label: '可收集', value: '6' }
            ],
            gardenCount: 2,
            indoorCount: 2,
            guardCount: 1,
            guardEmptyText: '当前没有守卫精灵',
            guardPets: [{ id: '3001', name: '迪莫', level: '100', iconUrl: DEMO_ICON, statusText: '守卫中', statusClass: 'guard', badge: '主力' }],
            indoorPets: [
              { id: '3002', name: '火花', level: '90', iconUrl: DEMO_ICON, statusText: '室内', statusClass: 'ready', badge: '休息中', note: '心情不错' },
              { id: '3003', name: '喵喵', level: '88', iconUrl: DEMO_ICON, statusText: '室内', statusClass: 'ready', badge: '训练后', note: '刚刚玩耍完' }
            ],
            gardenPlots: [
              {
                id: 'field-1',
                landIndex: 1,
                plantName: '南瓜',
                statusText: '种植中',
                stateType: 'progress',
                leftTimeText: '剩余 24 分钟',
                harvestText: '预计收获 12 个',
                stealText: '可被偷取 2 个',
                progress: 45
              },
              {
                id: 'field-2',
                landIndex: 2,
                plantName: '玉米',
                statusText: '可收获',
                stateType: 'ready',
                leftTimeText: '已成熟',
                harvestText: '可收获 8 个',
                stealText: '可被偷取 1 个',
                progress: 100
              }
            ]
          } as any}
        />
      )
    },
    '/rocom-profile': {
      component: (
        <RocomProfileCard
          data={{
            userName: '阿柠檬',
            userLevel: 'Lv.60',
            userUid: '437023912',
            userAvatar: DEMO_IMG,
            enrollDays: '300',
            starName: '高级魔法师',
            hasAiProfileData: true,
            summaryTitleParts: ['WEGAME AI', '洛克档案'],
            bestPetName: '迪莫',
            bestPetImage: DEMO_ICON,
            scoreText: '96',
            aiCommentText: '节奏稳定，偏爱高练度核心精灵，战斗风格稳健。',
            currentCollectionCount: '215',
            totalCollectionCount: '321',
            amazingSpriteCount: '18',
            shinySpriteCount: '9',
            colorfulSpriteCount: '3',
            fashionCollectionCount: '28',
            itemCount: '642',
            collectionHint: '图鉴持续收集中',
            hasBattleData: true,
            tierBadgeUrl: DEMO_ICON,
            totalMatch: '286',
            totalWin: '172',
            winRate: '60.1%',
            matchResult: 'win',
            leftTeamPets: [{ name: '迪莫', icon: DEMO_ICON }, { name: '火花', icon: DEMO_ICON }, { name: '喵喵', icon: DEMO_ICON }],
            rightTeamPets: [{ name: '水蓝蓝', icon: DEMO_ICON }, { name: '格兰', icon: DEMO_ICON }, { name: '麋鹿', icon: DEMO_ICON }],
            opponentName: '小洛克',
            opponentAvatar: DEMO_IMG,
            radarPolygons: ['76,46 124,74 111,132 41,132 28,74'],
            radarAreaPoints: '76,60 112,80 100,118 52,118 40,80',
            radarDots: [
              { key: 'collect', x: 76, y: 60, value: 88 },
              { key: 'battle', x: 112, y: 80, value: 82 },
              { key: 'social', x: 100, y: 118, value: 75 },
              { key: 'pet', x: 52, y: 118, value: 91 },
              { key: 'growth', x: 40, y: 80, value: 86 }
            ],
            radarValueBadges: [
              { value: '88', x: 60, y: 36, width: 34 },
              { value: '82', x: 118, y: 74, width: 34 },
              { value: '75', x: 103, y: 126, width: 34 },
              { value: '91', x: 20, y: 126, width: 34 },
              { value: '86', x: 12, y: 74, width: 34 }
            ],
            radarAxisLabels: [
              { name: '收集', x: 66, y: 18, anchor: 'middle' },
              { name: '对战', x: 142, y: 76, anchor: 'start' },
              { name: '社交', x: 118, y: 148, anchor: 'start' },
              { name: '宠物', x: 34, y: 148, anchor: 'end' },
              { name: '成长', x: 8, y: 76, anchor: 'end' }
            ]
          }}
        />
      )
    },
    '/rocom-record': {
      component: (
        <RocomRecordCard
          data={{
            userName: '阿柠檬',
            userLevel: 'Lv.60',
            userUid: '437023912',
            userAvatar: DEMO_IMG,
            winRate: '60.1%',
            totalMatch: '286',
            currentPage: 1,
            pageText: '第 1 页 / 共 3 页',
            footerCommandHint: '+战绩 2',
            battles: [
              {
                leftName: '阿柠檬',
                leftAvatar: DEMO_IMG,
                leftPets: [{ name: '迪莫', icon: DEMO_ICON }, { name: '火花', icon: DEMO_ICON }],
                rightName: '小洛克',
                rightAvatar: DEMO_IMG,
                rightPets: [{ name: '水蓝蓝', icon: DEMO_ICON }, { name: '喵喵', icon: DEMO_ICON }],
                resultLabel: '胜利',
                resultKind: 'win',
                time: '19:48',
                date: '2026-05-15'
              }
            ]
          }}
        />
      )
    },
    '/rocom-exchange': {
      component: (
        <RocomExchangeCard
          data={{
            pageNo: 1,
            totalPages: 4,
            refresh: false,
            filterLabel: '全部',
            commandHint: '+交换大厅 2',
            posters: [
              {
                userName: '阿柠檬',
                userLevel: 60,
                isOnline: true,
                userId: '437023912',
                wantText: '想要：国王球 / 棱镜球',
                provideItems: ['迪莫', '火花', '魔法药水'],
                timeLabel: '5分钟前',
                isExpired: false,
                avatarUrl: DEMO_IMG
              }
            ]
          }}
        />
      )
    },
    '/rocom-merchant': {
      component: (
        <RocomMerchantCard
          data={{
            title: '远行商人',
            subtitle: '本轮商品一览',
            productCount: 3,
            roundLabel: '第 12 轮',
            countdown: '00:24:12',
            products: [
              { name: '国王球', image: DEMO_ICON, timeLabel: '剩余 24 分钟', type: '精灵球', slotLabel: 'A-1' },
              { name: '棱镜球', image: DEMO_ICON, timeLabel: '剩余 24 分钟', type: '精灵球', slotLabel: 'A-2' },
              { name: '高级药水', image: DEMO_ICON, timeLabel: '剩余 24 分钟', type: '道具', slotLabel: 'B-1' }
            ]
          }}
        />
      )
    },
    '/rocom-package': {
      component: (
        <RocomPetPackageCard
          data={{
            currentTab: '全部',
            userName: '阿柠檬',
            userLevel: 'Lv.60',
            userUid: '437023912',
            totalCount: 23,
            currentPage: 1,
            totalPages: 3,
            accountLabel: '当前账号 1',
            pageSize: 10,
            pets: [
              { name: '迪莫', level: '100', types: '光', rarity: '了不起', imageUrl: DEMO_ICON },
              { name: '火花', level: '90', types: '火', rarity: '普通', imageUrl: DEMO_ICON },
              { name: '喵喵', level: '88', types: '草', rarity: '异色', imageUrl: DEMO_ICON }
            ]
          }}
        />
      )
    },
    '/pet-detail': {
      component: (
        <PetDetailCard
          data={{
            pet: {
              id: 1,
              name: '迪莫',
              element: '光',
              hp: 120,
              atk: 80,
              mat: 80,
              def: 105,
              mdf: 105,
              spd: 92,
              trait: { name: '最好的伙伴', desc: '造成克制伤害后，获得攻防速+20%，并回复2能量。' },
              skills: [
                { name: '猛烈撞击', element: '普通', type: '物攻', cost: 1, power: 60, desc: '对敌方精灵造成物理伤害。' },
                { name: '闪光', element: '光', type: '魔攻', cost: 1, power: 60, desc: '对敌方精灵造成魔法伤害。' },
                { name: '光球', element: '光', type: '魔攻', cost: 2, power: 80, desc: '对敌方精灵造成魔法伤害。' },
                { name: '放晴', element: '光', type: '状态', cost: 0, power: 0, desc: '光系技能威力永久+40%，应对防御：改为永久+80%。' }
              ]
            }
          }}
        />
      )
    },
    '/pet-list': {
      component: (
        <PetListCard
          data={{
            pets: [
              { id: 1, name: '迪莫', element: '光', hp: 120, atk: 80, mat: 80, def: 105, mdf: 105, spd: 92, trait: { name: '最好的伙伴', desc: '' }, skills: [] },
              { id: 2, name: '喵喵', element: '草', hp: 63, atk: 57, mat: 57, def: 56, mdf: 59, spd: 33, trait: { name: '氧循环', desc: '' }, skills: [] },
              { id: 5, name: '火花', element: '火', hp: 65, atk: 64, mat: 58, def: 53, mdf: 55, spd: 60, trait: { name: '烈焰', desc: '' }, skills: [] }
            ],
            element: '全部'
          }}
        />
      )
    },
    '/active-date': {
      component: <ActiveDate />
    },
    '/announcement': {
      component: (
        <AnnouncementCard
          data={{
            announcements: [
              { id: 1, title: '违规行为处罚公告（2026年3月26日~3月27日）', date: '2026-03-28 19:00:00', category: '公告' },
              { id: 2, title: '3月28日更新公告', date: '2026-03-28 10:00:00', category: '公告' },
              { id: 3, title: '洛克王国世界S1赛季开启！全新精灵等你来收集', date: '2026-03-27 18:00:00', category: '资讯' },
              { id: 4, title: '精灵对战排位赛第一赛季规则说明', date: '2026-03-26 15:00:00', category: '活动' },
              { id: 5, title: '6000万预约达成！S1赛季8只新精灵生态首曝！', date: '2026-03-25 12:00:00', category: '最新' },
              { id: 6, title: '洛克王国世界公测福利一览', date: '2026-03-24 10:00:00', category: '活动' }
            ],
            activeTab: '最新',
            page: 1,
            totalPages: 4
          }}
        />
      )
    },
    '/announcement-detail': {
      component: (
        <AnnouncementDetailCard
          data={{
            detail: {
              id: 1,
              title: '违规行为处罚公告（2026年3月26日~3月27日）',
              date: '2026-03-28 19:00:00',
              author: '洛克王国世界',
              content: '亲爱的小洛克：\n\n为打造公平、健康的游戏环境，保障各位小洛克的账号资产安全与游戏公平体验，自开服以来，「王国安全部」持续对使用外挂、脚本或其他第三方辅助工具等行为进行监测和打击。\n\n我们再次提醒：请务必保护个人账号与隐私安全，请勿共享账号、远离扫码代练、警惕非官方充值与虚假福利信息。\n\n在3月26日~3月27日期间，我们共对2579名违规账号做出处罚，包括扣除信用分、封禁账号、追缴非法收益等。其中，957名外挂、脚本使用者及黑产工作室账号被处以10年封禁，且不接受任何解封申请。',
              coverUrl: 'https://static.gametalk.qq.com/image/467/1774694411_ec4b49435c17f0672b19e0aba9fd231f.jpg',
              tagIds: '135111,135110'
            }
          }}
        />
      )
    }
  }
});
