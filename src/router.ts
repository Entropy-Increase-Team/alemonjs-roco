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

router.res(
  {
    regular: /^(?:!|！|\/|#|＃)(?:roco|洛克)(帮助|help)$/
  },
  () => import('@src/response/help')
);

router.res(
  {
    regular: /^(?:!|！|\/|#|＃)(?:roco|洛克)(图鉴|查询|cw)\s+(.+)$/
  },
  () => import('@src/response/petDetail')
);

router.res(
  {
    regular: /^(?:!|！|\/|#|＃)(?:roco|洛克)(宠物|宠物列表|精灵|cwlb)(?:\s+(.+))?$/
  },
  () => import('@src/response/petList')
);

router.res(
  {
    regular: /^(?:!|！|\/|#|＃)(?:roco|洛克)(属性|sx)\s+(.+)$/
  },
  () => import('@src/response/skillSearch')
);

router.res(
  {
    regular: /^(?:!|！|\/|#|＃)(?:roco|洛克)(活动|日历|hdrl)$/
  },
  () => import('@src/response/active')
);

router.res(
  {
    regular: /^(?:!|！|\/|#|＃)(?:roco|洛克)公告(?:\s+(.+))?$/
  },
  () => import('@src/response/announcement')
);

export default router.define;
