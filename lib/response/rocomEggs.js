import RocomBreedingPairCard from '../img/views/RocomBreedingPairCard.js';
import RocomBreedingWantCard from '../img/views/RocomBreedingWantCard.js';
import RocomEggCandidatesCard from '../img/views/RocomEggCandidatesCard.js';
import RocomEggCard from '../img/views/RocomEggCard.js';
import { getRocomEggQuery, buildRocomEggCardData, buildRocomEggCandidatesCardData, buildRocomEggQueryText, getRocomBreedingResult, getRocomBreedingQuery } from '../model/rocomEggs.js';
import { useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

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
            if (result.mode === 'pet') {
                const img = await renderComponentIsHtmlToBuffer(RocomEggCard, {
                    data: buildRocomEggCardData(result)
                });
                if (typeof img !== 'boolean') {
                    format.addImage(img);
                    void message.send({ format });
                    return;
                }
            }
            if (result.mode === 'multi') {
                const img = await renderComponentIsHtmlToBuffer(RocomEggCandidatesCard, {
                    data: buildRocomEggCandidatesCardData(result.keyword, result.candidates)
                });
                if (typeof img !== 'boolean') {
                    format.addImage(img);
                    void message.send({ format });
                    return;
                }
            }
            md.addText(buildRocomEggQueryText(result));
        }
        else {
            const result = getRocomBreedingResult(rawArgs);
            if (result.mode === 'pair') {
                const img = await renderComponentIsHtmlToBuffer(RocomBreedingPairCard, {
                    data: result.data
                });
                if (typeof img !== 'boolean') {
                    format.addImage(img);
                    void message.send({ format });
                    return;
                }
            }
            if (result.mode === 'want' && result.data) {
                const img = await renderComponentIsHtmlToBuffer(RocomBreedingWantCard, {
                    data: result.data
                });
                if (typeof img !== 'boolean') {
                    format.addImage(img);
                    void message.send({ format });
                    return;
                }
            }
            md.addText(result.mode === 'want' ? result.text : result.text || getRocomBreedingQuery(rawArgs));
        }
    }
    catch (error) {
        md.addText(error instanceof Error ? error.message : '查蛋或配种失败');
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomEggs as default };
