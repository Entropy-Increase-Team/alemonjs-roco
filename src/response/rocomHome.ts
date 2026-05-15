import { buildRocomHomeCardData, buildRocomHomeText, getRocomHome } from '@src/model/rocomExtraQuery';
import RocomHomeCard from '@src/img/views/RocomHomeCard';
import { getWeGameUserContext } from '@src/model/wegameAccount';
import { Format, useEvent, useMessage, useRoute } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [route] = useRoute();
  const [message] = useMessage();
  const statusFormat = Format.create();
  const statusMarkdown = Format.createMarkdown();
  const format = Format.create();
  const md = Format.createMarkdown();

  const rawArgs = String(route.rawArgs ?? '').trim();

  try {
    statusMarkdown.addText('正在获取家园信息，请稍后...');
    statusFormat.addMarkdown(statusMarkdown);
    void message.send({ format: statusFormat });

    const context = getWeGameUserContext(event);
    const result = await getRocomHome(context, rawArgs);

    const img = await renderComponentIsHtmlToBuffer(RocomHomeCard, {
      data: buildRocomHomeCardData(result.rawPayload, result.uid)
    });

    if (typeof img === 'boolean') {
      md.addText(buildRocomHomeText(result));
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    format.addImage(img);
  } catch (error) {
    md.addText(`查询家园失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  void message.send({ format });
};
