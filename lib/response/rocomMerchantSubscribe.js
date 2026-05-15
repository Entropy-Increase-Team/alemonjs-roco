import { subscribeRocomMerchant } from '../model/rocomMerchantSubscription.js';
import { useEvent, useRoute, useMessage, Format } from 'alemonjs';

var rocomMerchantSubscribe = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const rawArgs = String(route.rawArgs ?? '').trim();
    try {
        md.addText(await subscribeRocomMerchant(event, rawArgs));
    }
    catch (error) {
        md.addText(error instanceof Error ? error.message : '远行商人订阅操作失败');
    }
    format.addMarkdown(md);
    void message.send({ format });
};

export { rocomMerchantSubscribe as default };
