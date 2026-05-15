import { buildWeGameHelpText } from '../model/wegame.js';
import { useMessage, Format } from 'alemonjs';

var wegameHelp = () => {
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    md.addText(buildWeGameHelpText());
    format.addMarkdown(md);
    void message.send({ format });
};

export { wegameHelp as default };
