import { describeMerchantItems, getMerchantCatalog } from "../model/rocomMerchantCatalog.js";
import { Format, useMessage } from "alemonjs";

// src/response/rocomMerchantCatalog.ts
var rocomMerchantCatalog_default = async () => {
	const [message] = useMessage();
	const format = Format.create();
	const md = Format.createMarkdown();
	try {
		const catalog = await getMerchantCatalog();
		if (catalog.length === 0) {
			md.addText("暂时取不到远行商人商品列表，请稍后再试。");
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		const lines = [
			`远行商人商品列表（共 ${catalog.length} 件）`,
			"订阅写法：+订阅远行商人 1 3 5，也可以用商品名",
			"",
			...catalog.map((item) => `${item.index}. ${item.name}`),
			"",
			`示例回显：${describeMerchantItems(catalog.slice(0, 3).map((item) => item.name), catalog)}`
		];
		md.addText(lines.join("\n"));
		format.addMarkdown(md);
		message.send({ format });
	} catch (error) {
		md.addText(`获取远行商人商品列表失败：${error instanceof Error ? error.message : "未知错误"}`);
		format.addMarkdown(md);
		message.send({ format });
	}
};

export { rocomMerchantCatalog_default as default };