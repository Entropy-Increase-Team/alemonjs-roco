import { buildWeGameCatalogText } from '../model/wegame.js';
import { useMessage, Format } from 'alemonjs';

var wegameModules = () => {
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    md.addText(buildWeGameCatalogText());
    format.addMarkdown(md);
    void message.send({ format });
};

export { wegameModules as default };
