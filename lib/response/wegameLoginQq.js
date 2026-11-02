import { buildWeGameLoginSuccessText, createWeGameLogin, getWeGameUserContext, pickActiveBinding, syncWeGameBindings, waitWeGameLogin } from "../model/wegameAccount.js";
import { buildTextFormat, buildTextImageFormat, getLoginStatusText } from "./wegameResponseShared.js";
import { useEvent, useMessage } from "alemonjs";

// src/response/wegameLoginQq.ts
var wegameLoginQq_default = async () => {
	const [event] = useEvent({ selects: [
		"private.message.create",
		"message.create",
		"interaction.create",
		"private.interaction.create"
	] });
	const [message] = useMessage();
	const context = getWeGameUserContext(event);
	try {
		const qrData = await createWeGameLogin(context.userIdentifier, "qq");
		const frameworkToken = qrData.frameworkToken?.trim();
		const qrImage = qrData.qr_image?.trim();
		if (!frameworkToken || !qrImage) throw new Error("接口未返回完整二维码信息");
		message.send({ format: buildTextImageFormat(["请使用另外一台设备的 QQ 扫描下方二维码完成 WeGame 登录。", "登录成功后会自动同步到账号绑定列表。"].join("\n"), qrImage) });
		const credential = await waitWeGameLogin(context.userIdentifier, context.userKey, "qq", frameworkToken, { onStatusChange: (status) => {
			if (status === "scanned") message.send({ format: buildTextFormat(`QQ二维码状态：${getLoginStatusText(status)}。`) });
		} });
		const bindings = await syncWeGameBindings(context);
		const active = pickActiveBinding(bindings);
		message.send({ format: buildTextFormat(buildWeGameLoginSuccessText(active, credential)) });
	} catch (error) {
		message.send({ format: buildTextFormat(error instanceof Error ? error.message : "WeGame 账号操作失败") });
	}
};

export { wegameLoginQq_default as default };