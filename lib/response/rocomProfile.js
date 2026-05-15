import { getRocomProfile, buildRocomProfileCardData, buildRocomProfileText } from '../model/rocomQuery.js';
import RocomProfileCard from '../img/views/RocomProfileCard.js';
import { useEvent, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomProfile = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        statusMarkdown.addText('正在生成洛克档案...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const profile = await getRocomProfile(event);
        const img = await renderComponentIsHtmlToBuffer(RocomProfileCard, {
            data: buildRocomProfileCardData(profile)
        });
        if (typeof img === 'boolean') {
            md.addText(buildRocomProfileText(profile));
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        format.addImage(img);
    }
    catch (error) {
        md.addText(`查询洛克档案失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    void message.send({ format });
};

export { rocomProfile as default };
