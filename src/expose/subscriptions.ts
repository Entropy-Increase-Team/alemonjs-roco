import { homeSubscriptionSchema } from './schemas';
import { ExposeError, getCurrentEvent } from 'alemonjs';
import { query, emptyInput, object, text, uid, dataQuery, action, record, array, stringSchema } from './shared';
import { subscribeRocomMerchantResult, unsubscribeRocomMerchant } from '../model/rocomMerchantSubscription';
import {
  buildEggSubscriptionKey,
  getEggSubscriptionsByTarget,
  upsertEggSubscription,
  deleteEggSubscription,
  queryRocomEggStatus,
  TARGET_GROUP,
  TARGET_PRIVATE
} from '../model/rocomEggSubscription';

function scope() {
  const event = getCurrentEvent();

  if (!event?.BotId) {
    throw new ExposeError('FORBIDDEN', '缺少当前消息事件');
  }
  const groupId =
    event.name === 'message.create'
      ? String([event.GroupId, event.ChannelId, event.GuildId].find(value => typeof value === 'string' && value.trim()) ?? '')
      : '';

  if (event.name === 'message.create' && !groupId) {
    throw new ExposeError('FORBIDDEN', '缺少当前群聊身份');
  }
  const targetType = groupId ? TARGET_GROUP : TARGET_PRIVATE;

  return { event, botId: event.BotId, userId: event.UserId, groupId, targetId: groupId || event.UserId, targetType };
}

export const subscriptionActions = {
  subscribe_merchant: action(
    '订阅当前群的商人商品；items 为商品序号、名称或全部，mentionAll 单独控制提醒全体',
    object({ items: { type: 'array', items: text, maxItems: 100 }, mentionAll: { type: 'boolean' } }),
    record({
      status: { type: 'string', enum: ['success', 'partial'] },
      text: stringSchema,
      items: array(stringSchema),
      unknownIndexes: array(stringSchema),
      mode: { type: 'string', enum: ['items', 'all'] }
    }),
    async (input: { items?: string[]; mentionAll?: boolean }) => {
      const result = await subscribeRocomMerchantResult({ current: scope().event }, '', { tokens: input.items ?? [], mentionAll: input.mentionAll ?? null });

      if (result.status === 'rejected') {
        throw new ExposeError('INVALID_INPUT', result.text);
      }

      return result;
    },
    'write'
  ),
  unsubscribe_merchant: query('取消当前群的远行商人订阅', emptyInput, () => unsubscribeRocomMerchant({ current: scope().event }), 'write'),
  get_home_status: query<{ uid: string }>('查询指定 UID 的家园蛋状态', object({ uid: text }, ['uid']), (input, user) => queryRocomEggStatus(uid(input.uid), user.userIdentifier)
  ),
  get_home_subscriptions: dataQuery('查询当前群或私聊的家园蛋状态订阅', emptyInput, record({ subscriptions: array(homeSubscriptionSchema) }), async () => {
    const target = scope();

    return {
      subscriptions: (await getEggSubscriptionsByTarget(target.botId, target.targetId, target.targetType)).map(item => ({
        target_type: item.target_type,
        bot_id: item.bot_id,
        group_id: item.group_id,
        user_id: item.user_id,
        target_uid: item.target_uid,
        last_push_time: item.last_push_time,
        last_check_time: item.last_check_time,
        updated_at: item.updated_at,
        mention_all: item.mention_all,
        last_egg_count: item.last_egg_count,
        last_pushed_egg_count: item.last_pushed_egg_count
      }))
    };
  }),
  subscribe_home: query<{ uid: string; mentionAll?: boolean }>(
    '订阅当前会话的家园蛋状态；mentionAll 控制命中后是否尝试提醒全体',
    object({ uid: text, mentionAll: { type: 'boolean' } }, ['uid']),
    async input => {
      const targetUid = uid(input.uid);
      const target = scope();

      await upsertEggSubscription(buildEggSubscriptionKey(target.botId, target.targetId, target.targetType, targetUid), {
        target_type: target.targetType,
        bot_id: target.botId,
        group_id: target.groupId,
        user_id: target.groupId ? '' : target.userId,
        target_uid: targetUid,
        mention_all: input.mentionAll ?? false,
        last_egg_count: 0,
        last_pushed_egg_count: 0,
        last_push_time: '',
        last_check_time: '',
        updated_by: target.userId
      });

      return `已订阅 UID ${targetUid} 的家园蛋状态`;
    },
    'write'
  ),
  unsubscribe_home: query<{ uid?: string }>(
    '取消当前会话的家园订阅；省略 UID 时取消当前会话全部家园订阅',
    object({ uid: text }),
    async input => {
      const target = scope();
      const subs = await getEggSubscriptionsByTarget(target.botId, target.targetId, target.targetType);
      const targetUid = input.uid ? uid(input.uid) : undefined;
      let count = 0;

      for (const sub of subs.filter(item => !targetUid || item.target_uid === targetUid)) {
        if (await deleteEggSubscription(sub.key)) {
          count++;
        }
      }

      return `已取消 ${count} 个家园蛋状态订阅`;
    },
    'write'
  )
};
