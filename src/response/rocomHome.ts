import { buildRocomHomeText, getRocomHome } from '@src/model/rocomExtraQuery';
import { Format, useEvent, useMessage } from 'alemonjs';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();

  try {
    const result = await getRocomHome(event);

    md.addText(buildRocomHomeText(result));
  } catch (error) {
    md.addText(`查询家园失败：${error instanceof Error ? error.message : '未知错误'}`);
  }

  format.addMarkdown(md);
  void message.send({ format });
};
