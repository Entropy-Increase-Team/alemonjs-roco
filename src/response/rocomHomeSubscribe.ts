import {
  buildEggSubscriptionKey,
  getEggSubscriptionCron,
  isMentionAllToken,
  TARGET_GROUP,
  TARGET_PRIVATE,
  upsertEggSubscription
} from '@src/model/rocomEggSubscription';
import { Format, useEvent, useMessage, useRoute } from 'alemonjs';

function getCronIntervalLabel(cron = ''): string {
  const minutes = cron.match(/0 \*\/(\d+) \* \* \* \*/u);

  if (minutes) {
    return `${minutes[1]} 分钟`;
  }

  const hours = cron.match(/0 \d+ \*\/(\d+) \* \* \*/u);

  if (hours) {
    return `${hours[1]} 小时`;
  }

  return '定时';
}

function getEventValue(event: { current: Record<string, unknown> }, keys: string[]): string {
  for (const key of keys) {
    const value = String(event.current[key] ?? '').trim();

    if (value) {
      return value;
    }
  }

  return '';
}

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const [route] = useRoute();
  const format = Format.create();
  const md = Format.createMarkdown();

  try {
    const tokens = String(route.rawArgs ?? '')
      .trim()
      .split(/\s+/u)
      .filter(Boolean);

    if (tokens.length === 0) {
      md.addText(
        [
          '家园蛋状态订阅用法：',
          '+订阅家园 <UID>  订阅指定 UID 的家园蛋状态',
          '+订阅家园 @全体 <UID>  命中后尝试 @全体',
          '+取消订阅家园 <UID>  取消指定 UID 的订阅',
          '+家园状态 <UID>  查询指定 UID 当前家园蛋状态',
          '+我的家园订阅  查看当前订阅列表'
        ].join('\n')
      );
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    let mentionAll = false;
    const uidTokens: string[] = [];

    for (const token of tokens) {
      if (isMentionAllToken(token)) {
        mentionAll = true;
        continue;
      }

      uidTokens.push(token);
    }

    if (uidTokens.length === 0) {
      throw new Error('请提供要订阅的 UID。');
    }

    const targetUid = uidTokens[0];

    if (!/^\d+$/u.test(targetUid)) {
      throw new Error('UID 必须为纯数字。');
    }

    const userId = getEventValue(event, ['UserId', 'user_id']);
    const botId = getEventValue(event, ['BotId', 'SelfId', 'bot_id', 'self_id']) || 'bot';
    const groupId = getEventValue(event, ['GroupId', 'ChannelId', 'GuildId', 'group_id', 'channel_id', 'guild_id']);
    const isGroup = Boolean(groupId && groupId !== userId);

    if (!isGroup && !userId) {
      throw new Error('无法识别订阅目标（缺少用户信息）。');
    }

    const targetType = isGroup ? TARGET_GROUP : TARGET_PRIVATE;
    const targetId = isGroup ? groupId : userId;
    const key = buildEggSubscriptionKey(botId, targetId, targetType, targetUid);

    await upsertEggSubscription(key, {
      target_type: targetType,
      bot_id: botId,
      group_id: isGroup ? groupId : '',
      user_id: isGroup ? '' : userId,
      target_uid: targetUid,
      mention_all: mentionAll,
      last_egg_count: 0,
      last_pushed_egg_count: 0,
      last_push_time: '',
      last_check_time: '',
      updated_by: userId
    });

    const cron = await getEggSubscriptionCron().catch(() => '');
    const scopeLabel = isGroup ? '本群' : '私聊';
    const lines = [
      `已订阅家园蛋状态（${scopeLabel}）：UID ${targetUid}`,
      `轮询频率：每 ${getCronIntervalLabel(cron)} 检查一次`,
      '推送条件：检测到新的可收蛋精灵时推送',
      mentionAll ? '命中后会尝试 @全体。' : '命中后不会 @全体。',
      '',
      `发送 +取消订阅家园 ${targetUid} 取消订阅`,
      `发送 +家园状态 ${targetUid} 立即查询`
    ];

    md.addText(lines.join('\n'));
    format.addMarkdown(md);
    void message.send({ format });
  } catch (error) {
    md.addText(`订阅家园蛋状态失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });
  }
};
