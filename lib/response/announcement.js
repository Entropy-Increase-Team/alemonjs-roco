import { parseAnnouncementArgs, buildAnnouncementDetailFormat, buildAnnouncementListFormat } from './announcementShared.js';
import { useRoute, useMessage, Format } from 'alemonjs';

var announcement = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const suffix = Array.isArray(route.rawArgs)
        ? route.rawArgs
            .map(item => String(item).trim())
            .filter(Boolean)
            .join(' ')
            .trim()
        : String(route.rawArgs ?? '').trim();
    const { tab, idx } = parseAnnouncementArgs(suffix);
    try {
        if (idx > 0) {
            void message.send({ format: await buildAnnouncementDetailFormat(tab, idx) });
            return;
        }
        void message.send({ format: await buildAnnouncementListFormat(tab) });
    }
    catch (error) {
        console.error('[洛克王国] 获取公告失败:', error);
        md.addText('[洛克王国] 公告获取失败，请稍后重试');
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { announcement as default };
