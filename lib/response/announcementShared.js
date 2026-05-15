import { fetchAnnouncements, fetchAnnouncementDetail, CATEGORY_TAG_MAP } from '../data/announcement.js';
import AnnouncementCard from '../img/views/AnnouncementCard.js';
import AnnouncementDetailCard from '../img/views/AnnouncementDetailCard.js';
import { Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

const TABS = ['最新', '公告', '资讯', '活动'];
function parseAnnouncementArgs(suffix) {
    if (!suffix) {
        return { tab: '最新', idx: 0 };
    }
    if (/^\d+$/u.test(suffix)) {
        return { tab: '最新', idx: parseInt(suffix, 10) };
    }
    for (const t of TABS) {
        if (suffix.startsWith(t)) {
            const rest = suffix.slice(t.length).trim();
            const num = /^\d+$/u.test(rest) ? parseInt(rest, 10) : 0;
            return { tab: t, idx: num };
        }
    }
    return { tab: '最新', idx: 0 };
}
async function buildAnnouncementListFormat(tab) {
    const tagId = CATEGORY_TAG_MAP[tab] ?? '135113';
    const { items, totalPages } = await fetchAnnouncements(tagId);
    const img = await renderComponentIsHtmlToBuffer(AnnouncementCard, {
        data: {
            announcements: items,
            activeTab: tab,
            page: 1,
            totalPages
        }
    });
    if (typeof img === 'boolean') {
        throw new Error('[洛克王国] 公告图片渲染失败，请稍后重试');
    }
    const format = Format.create();
    format.addImage(img);
    return format;
}
async function buildAnnouncementDetailFormat(tab, idx) {
    const tagId = CATEGORY_TAG_MAP[tab] ?? '135113';
    const { items } = await fetchAnnouncements(tagId);
    if (idx > items.length) {
        throw new Error(`[洛克王国] 序号超出范围，当前共 ${items.length} 条公告`);
    }
    const target = items[idx - 1];
    const detail = await fetchAnnouncementDetail(target.id);
    const img = await renderComponentIsHtmlToBuffer(AnnouncementDetailCard, {
        data: { detail }
    });
    if (typeof img === 'boolean') {
        throw new Error('[洛克王国] 公告详情渲染失败，请稍后重试');
    }
    const format = Format.create();
    format.addImage(img);
    return format;
}

export { buildAnnouncementDetailFormat, buildAnnouncementListFormat, parseAnnouncementArgs };
