import { getRocomPetList, buildRocomPetListText } from '../model/rocomPets.js';
import { useEvent, useMessage, Format } from 'alemonjs';
import RocomPetPackageCard from '../img/views/RocomPetPackageCard.js';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var rocomPets = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const statusFormat = Format.create();
    const statusMarkdown = Format.createMarkdown();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        statusMarkdown.addText('正在查询精灵列表，请稍后...');
        statusFormat.addMarkdown(statusMarkdown);
        void message.send({ format: statusFormat });
        const result = await getRocomPetList(event);
        const img = await renderComponentIsHtmlToBuffer(RocomPetPackageCard, {
            data: result
        });
        if (typeof img === 'boolean') {
            md.addText(buildRocomPetListText(result));
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        format.addImage(img);
    }
    catch (error) {
        md.addText(`查询精灵列表失败：${error instanceof Error ? error.message : '未知错误'}`);
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    void message.send({ format });
};

export { rocomPets as default };
