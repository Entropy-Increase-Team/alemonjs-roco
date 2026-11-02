import { action, array, booleanSchema, dataQuery, emptyInput, numberSchema, object, record, stringSchema, strings, text } from "./shared.js";
import { createWeGameLogin, deleteWeGameBinding, getWeGameBindings, getWeGameRuntimeConfig, setPrimaryWeGameBinding, syncWeGameBindings, waitWeGameLogin } from "../model/wegameAccount.js";
import { ExposeError } from "alemonjs";
import { randomUUID } from "node:crypto";

// src/expose/accounts.ts
const bindingSchema = record({
	...strings("id", "name", "loginType", "roleId"),
	isPrimary: booleanSchema,
	isValid: booleanSchema
});
function projectBinding(binding) {
	return {
		id: binding.id,
		name: binding.nickname,
		loginType: binding.loginType,
		roleId: binding.roleId,
		isPrimary: binding.isPrimary,
		isValid: binding.isValid
	};
}
const loginSchema = record({
	...strings("sessionId", "platform", "qrImage", "message"),
	state: {
		type: "string",
		enum: [
			"none",
			"starting",
			"ready",
			"waiting",
			"completed",
			"failed",
			"cancelled",
			"expired"
		]
	},
	expiresAt: numberSchema
});
const sessions = /* @__PURE__ */ new Map();
const retentionMs = 3e5;
function snapshot(session) {
	return {
		sessionId: session?.id ?? "",
		platform: session?.platform ?? "",
		qrImage: session?.state === "ready" || session?.state === "waiting" ? session.qrImage : "",
		state: session?.state ?? "none",
		expiresAt: session?.expires ?? 0,
		message: session?.message ?? ""
	};
}
function settle(session, state, message) {
	session.state = state;
	session.message = message;
	session.retainUntil = Date.now() + retentionMs;
	if (![
		"ready",
		"waiting",
		"starting"
	].includes(state)) {
		session.token = "";
		session.qrImage = "";
	}
}
function prune() {
	for (const [owner, session] of sessions) {
		if ([
			"ready",
			"starting",
			"waiting"
		].includes(session.state) && Date.now() >= session.expires) {
			settle(session, "expired", "登录会话已过期，请重新创建");
			session.controller.abort();
		}
		if (![
			"ready",
			"starting",
			"waiting"
		].includes(session.state) && Date.now() > session.retainUntil) sessions.delete(owner);
	}
}
function owned(user, id) {
	prune();
	const session = sessions.get(user.userKey);
	if (session?.id !== id) throw new ExposeError("FORBIDDEN", "登录会话不存在或不属于当前用户");
	return session;
}
const accountActions = {
	get_bindings: dataQuery("查询当前用户的账号绑定，后续操作使用稳定 id，不使用列表序号", emptyInput, record({ bindings: array(bindingSchema) }), async (_input, user) => ({ bindings: (await getWeGameBindings(user.userIdentifier)).map(projectBinding) })),
	start_login: dataQuery("创建登录二维码；同用户同平台重复调用恢复原会话，不重复创建；调用超时可用 get_login_session 恢复", object({ platform: {
		type: "string",
		enum: ["qq", "wechat"]
	} }, ["platform"]), loginSchema, async (input, user) => {
		prune();
		const existing = sessions.get(user.userKey);
		if (existing && [
			"starting",
			"ready",
			"waiting"
		].includes(existing.state)) {
			if (existing.platform !== input.platform) throw new ExposeError("INVALID_INPUT", "已有其他平台的登录会话，请先取消");
			return snapshot(existing);
		}
		if (!existing && sessions.size >= 100) throw new ExposeError("HANDLER_FAILED", "登录请求过多，请稍后重试");
		const session = {
			id: randomUUID(),
			owner: user.userKey,
			platform: input.platform,
			token: "",
			qrImage: "",
			expires: Date.now() + 18e4,
			retainUntil: 0,
			state: "starting",
			message: "",
			controller: new AbortController()
		};
		sessions.set(user.userKey, session);
		session.pending = (async () => {
			try {
				const config = await getWeGameRuntimeConfig();
				session.controller.signal.throwIfAborted();
				session.expires = Date.now() + config.login_timeout_ms;
				const result = await createWeGameLogin(user.userIdentifier, input.platform, session.controller.signal);
				session.controller.signal.throwIfAborted();
				if (!result.frameworkToken?.trim() || !result.qr_image?.trim()) throw new Error("invalid QR response");
				session.token = result.frameworkToken;
				session.qrImage = result.qr_image;
				settle(session, "ready", "请扫码后调用 wait_login");
			} catch {
				if (!session.controller.signal.aborted) settle(session, "failed", "创建二维码失败，请重试");
			}
		})();
		await session.pending;
		return snapshot(session);
	}, "write"),
	get_login_session: dataQuery("恢复当前用户的登录会话及最终结果，包括创建请求超时后的二维码", emptyInput, loginSchema, (_input, user) => {
		prune();
		return snapshot(sessions.get(user.userKey));
	}),
	cancel_login: dataQuery("取消当前用户指定的登录会话并停止轮询；已完成登录不会撤销", object({ sessionId: text }, ["sessionId"]), loginSchema, (input, user) => {
		const session = owned(user, input.sessionId);
		if ([
			"starting",
			"ready",
			"waiting"
		].includes(session.state)) {
			settle(session, "cancelled", "已取消登录等待；已提交的账号状态请查询绑定列表核对");
			session.controller.abort();
		}
		return snapshot(session);
	}, "write"),
	wait_login: dataQuery("等待扫码并同步账号；重复调用共享同一轮询，超时后查询 get_login_session，不丢弃最终结果", object({ sessionId: text }, ["sessionId"]), loginSchema, async (input, user) => {
		const session = owned(user, input.sessionId);
		if (session.state === "starting") return snapshot(session);
		if (session.state === "ready") {
			session.state = "waiting";
			session.pending = (async () => {
				try {
					await waitWeGameLogin(user.userIdentifier, user.userKey, session.platform, session.token, { signal: session.controller.signal });
					session.controller.signal.throwIfAborted();
					settle(session, "completed", "登录成功，请查询账号列表");
				} catch {
					if (!session.controller.signal.aborted) settle(session, "failed", "登录等待失败或二维码过期，请查询账号状态后重试");
				}
			})();
		}
		await session.pending;
		return snapshot(session);
	}, "write"),
	switch_binding: action("按 get_bindings 返回的稳定 bindingId 切换当前用户账号", object({ bindingId: text }, ["bindingId"]), record({
		status: {
			type: "string",
			enum: ["success", "partial"]
		},
		data: record({
			bindingId: stringSchema,
			changed: booleanSchema,
			synced: booleanSchema
		})
	}), async (input, user) => {
		const target = (await getWeGameBindings(user.userIdentifier)).find((binding) => binding.id === input.bindingId);
		if (!target) throw new ExposeError("FORBIDDEN", "当前用户没有该绑定账号");
		if (!target.isPrimary) await setPrimaryWeGameBinding(user.userIdentifier, target.id);
		let synced = true;
		try {
			await syncWeGameBindings(user);
		} catch {
			synced = false;
		}
		return {
			status: synced ? "success" : "partial",
			data: {
				bindingId: target.id,
				changed: !target.isPrimary,
				synced
			}
		};
	}, "write"),
	delete_binding: action("按稳定 bindingId 删除当前用户账号；目标不存在时返回 absent，不会改删其他账号", object({ bindingId: text }, ["bindingId"]), record({
		status: {
			type: "string",
			enum: ["success", "partial"]
		},
		data: record({
			bindingId: stringSchema,
			outcome: {
				type: "string",
				enum: ["deleted", "absent"]
			},
			synced: booleanSchema
		})
	}), async (input, user) => {
		const target = (await getWeGameBindings(user.userIdentifier)).find((binding) => binding.id === input.bindingId);
		if (!target) return {
			status: "success",
			data: {
				bindingId: input.bindingId,
				outcome: "absent",
				synced: false
			}
		};
		await deleteWeGameBinding(user.userIdentifier, target.id);
		let synced = true;
		try {
			await syncWeGameBindings(user);
		} catch {
			synced = false;
		}
		return {
			status: synced ? "success" : "partial",
			data: {
				bindingId: target.id,
				outcome: "deleted",
				synced
			}
		};
	}, "write")
};

export { accountActions };