import { buildRocomMerchantText } from '../model/rocomMerchant.js';
import { getRocomMerchantInfo, getRocomSizeQuery, buildRocomSizeText } from '../model/rocomExtraQuery.js';
import { useRoute, useMessage, Format } from 'alemonjs';

var rocomTools = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    const routeKey = String(route.key ?? '').trim();
    const rawArgs = String(route.rawArgs ?? '').trim();
    try {
        if (routeKey.endsWith('远行商人') || routeKey.endsWith('旅行商人') || routeKey.endsWith('商人信息')) {
            statusMarkdown.addText('正在查询远行商人信息...');
            statusFormat.addMarkdown(statusMarkdown);
            void message.send({ format: statusFormat });
            const result = await getRocomMerchantInfo();
            md.addText(buildRocomMerchantText(result));
        }
        else {
            const result = await getRocomSizeQuery(rawArgs);
            md.addText(buildRocomSizeText(result));
        }
    }
    catch (error) {
        md.addText(error instanceof Error ? error.message : '工具查询失败');
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomTools as default };
