import { searchRocomPlayer, buildRocomSearchText } from '../model/rocomQuery.js';
import { getWeGameUserContext } from '../model/wegameAccount.js';
import { useEvent, useRoute, useMessage, Format } from 'alemonjs';

var rocomSearch = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const rawArgs = String(route.rawArgs ?? '').trim();
    try {
        const context = getWeGameUserContext(event);
        const result = await searchRocomPlayer(context, rawArgs);
        md.addText(buildRocomSearchText(result.uid, result.rows));
    }
    catch (error) {
        md.addText(`玩家搜索失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomSearch as default };
