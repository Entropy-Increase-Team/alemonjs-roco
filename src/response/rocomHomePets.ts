import RocomHomePetsCard from '@src/img/views/RocomHomePetsCard';
import RocomHomePetDetailCard from '@src/img/views/RocomHomePetDetailCard';
import { getRocomHomePetDetail, getRocomHomePets } from '@src/model/rocomHomePets';
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

  // 家园精灵 [UID] [精灵GID] [NPC ID]：带 GID/NPC 时查单只详情
  const tokens = String(route.rawArgs ?? '')
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
  const hasUid = tokens.length > 0 && /^\d+$/u.test(tokens[0]);
  const uid = hasUid ? tokens[0] : '';
  const rest = tokens.slice(hasUid ? 1 : 0);
  const petGid = rest.length > 0 && /^\d+$/u.test(rest[0]) ? Number(rest[0]) : 0;
  const npcId = rest.length > 1 && /^\d+$/u.test(rest[1]) ? Number(rest[1]) : 0;

  try {
    statusMarkdown.addText('正在获取家园精灵信息，请稍后...');
    statusFormat.addMarkdown(statusMarkdown);
    void message.send({ format: statusFormat });

    const context = getWeGameUserContext(event);

    if (petGid || npcId) {
      statusMarkdown.addText('正在查询家园精灵详情，请稍后...（需要目标玩家在线）');
      statusFormat.addMarkdown(statusMarkdown);
      void message.send({ format: statusFormat });

      const result = await getRocomHomePetDetail(context, uid, petGid, npcId);
      const img = await renderComponentIsHtmlToBuffer(RocomHomePetDetailCard, { data: result.renderData });

      if (typeof img === 'boolean') {
        md.addText(`未获取到家园精灵完整数据（UID：${result.renderData.uid}）。请确认目标玩家在线、家园可访问，或稍后重试。`);
        format.addMarkdown(md);
        void message.send({ format });

        return;
      }

      format.addImage(img);
      void message.send({ format });

      return;
    }

    const result = await getRocomHomePets(context, uid);
    const img = await renderComponentIsHtmlToBuffer(RocomHomePetsCard, { data: result.renderData });

    if (typeof img === 'boolean') {
      md.addText(`家园精灵（UID：${result.renderData.uid}）：共 ${result.renderData.total} 只，可收蛋 ${result.renderData.eggCount} 只。`);
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    format.addImage(img);
    void message.send({ format });
  } catch (error) {
    md.addText(`查询家园精灵失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });
  }
};
