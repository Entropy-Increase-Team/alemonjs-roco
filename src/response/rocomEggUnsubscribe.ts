import { deleteEggExchangeSubscription, fetchEggExchangeSubscriptions } from '@src/model/rocomEggExchange';
import { getWeGameUserContext } from '@src/model/wegameAccount';
import { Format, useEvent, useMessage } from 'alemonjs';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const statusFormat = Format.create();
  const statusMarkdown = Format.createMarkdown();
  const format = Format.create();
  const md = Format.createMarkdown();

  try {
    statusMarkdown.addText('正在取消换蛋订阅...');
    statusFormat.addMarkdown(statusMarkdown);
    void message.send({ format: statusFormat });

    const context = getWeGameUserContext(event);
    const listData = await fetchEggExchangeSubscriptions(context.userIdentifier);
    const subscriptions = Array.isArray(listData.subscriptions) ? (listData.subscriptions as Array<Record<string, unknown>>) : [];

    if (subscriptions.length === 0) {
      md.addText('当前没有换蛋订阅。');
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    let deletedCount = 0;

    for (const sub of subscriptions) {
      const subscriptionId = String(sub.subscription_id ?? '').trim();

      if (!subscriptionId) {
        continue;
      }

      try {
        await deleteEggExchangeSubscription(subscriptionId, context.userIdentifier);
        deletedCount++;
      } catch (error) {
        logger.warn(`[rocom] 删除换蛋订阅 ${subscriptionId} 失败: ${error instanceof Error ? error.message : error}`);
      }
    }

    md.addText(deletedCount > 0 ? `✅ 已取消 ${deletedCount} 个换蛋订阅。` : '取消换蛋订阅失败，请稍后重试。');
    format.addMarkdown(md);
    void message.send({ format });
  } catch (error) {
    md.addText(`取消换蛋订阅失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });
  }
};
