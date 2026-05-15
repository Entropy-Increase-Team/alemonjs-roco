import { getRocomProfile, buildRocomProfileText } from '../model/rocomQuery.js';
import { useEvent, useMessage, Format } from 'alemonjs';

var rocomProfile = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        const profile = await getRocomProfile(event);
        md.addText(buildRocomProfileText(profile));
    }
    catch (error) {
        md.addText(`查询洛克档案失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomProfile as default };
