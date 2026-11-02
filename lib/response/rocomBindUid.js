import { parseBindUidArgs, bindRocomUid } from '../model/rocomBind.js';
import { getWeGameUserContext } from '../model/wegameAccount.js';
import { useEvent, useMessage, useRoute, Format } from 'alemonjs';

var rocomBindUid = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const [route] = useRoute();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        const uid = parseBindUidArgs(String(route.rawArgs ?? ''));
        statusMarkdown.addText(`正在绑定 UID：${uid}...`);
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const context = getWeGameUserContext(event);
        const text = await bindRocomUid(context, uid);
        md.addText(text);
        format.addMarkdown(md);
        void message.send({ format });
    }
    catch (error) {
        md.addText(`绑定 UID 失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { rocomBindUid as default };
