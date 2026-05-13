import { findPetByName } from '@src/data/index';
import PetDetailCard from '@src/img/views/PetDetailCard';
import { Format, useEvent, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const text = event.current.MessageText?.trim() ?? '';

  const format = Format.create();
  const md = Format.createMarkdown();

  // 提取宠物名
  const petName = text.replace(/^[!！/#＃](?:roco|洛克)(?:图鉴|查询|cw)\s*/, '').trim();

  if (!petName) {
    md.addText('[洛克王国] 请输入宠物名，例如: #洛克图鉴 迪莫');
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const pet = findPetByName(petName);

  if (!pet) {
    md.addText(`[洛克王国] 未找到宠物「${petName}」，请检查名称是否正确`);
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const img = await renderComponentIsHtmlToBuffer(PetDetailCard, {
    data: { pet }
  });

  if (typeof img === 'boolean') {
    md.addText('[洛克王国] 图鉴卡片渲染失败');
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  format.addImage(img);
  void message.send({ format });
};
