import { subscribeRocomMerchant, unsubscribeRocomMerchant } from '@src/model/rocomMerchantSubscription';
import { Format, useEvent, useMessage, useRoute } from 'alemonjs';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [route] = useRoute();
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();
  const routeKey = String(route.key ?? '').trim();
  const rawArgs = String(route.rawArgs ?? '').trim();

  try {
    if (routeKey.endsWith('取消订阅远行商人') || routeKey.endsWith('取消订阅旅行商人')) {
      md.addText(await unsubscribeRocomMerchant(event as unknown as { current: Record<string, unknown> }));
    } else {
      md.addText(await subscribeRocomMerchant(event as unknown as { current: Record<string, unknown> }, rawArgs));
    }
  } catch (error) {
    md.addText(error instanceof Error ? error.message : '远行商人订阅操作失败');
  }

  format.addMarkdown(md);
  void message.send({ format });
};
