import RocomShareCodeTeamCard from '@src/img/views/RocomShareCodeTeamCard';
import { getShareCodeBaseUrl, normalizeShareCodeTeam, parseRocomShareCode } from '@src/model/rocomShareCode';
import { getWeGameUserContext } from '@src/model/wegameAccount';
import { Format, useEvent, useMessage, useRoute } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const [route] = useRoute();
  const statusFormat = Format.create();
  const statusMarkdown = Format.createMarkdown();
  const format = Format.create();
  const md = Format.createMarkdown();

  const shareCode = String(route.rawArgs ?? '').trim();

  try {
    if (!shareCode) {
      throw new Error('格式：+阵容解析 <阵容码>');
    }

    statusMarkdown.addText('正在解析阵容码...');
    statusFormat.addMarkdown(statusMarkdown);
    void message.send({ format: statusFormat });

    const context = getWeGameUserContext(event);
    const data = await parseRocomShareCode(shareCode, context.userIdentifier);
    const team = normalizeShareCodeTeam(data, await getShareCodeBaseUrl());

    if (team.teams.length === 0) {
      throw new Error('阵容码解析成功，但没有返回阵容精灵数据');
    }

    const img = await renderComponentIsHtmlToBuffer(RocomShareCodeTeamCard, { team });

    if (typeof img === 'boolean') {
      md.addText('阵容卡片渲染失败，请稍后重试。');
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    format.addImage(img);
    void message.send({ format });
  } catch (error) {
    md.addText(`阵容码解析失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });
  }
};
