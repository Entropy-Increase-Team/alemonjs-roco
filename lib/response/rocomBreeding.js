import RocomBreedingPairCard from '../img/views/RocomBreedingPairCard.js';
import RocomBreedingWantCard from '../img/views/RocomBreedingWantCard.js';
import { getRocomBreedingResult, getRocomBreedingQuery } from '../model/rocomEggs.js';
import { useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomBreeding = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const rawArgs = String(route.rawArgs ?? '').trim();
    try {
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
    catch (error) {
        md.addText(error instanceof Error ? error.message : '查蛋或配种失败');
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomBreeding as default };
