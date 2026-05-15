import ALemonJSHelpCard from '../img/views/Help.js';
import { getRocoMainHelpCardData, buildRocoMainHelpText } from '../model/rocom.js';
import { useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomHelp = async () => {
    const [message] = useMessage();
    const data = await getRocoMainHelpCardData();
    const hasHelpItems = Array.isArray(data.categories) && data.categories.some((group) => Array.isArray(group.items) && group.items.length > 0);
    if (!hasHelpItems) {
        const format = Format.create();
        const md = Format.createMarkdown();
        md.addText(await buildRocoMainHelpText());
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const img = await renderComponentIsHtmlToBuffer(ALemonJSHelpCard, {
        data
    });
    if (typeof img === 'boolean') {
        const format = Format.create();
        const md = Format.createMarkdown();
        md.addText(await buildRocoMainHelpText());
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const format = Format.create();
    format.addImage(img);
    void message.send({ format });
};

export { rocomHelp as default };
