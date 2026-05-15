import RocomLineupCard from '../img/views/RocomLineupCard.js';
import { getRocomLineupList, buildRocomLineupListText } from '../model/rocomLineup.js';
import { getWeGameUserContext } from '../model/wegameAccount.js';
import { useEvent, useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomLineupList = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [route] = useRoute();
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    const rawArgs = String(route.rawArgs ?? '').trim();
    try {
        statusMarkdown.addText('正在查询阵容助手，请稍后...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const context = getWeGameUserContext(event);
        const result = await getRocomLineupList(context, rawArgs);
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
        void message.send({ format });
    }
    catch (error) {
        md.addText(`查询阵容失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { rocomLineupList as default };
