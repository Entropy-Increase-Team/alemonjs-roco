import { setCron } from 'alemonjs';
import { checkRocomMerchantSubscriptions, getMerchantSubscriptionCron } from './model/rocomMerchantSubscription';
import router from './router';

export default defineChildren({
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
