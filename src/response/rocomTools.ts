import { buildRocomMerchantCardData, buildRocomMerchantText } from '@src/model/rocomMerchant';
import RocomMerchantCard from '@src/img/views/RocomMerchantCard';
import RocomEggSizeCard from '@src/img/views/RocomEggSizeCard';
import { buildRocomSizeCardData, buildRocomSizeText, getRocomMerchantInfo, getRocomSizeQuery } from '@src/model/rocomExtraQuery';
import { Format, useMessage, useRoute } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [route] = useRoute();
  const [message] = useMessage();
  const statusFormat = Format.create();
  const statusMarkdown = Format.createMarkdown();
  const format = Format.create();
  const md = Format.createMarkdown();
  const routeKey = String(route.key ?? '').trim();
  const rawArgs = String(route.rawArgs ?? '').trim();

  try {
    if (routeKey.endsWith('远行商人') || routeKey.endsWith('旅行商人') || routeKey.endsWith('商人信息')) {
      statusMarkdown.addText('正在查询远行商人信息...');
      statusFormat.addMarkdown(statusMarkdown);
      void message.send({ format: statusFormat });

      const result = await getRocomMerchantInfo();
      const img = await renderComponentIsHtmlToBuffer(RocomMerchantCard, {
        data: buildRocomMerchantCardData(result)
      });

      if (typeof img === 'boolean') {
        md.addText(buildRocomMerchantText(result));
      } else {
        format.addImage(img);
        void message.send({ format });

        return;
      }
    } else {
      statusMarkdown.addText('正在查询精灵尺寸，请稍后...');
      statusFormat.addMarkdown(statusMarkdown);
      void message.send({ format: statusFormat });

      const result = await getRocomSizeQuery(rawArgs);
      const img = await renderComponentIsHtmlToBuffer(RocomEggSizeCard, {
        data: buildRocomSizeCardData(result)
      });

      if (typeof img !== 'boolean') {
        format.addImage(img);
        void message.send({ format });

        return;
      }

      md.addText(buildRocomSizeText(result));
    }
  } catch (error) {
    md.addText(error instanceof Error ? error.message : '工具查询失败');
  }

  format.addMarkdown(md);
  void message.send({ format });
};
