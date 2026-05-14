import { buildRocomPetListText, getRocomPetList } from '@src/model/rocomPets';
import { Format, useEvent, useMessage } from 'alemonjs';
import RocomPetPackageCard from '@src/img/views/RocomPetPackageCard';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();

  try {
    const result = await getRocomPetList(event);

    const img = await renderComponentIsHtmlToBuffer(RocomPetPackageCard, {
      data: result
    });

    if (typeof img === 'boolean') {
      md.addText(buildRocomPetListText(result));
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    format.addImage(img);
  } catch (error) {
    md.addText(`查询精灵列表失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  void message.send({ format });
};
