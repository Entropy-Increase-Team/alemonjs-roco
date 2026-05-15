import YunzaiHelpCard from '../img/views/Help.js';
import WeGameHelpCard from '../img/views/WeGameHelp.js';
import { getRocoWikiHelpCardData, getRocoMainHelpCardData, buildRocoWikiHelpText, buildRocoMainHelpText } from '../model/rocom.js';
import { hasInstalledWeGameModules, buildWeGameInstalledModuleHintText, getWeGameHelpCardData, buildWeGameHelpText } from '../model/wegame.js';
import { useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var help = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const routeKey = String(route.key ?? '').trim();
    const isWeGameHelp = routeKey.startsWith('wg');
    if (isWeGameHelp && hasInstalledWeGameModules()) {
        const format = Format.create();
        const md = Format.createMarkdown();
        md.addText(buildWeGameInstalledModuleHintText());
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    let data;
    let component = YunzaiHelpCard;
    if (isWeGameHelp) {
        data = getWeGameHelpCardData();
        component = WeGameHelpCard;
    }
    else if (routeKey.startsWith('roco')) {
        data = await getRocoWikiHelpCardData();
    }
    else {
        data = await getRocoMainHelpCardData();
    }
    const img = await renderComponentIsHtmlToBuffer(component, {
        data
    });
    if (typeof img === 'boolean') {
        const format = Format.create();
        const md = Format.createMarkdown();
        if (isWeGameHelp) {
            md.addText(buildWeGameHelpText());
        }
        else if (routeKey.startsWith('roco')) {
            md.addText(await buildRocoWikiHelpText());
        }
        else {
            md.addText(await buildRocoMainHelpText());
        }
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const format = Format.create();
    format.addImage(img);
    void message.send({ format });
};

export { help as default };
