import { allElements } from '../data/config.js';
import { filterPetsByElement, allPets } from '../data/index.js';
import PetListCard from '../img/views/PetListCard.js';
import { useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var petList = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const elementName = route.rawArgs
        .map(item => String(item).trim())
        .filter(Boolean)
        .join(' ');
    let pets = allPets;
    let filterLabel = '全部';
    if (elementName && elementName !== '全部') {
        if (!allElements.includes(elementName)) {
            md.addText(`[洛克王国] 未知属性「${elementName}」\n可选属性: ${allElements.slice(1).join('、')}`);
            format.addMarkdown(md);
            void message.send({ format });
            return;
        }
        pets = filterPetsByElement(elementName);
        filterLabel = elementName;
    }
    if (pets.length === 0) {
        md.addText(`[洛克王国] 没有找到${filterLabel}属性的宠物`);
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    const img = await renderComponentIsHtmlToBuffer(PetListCard, {
        data: { pets, element: filterLabel }
    });
    if (typeof img === 'boolean') {
        md.addText('[洛克王国] 宠物列表卡片渲染失败');
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    format.addImage(img);
    void message.send({ format });
};

export { petList as default };
