import { getRocomRecord, buildRocomRecordCardData, buildRocomRecordText } from '../model/rocomExtraQuery.js';
import RocomRecordCard from '../img/views/RocomRecordCard.js';
import { useEvent, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomRecord = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        statusMarkdown.addText('正在查询闪耀大赛战绩，请稍后...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const result = await getRocomRecord(event);
        const img = await renderComponentIsHtmlToBuffer(RocomRecordCard, {
            data: buildRocomRecordCardData(result)
        });
        if (typeof img === 'boolean') {
            md.addText(buildRocomRecordText(result));
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        format.addImage(img);
    }
    catch (error) {
        md.addText(`查询大赛战绩失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    void message.send({ format });
};

export { rocomRecord as default };
