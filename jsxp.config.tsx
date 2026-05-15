import ActiveDate from '@src/img/views/ActiveDate';
import AnnouncementCard from '@src/img/views/AnnouncementCard';
import AnnouncementDetailCard from '@src/img/views/AnnouncementDetailCard';
import YunzaiHelpCard from '@src/img/views/Help';
import PetDetailCard from '@src/img/views/PetDetailCard';
import PetListCard from '@src/img/views/PetListCard';
import { defineConfig } from 'jsxp';
import React from 'react';

export default defineConfig({
  routes: {
    '/roco-help': {
      component: (
        <YunzaiHelpCard
          data={{
            title: '洛克王国助手',
            subtitle: '小洛克，欢迎来到洛克王国！',
            prefixTitle: '指令前缀',
            prefixText: '# / ＃ · 支持 roco / 洛克',
            footerBrand: '洛克王国',
            footerNote: 'Powered by alemonjs',
            categories: [
              {
                title: '宠物图鉴',
                items: [
                  { title: '#roco图鉴 迪莫', desc: '图鉴 / 查询 / cw + 宠物名', example: '#roco图鉴 迪莫' },
                  { title: '#roco宠物', desc: '宠物 / 精灵 / cwlb（可选属性）', example: '#roco宠物' }
                ]
              }
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
