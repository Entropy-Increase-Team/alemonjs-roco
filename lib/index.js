import { rocoExpose } from './expose/index.js';
import { setCron } from 'alemonjs';
import { getEggSubscriptionCron, checkRocomEggSubscriptions } from './model/rocomEggSubscription.js';
import { getMerchantSubscriptionCron, checkRocomMerchantSubscriptions } from './model/rocomMerchantSubscription.js';
import router from './router.js';

var index = defineChildren({
    register() {
        return {
            responseRouter: router,
            expose: rocoExpose
        };
    },
    onCreated() {
        void getMerchantSubscriptionCron().then(cron => {
            setCron(cron, async () => {
                await checkRocomMerchantSubscriptions();
            });
        });
        void getEggSubscriptionCron().then(cron => {
            setCron(cron, async () => {
                await checkRocomEggSubscriptions();
            });
        });
        logger.info('洛克王国助手 Server Done');
    }
});

export { index as default };
