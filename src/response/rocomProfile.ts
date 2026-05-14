import { buildRocomProfileText, getRocomProfile } from '@src/model/rocomQuery';
import { Format, useEvent, useMessage } from 'alemonjs';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();

  try {
    const profile = await getRocomProfile(event);

    md.addText(buildRocomProfileText(profile));
  } catch (error) {
    md.addText(`查询洛克档案失败：${error instanceof Error ? error.message : '未知错误'}`);
  }

  format.addMarkdown(md);
  void message.send({ format });
};
