import { buildRocomHelpText } from '../model/rocom.js';
import { useMessage, Format } from 'alemonjs';

var rocomHelp = async () => {
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    md.addText(await buildRocomHelpText());
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomHelp as default };
