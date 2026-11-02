import { rocoExpose } from './expose';
import { setCron } from 'alemonjs';
import { checkRocomEggSubscriptions, getEggSubscriptionCron } from './model/rocomEggSubscription';
import { checkRocomMerchantSubscriptions, getMerchantSubscriptionCron } from './model/rocomMerchantSubscription';
import router from './router';

export default defineChildren({
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
