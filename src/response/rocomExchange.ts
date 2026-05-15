import { buildRocomExchangeText, getRocomExchangeHall } from '@src/model/rocomExchange';
import RocomExchangeCard from '@src/img/views/RocomExchangeCard';
import { Format, useEvent, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

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
    statusMarkdown.addText('正在查询交换大厅，请稍后...');
    statusFormat.addMarkdown(statusMarkdown);
    void message.send({ format: statusFormat });

    const result = await getRocomExchangeHall(event);

    const img = await renderComponentIsHtmlToBuffer(RocomExchangeCard, {
      data: result
    });

    if (typeof img === 'boolean') {
      md.addText(buildRocomExchangeText(result));
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    format.addImage(img);
  } catch (error) {
    md.addText(`查询交换大厅失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  void message.send({ format });
};
