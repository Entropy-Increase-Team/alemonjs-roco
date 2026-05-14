import { buildRocomMerchantText } from '@src/model/rocomMerchant';
import { buildRocomSizeText, getRocomMerchantInfo, getRocomSizeQuery } from '@src/model/rocomExtraQuery';
import { Format, useMessage, useRoute } from 'alemonjs';

export default async () => {
  const [route] = useRoute();
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();
  const routeKey = String(route.key ?? '').trim();
  const rawArgs = String(route.rawArgs ?? '').trim();

  try {
    if (routeKey === '远行商人' || routeKey === '旅行商人' || routeKey === '商人信息') {
      const result = await getRocomMerchantInfo();

      md.addText(buildRocomMerchantText(result));
    } else {
      const result = await getRocomSizeQuery(rawArgs);

      md.addText(buildRocomSizeText(result));
    }
  } catch (error) {
    md.addText(error instanceof Error ? error.message : '工具查询失败');
  }

  format.addMarkdown(md);
  void message.send({ format });
};
