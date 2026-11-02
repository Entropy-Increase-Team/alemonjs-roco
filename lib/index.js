import { rocoExpose } from "./expose/index.js";
import { checkRocomEggSubscriptions, getEggSubscriptionCron } from "./model/rocomEggSubscription.js";
import { checkRocomMerchantSubscriptions, getMerchantSubscriptionCron } from "./model/rocomMerchantSubscription.js";
import router_default from "./router.js";
import { setCron } from "alemonjs";

// src/index.ts
var src_default = defineChildren({
	register() {
		return {
			responseRouter: router_default,
			expose: rocoExpose
		};
	},
	onCreated() {
		getMerchantSubscriptionCron().then((cron) => {
			setCron(cron, async () => {
				await checkRocomMerchantSubscriptions();
			});
		});
		getEggSubscriptionCron().then((cron) => {
			setCron(cron, async () => {
				await checkRocomEggSubscriptions();
			});
		});
		logger.info("洛克王国助手 Server Done");
	}
});

export { src_default as default };