import { closeEggExchange } from '../model/rocomEggExchange.js';
import { getWeGameUserContext } from '../model/wegameAccount.js';
import { useEvent, useMessage, useRoute, Format } from 'alemonjs';

var rocomEggExchangeClose = async () => {
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
        const postId = String(route.rawArgs ?? '').trim();
        if (!postId) {
            throw new Error('格式：+关闭换蛋帖 <帖子ID>');
        }
        statusMarkdown.addText(`正在关闭换蛋帖 ${postId}...`);
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const context = getWeGameUserContext(event);
        await closeEggExchange(postId, context.userIdentifier);
        md.addText(`✅ 换蛋帖 ${postId} 已关闭。`);
        format.addMarkdown(md);
        void message.send({ format });
    }
    catch (error) {
        md.addText(`关闭换蛋帖失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { rocomEggExchangeClose as default };
