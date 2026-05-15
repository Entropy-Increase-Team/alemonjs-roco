import { getRocomEggQuery, buildRocomEggQueryText, getRocomBreedingQuery } from '../model/rocomEggs.js';
import { useRoute, useMessage, Format } from 'alemonjs';

var rocomEggs = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const routeKey = String(route.key ?? '').trim();
    const rawArgs = String(route.rawArgs ?? '').trim();
    try {
        if (routeKey.endsWith('查蛋') || routeKey.endsWith('精灵查蛋')) {
            const result = await getRocomEggQuery(rawArgs);
            md.addText(buildRocomEggQueryText(result));
        }
        else {
            md.addText(getRocomBreedingQuery(rawArgs));
        }
    }
    catch (error) {
        md.addText(error instanceof Error ? error.message : '查蛋或配种失败');
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomEggs as default };
