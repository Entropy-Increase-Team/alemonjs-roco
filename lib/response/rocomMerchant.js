import RocomMerchantCard from '../img/views/RocomMerchantCard.js';
import { buildRocomMerchantCardData, buildRocomMerchantText } from '../model/rocomMerchant.js';
import { getRocomMerchantInfo } from '../model/rocomExtraQuery.js';
import { useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomMerchant = async () => {
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        statusMarkdown.addText('正在查询远行商人信息...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const result = await getRocomMerchantInfo();
        const img = await renderComponentIsHtmlToBuffer(RocomMerchantCard, {
            data: buildRocomMerchantCardData(result)
        });
        if (typeof img === 'boolean') {
            md.addText(buildRocomMerchantText(result));
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        format.addImage(img);
        void message.send({ format });
    }
    catch (error) {
        md.addText(error instanceof Error ? error.message : '工具查询失败');
        format.addMarkdown(md);
        void message.send({ format });
    }
};

export { rocomMerchant as default };
