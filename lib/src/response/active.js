import ActiveDate from '../img/views/ActiveDate.js';
import { useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var active = async () => {
    const [message] = useMessage();
    const img = await renderComponentIsHtmlToBuffer(ActiveDate, {});
    if (typeof img === 'boolean') {
        const format = Format.create();
        const md = Format.createMarkdown();
        md.addText('[洛克王国] 图片加载失败，请稍后重试');
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const format = Format.create();
    format.addImage(img);
    void message.send({ format });
};

export { active as default };
