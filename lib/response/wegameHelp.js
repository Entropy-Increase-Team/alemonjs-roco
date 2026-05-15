import WeGameHelpCard from '../img/views/WeGameHelp.js';
import { getWeGameHelpCardData, buildWeGameHelpText } from '../model/wegame.js';
import { useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var wegameHelp = async () => {
    const [message] = useMessage();
    const data = getWeGameHelpCardData();
    const hasHelpItems = Array.isArray(data.categories) && data.categories.some((group) => Array.isArray(group.items) && group.items.length > 0);
    if (!hasHelpItems) {
        const format = Format.create();
        const md = Format.createMarkdown();
        md.addText(buildWeGameHelpText());
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const img = await renderComponentIsHtmlToBuffer(WeGameHelpCard, {
        data
    });
    if (typeof img === 'boolean') {
        const format = Format.create();
        const md = Format.createMarkdown();
        md.addText(buildWeGameHelpText());
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const format = Format.create();
    format.addImage(img);
    void message.send({ format });
};

export { wegameHelp as default };
