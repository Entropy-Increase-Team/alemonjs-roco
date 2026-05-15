import RocomEggCandidatesCard from '@src/img/views/RocomEggCandidatesCard';
import RocomEggCard from '@src/img/views/RocomEggCard';
import { buildRocomEggCandidatesCardData, buildRocomEggCardData, buildRocomEggQueryText, getRocomEggQuery } from '@src/model/rocomEggs';
import { Format, useMessage, useRoute } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [route] = useRoute();
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();
  const rawArgs = String(route.rawArgs ?? '').trim();

  try {
    const result = await getRocomEggQuery(rawArgs);

    if (result.mode === 'pet') {
      const img = await renderComponentIsHtmlToBuffer(RocomEggCard, {
        data: buildRocomEggCardData(result)
      });

      if (typeof img !== 'boolean') {
        format.addImage(img);
        void message.send({ format });

        return;
      }
    }

    if (result.mode === 'multi') {
      const img = await renderComponentIsHtmlToBuffer(RocomEggCandidatesCard, {
        data: buildRocomEggCandidatesCardData(result.keyword, result.candidates)
      });

      if (typeof img !== 'boolean') {
        format.addImage(img);
        void message.send({ format });

        return;
      }
    }

    md.addText(buildRocomEggQueryText(result));
  } catch (error) {
    md.addText(error instanceof Error ? error.message : '查蛋或配种失败');
  }

  format.addMarkdown(md);
  void message.send({ format });
};
