import { buildRocomLineupDetailText, buildRocomLineupListText, getRocomLineupDetail, getRocomLineupList } from '@src/model/rocomLineup';
import RocomLineupCard from '@src/img/views/RocomLineupCard';
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
  const routeKey = String(route.key ?? '').trim();
  const rawArgs = String(route.rawArgs ?? '').trim();

  try {
    if (routeKey.endsWith('查看阵容') || routeKey.endsWith('阵容详情')) {
      statusMarkdown.addText(rawArgs ? `正在查询阵容 ${rawArgs} 的详情...` : '正在查询阵容详情，请稍后...');
      statusFormat.addMarkdown(statusMarkdown);
      void message.send({ format: statusFormat });

      const result = await getRocomLineupDetail(event, rawArgs);

      const img = await renderComponentIsHtmlToBuffer(RocomLineupCard, {
        data: {
          mode: 'detail',
          category: '',
          pageNo: 1,
          totalPages: 1,
          lineups: [result]
        }
      });

      if (typeof img === 'boolean') {
        md.addText(buildRocomLineupDetailText(result));
        format.addMarkdown(md);
        void message.send({ format });

        return;
      }

      format.addImage(img);
    } else {
      statusMarkdown.addText('正在查询阵容助手，请稍后...');
      statusFormat.addMarkdown(statusMarkdown);
      void message.send({ format: statusFormat });

      const result = await getRocomLineupList(event, rawArgs);

      const img = await renderComponentIsHtmlToBuffer(RocomLineupCard, {
        data: {
          mode: 'list',
          category: result.category,
          pageNo: result.pageNo,
          totalPages: result.totalPages,
          lineups: result.lineups
        }
      });

      if (typeof img === 'boolean') {
        md.addText(buildRocomLineupListText(result));
        format.addMarkdown(md);
        void message.send({ format });

        return;
      }

      format.addImage(img);
    }
  } catch (error) {
    md.addText(`查询阵容失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  void message.send({ format });
};
