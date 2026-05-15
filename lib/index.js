import { setCron } from 'alemonjs';
import { getMerchantSubscriptionCron, checkRocomMerchantSubscriptions } from './model/rocomMerchantSubscription.js';
import router from './router.js';

var index = defineChildren({
    register() {
        return {
            responseRouter: router
        };
    },
    onCreated() {
        void getMerchantSubscriptionCron().then(cron => {
            setCron(cron, async () => {
                await checkRocomMerchantSubscriptions();
            });
        });
        logger.info('洛克王国助手 Server Done');
    }
});

export { index as default };
