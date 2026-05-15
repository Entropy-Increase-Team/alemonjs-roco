import { buildWeGameModuleManagementDisabledText } from '../model/wegame.js';
import { useMessage, Format } from 'alemonjs';

var wegameModuleDownload = () => {
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    md.addText(buildWeGameModuleManagementDisabledText('download'));
    format.addMarkdown(md);
    void message.send({ format });
};

export { wegameModuleDownload as default };
