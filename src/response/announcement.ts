import { CATEGORY_TAG_MAP, fetchAnnouncementDetail, fetchAnnouncements } from '@src/data/announcement';
import AnnouncementCard from '@src/img/views/AnnouncementCard';
import AnnouncementDetailCard from '@src/img/views/AnnouncementDetailCard';
import { Format, useEvent, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

const TABS = ['最新', '公告', '资讯', '活动'] as const;

function parseArgs(text: string): { tab: string; idx: number } {
  const suffix = text.replace(/^[!！/#＃](?:roco|洛克)公告\s*/, '').trim();

  if (!suffix) {
    return { tab: '最新', idx: 0 };
  }

  // 纯数字 → 序号
  if (/^\d+$/.test(suffix)) {
    return { tab: '最新', idx: parseInt(suffix, 10) };
  }

  // 分类 + 可选序号
  for (const t of TABS) {
    if (suffix.startsWith(t)) {
      const rest = suffix.slice(t.length).trim();
      const num = /^\d+$/.test(rest) ? parseInt(rest, 10) : 0;

      return { tab: t, idx: num };
    }
  }

  return { tab: '最新', idx: 0 };
}

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const text = event.current.MessageText?.trim() ?? '';

  const format = Format.create();
  const md = Format.createMarkdown();

  const { tab, idx } = parseArgs(text);
  const tagId = CATEGORY_TAG_MAP[tab] ?? '135113';

  try {
    const { items, totalPages } = await fetchAnnouncements(tagId);

    if (idx > 0) {
      if (idx > items.length) {
        md.addText(`[洛克王国] 序号超出范围，当前共 ${items.length} 条公告`);
        format.addMarkdown(md);
        void message.send({ format });

        return;
      }

      const target = items[idx - 1];
      const detail = await fetchAnnouncementDetail(target.id);

      const img = await renderComponentIsHtmlToBuffer(AnnouncementDetailCard, {
        data: { detail }
      });

      if (typeof img === 'boolean') {
        md.addText('[洛克王国] 公告详情渲染失败，请稍后重试');
        format.addMarkdown(md);
        void message.send({ format });

        return;
      }

      format.addImage(img);
      void message.send({ format });
    } else {
      const img = await renderComponentIsHtmlToBuffer(AnnouncementCard, {
        data: {
          announcements: items,
          activeTab: tab,
          page: 1,
          totalPages
        }
      });

      if (typeof img === 'boolean') {
        md.addText('[洛克王国] 公告图片渲染失败，请稍后重试');
        format.addMarkdown(md);
        void message.send({ format });

        return;
      }

      format.addImage(img);
      void message.send({ format });
    }
  } catch (err) {
    console.error('[洛克王国] 获取公告失败:', err);
    md.addText('[洛克王国] 公告获取失败，请稍后重试');
    format.addMarkdown(md);
    void message.send({ format });
  }
};
