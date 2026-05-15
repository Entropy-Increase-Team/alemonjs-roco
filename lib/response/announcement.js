import { fetchAnnouncements, CATEGORY_TAG_MAP, fetchAnnouncementDetail } from '../data/announcement.js';
import AnnouncementCard from '../img/views/AnnouncementCard.js';
import AnnouncementDetailCard from '../img/views/AnnouncementDetailCard.js';
import { useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

const TABS = ['最新', '公告', '资讯', '活动'];
function parseArgs(suffix) {
    if (!suffix) {
        return { tab: '最新', idx: 0 };
    }
    if (/^\d+$/.test(suffix)) {
        return { tab: '最新', idx: parseInt(suffix, 10) };
    }
    for (const t of TABS) {
        if (suffix.startsWith(t)) {
            const rest = suffix.slice(t.length).trim();
            const num = /^\d+$/.test(rest) ? parseInt(rest, 10) : 0;
            return { tab: t, idx: num };
        }
    }
    return { tab: '最新', idx: 0 };
}
var announcement = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const suffix = route.rawArgs
        .map(item => String(item).trim())
        .filter(Boolean)
        .join(' ')
        .trim();
    const { tab, idx } = parseArgs(suffix);
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
        }
        else {
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
    }
    catch (err) {
        console.error('[洛克王国] 获取公告失败:', err);
        md.addText('[洛克王国] 公告获取失败，请稍后重试');
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { announcement as default };
