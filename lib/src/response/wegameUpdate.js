import { buildWeGameModuleManagementDisabledText } from '../model/wegame.js';
import { useMessage, Format } from 'alemonjs';

var wegameUpdate = () => {
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    md.addText(buildWeGameModuleManagementDisabledText('update'));
    format.addMarkdown(md);
    void message.send({ format });
};

export { wegameUpdate as default };
