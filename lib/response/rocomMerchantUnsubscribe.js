import { unsubscribeRocomMerchant } from "../model/rocomMerchantSubscription.js";
import { Format, useEvent, useMessage } from "alemonjs";

// src/response/rocomMerchantUnsubscribe.ts
var rocomMerchantUnsubscribe_default = async () => {
	const [event] = useEvent({ selects: [
		"private.message.create",
		"message.create",
		"interaction.create",
		"private.interaction.create"
	] });
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	try {
		md.addText(await unsubscribeRocomMerchant(event));
	} catch (error) {
		md.addText(error instanceof Error ? error.message : "远行商人订阅操作失败");
	}
	format.addMarkdown(md);
	message.send({ format });
};

export { rocomMerchantUnsubscribe_default as default };