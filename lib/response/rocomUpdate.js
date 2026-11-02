import { updateModule } from '../model/rocomUpdate.js';
import { useMessage, Format } from 'alemonjs';

var rocomUpdate = async () => {
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        statusMarkdown.addText('正在更新洛克王国世界插件...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const result = await updateModule();
        md.addText(result.lines.join('\n'));
        format.addMarkdown(md);
        void message.send({ format });
    }
    catch (error) {
        md.addText(error instanceof Error ? error.message : '更新失败');
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { rocomUpdate as default };
