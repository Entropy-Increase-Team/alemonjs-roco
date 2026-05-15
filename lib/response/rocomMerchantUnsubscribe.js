import { unsubscribeRocomMerchant } from '../model/rocomMerchantSubscription.js';
import { useEvent, useMessage, Format } from 'alemonjs';

var rocomMerchantUnsubscribe = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    try {
        md.addText(await unsubscribeRocomMerchant(event));
    }
    catch (error) {
        md.addText(error instanceof Error ? error.message : '远行商人订阅操作失败');
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomMerchantUnsubscribe as default };
