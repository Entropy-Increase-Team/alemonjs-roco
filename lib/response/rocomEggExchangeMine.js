import { fetchMyEggExchanges, buildMyPostsText } from '../model/rocomEggExchange.js';
import { getWeGameUserContext } from '../model/wegameAccount.js';
import { useEvent, useMessage, Format } from 'alemonjs';

var rocomEggExchangeMine = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        statusMarkdown.addText('正在查询你的换蛋帖...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const context = getWeGameUserContext(event);
        const data = await fetchMyEggExchanges(context.userIdentifier);
        const items = Array.isArray(data.items) ? data.items : [];
        md.addText(buildMyPostsText(items));
        format.addMarkdown(md);
        void message.send({ format });
    }
    catch (error) {
        md.addText(`查询我的换蛋帖失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { rocomEggExchangeMine as default };
