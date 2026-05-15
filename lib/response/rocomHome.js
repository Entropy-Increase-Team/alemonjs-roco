import { getRocomHome, buildRocomHomeCardData, buildRocomHomeText } from '../model/rocomExtraQuery.js';
import RocomHomeCard from '../img/views/RocomHomeCard.js';
import { getWeGameUserContext } from '../model/wegameAccount.js';
import { useEvent, useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomHome = async () => {
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
        statusMarkdown.addText('正在获取家园信息，请稍后...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const context = getWeGameUserContext(event);
        const result = await getRocomHome(context, rawArgs);
        const img = await renderComponentIsHtmlToBuffer(RocomHomeCard, {
            data: buildRocomHomeCardData(result.rawPayload, result.uid)
        });
        if (typeof img === 'boolean') {
            md.addText(buildRocomHomeText(result));
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        format.addImage(img);
    }
    catch (error) {
        md.addText(`查询家园失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    void message.send({ format });
};

export { rocomHome as default };
