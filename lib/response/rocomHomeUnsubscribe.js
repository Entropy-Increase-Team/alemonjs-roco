import { TARGET_GROUP, TARGET_PRIVATE, buildEggSubscriptionKey, deleteEggSubscription, getEggSubscriptionsByTarget } from '../model/rocomEggSubscription.js';
import { useEvent, useMessage, useRoute, Format } from 'alemonjs';

function getEventValue(event, keys) {
    for (const key of keys) {
        const value = String(event.current[key] ?? '').trim();
        if (value) {
            return value;
        }
    }
    return '';
}
var rocomHomeUnsubscribe = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const [route] = useRoute();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        const targetUid = String(route.rawArgs ?? '').trim();
        const userId = getEventValue(event, ['UserId', 'user_id']);
        const botId = getEventValue(event, ['BotId', 'SelfId', 'bot_id', 'self_id']) || 'bot';
        const groupId = getEventValue(event, ['GroupId', 'ChannelId', 'GuildId', 'group_id', 'channel_id', 'guild_id']);
        const isGroup = Boolean(groupId && groupId !== userId);
        const targetType = isGroup ? TARGET_GROUP : TARGET_PRIVATE;
        const targetId = isGroup ? groupId : userId;
        if (targetUid) {
            const key = buildEggSubscriptionKey(botId, targetId, targetType, targetUid);
            const deleted = await deleteEggSubscription(key);
            md.addText(deleted ? `已取消订阅 UID ${targetUid} 的家园蛋状态。` : `没有找到 UID ${targetUid} 的家园蛋状态订阅。`);
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        const subs = await getEggSubscriptionsByTarget(botId, targetId, targetType);
        if (subs.length === 0) {
            md.addText(isGroup ? '本群当前没有家园蛋状态订阅。' : '你当前没有家园蛋状态订阅。');
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        for (const sub of subs) {
            await deleteEggSubscription(sub.key);
        }
        md.addText(`已取消全部 ${subs.length} 个家园蛋状态订阅（${subs.map(sub => sub.target_uid).join('、')}）。`);
        format.addMarkdown(md);
        void message.send({ format });
    }
    catch (error) {
        md.addText(`取消家园蛋状态订阅失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { rocomHomeUnsubscribe as default };
