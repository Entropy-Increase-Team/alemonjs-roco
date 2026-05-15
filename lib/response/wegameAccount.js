import { getWeGameUserContext, createWeGameLogin, waitWeGameLogin, syncWeGameBindings, pickActiveBinding, buildWeGameLoginSuccessText, getWeGameBindings, getSavedCredential, buildWeGameBindingListCardData, buildBindingsText, getBindingName, setPrimaryWeGameBinding, formatLoginType, deleteWeGameBinding } from '../model/wegameAccount.js';
import WeGameBindingListCard from '../img/views/WeGameBindingListCard.js';
import { useEvent, useRoute, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

function buildTextFormat(text) {
    const format = Format.create();
    const md = Format.createMarkdown();
    md.addText(text);
    format.addMarkdown(md);
    return format;
}
function normalizeImageValue(image) {
    const value = String(image ?? '').trim();
    if (!value) {
        return value;
    }
    const dataUrlMatch = value.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/u);
    if (dataUrlMatch?.[1]) {
        return `base64://${dataUrlMatch[1]}`;
    }
    return value;
}
function buildTextImageFormat(text, image) {
    const format = buildTextFormat(text);
    format.addImage(normalizeImageValue(image));
    return format;
}
function getLoginStatusText(status) {
    if (status === 'pending') {
        return '等待扫码';
    }
    if (status === 'scanned') {
        return '已扫码，等待手机确认';
    }
    if (status === 'processing') {
        return '已确认，正在换取 WeGame 凭证';
    }
    if (status === 'done') {
        return '登录成功';
    }
    if (status === 'expired') {
        return '二维码已过期';
    }
    return status || '状态未知';
}
function extractAccountIndex(raw, usage) {
    const value = String(raw ?? '').trim();
    if (!/^\d+$/u.test(value)) {
        throw new Error(`格式：${usage}`);
    }
    return Number(value);
}
var wegameAccount = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [route] = useRoute();
    const [message] = useMessage();
    const routeKey = String(route.key ?? '').trim();
    const context = getWeGameUserContext(event);
    try {
        if (routeKey === 'wgqq登陆') {
            const qrData = await createWeGameLogin(context.userIdentifier, 'qq');
            const frameworkToken = qrData.frameworkToken?.trim();
            const qrImage = qrData.qr_image?.trim();
            if (!frameworkToken || !qrImage) {
                throw new Error('接口未返回完整二维码信息');
            }
            void message.send({
                format: buildTextImageFormat(['请使用另外一台设备的 QQ 扫描下方二维码完成 WeGame 登录。', '登录成功后会自动同步到账号绑定列表。'].join('\n'), qrImage)
            });
            const credential = await waitWeGameLogin(context.userIdentifier, context.userKey, 'qq', frameworkToken, {
                onStatusChange: status => {
                    if (status === 'scanned') {
                        void message.send({
                            format: buildTextFormat(`QQ二维码状态：${getLoginStatusText(status)}。`)
                        });
                    }
                }
            });
            const bindings = await syncWeGameBindings(context);
            const active = pickActiveBinding(bindings);
            void message.send({
                format: buildTextFormat(buildWeGameLoginSuccessText(active, credential))
            });
            return;
        }
        if (routeKey === 'wgwx登陆') {
            const qrData = await createWeGameLogin(context.userIdentifier, 'wechat');
            const frameworkToken = qrData.frameworkToken?.trim();
            const qrImage = qrData.qr_image?.trim();
            if (!frameworkToken || !qrImage) {
                throw new Error('接口未返回完整二维码信息');
            }
            void message.send({
                format: buildTextImageFormat(['请使用另外一台设备的微信扫描下方二维码完成 WeGame 登录。', '登录成功后会自动同步到账号绑定列表。'].join('\n'), qrImage)
            });
            const credential = await waitWeGameLogin(context.userIdentifier, context.userKey, 'wechat', frameworkToken, {
                onStatusChange: status => {
                    if (status === 'scanned') {
                        void message.send({
                            format: buildTextFormat(`微信二维码状态：${getLoginStatusText(status)}。`)
                        });
                    }
                }
            });
            const bindings = await syncWeGameBindings(context);
            const active = pickActiveBinding(bindings);
            void message.send({
                format: buildTextFormat(buildWeGameLoginSuccessText(active, credential))
            });
            return;
        }
        if (routeKey === 'wg账号列表') {
            const bindings = await getWeGameBindings(context.userIdentifier);
            const saved = await getSavedCredential(context.userKey);
            if (bindings.length === 0) {
                const lines = ['当前还没有已绑定的 WeGame 账号，请先发送 #wgqq登陆 或 #wgwx登陆。'];
                if (saved?.frameworkToken) {
                    lines.push('本地存在最近一次登录凭证，但服务端还没有返回绑定列表。');
                }
                void message.send({ format: buildTextFormat(lines.join('\n')) });
                return;
            }
            const img = await renderComponentIsHtmlToBuffer(WeGameBindingListCard, {
                data: buildWeGameBindingListCardData(bindings)
            });
            if (typeof img === 'boolean') {
                void message.send({
                    format: buildTextFormat(['WeGame 绑定列表', '', buildBindingsText(bindings), '', '切换：#wg切换账号 <序号>', '删除：#wg删除账号 <序号>'].join('\n'))
                });
                return;
            }
            const format = Format.create();
            format.addImage(img);
            void message.send({ format });
            return;
        }
        if (routeKey === 'wg切换账号') {
            const bindings = await getWeGameBindings(context.userIdentifier);
            if (bindings.length === 0) {
                throw new Error('当前还没有已绑定的 WeGame 账号');
            }
            const index = extractAccountIndex(String(route.param('index') ?? ''), '#wg切换账号 <序号>');
            const target = bindings[index - 1];
            if (!target) {
                throw new Error('未找到对应账号，请先发送 #wg账号列表 查看序号');
            }
            if (target.isPrimary) {
                throw new Error(`当前默认账号已经是「${getBindingName(target)}」了`);
            }
            await setPrimaryWeGameBinding(context.userIdentifier, target.id);
            const refreshed = await syncWeGameBindings(context);
            const current = pickActiveBinding(refreshed);
            void message.send({
                format: buildTextFormat([
                    `已切换默认账号为：${current ? getBindingName(current) : getBindingName(target)}`,
                    `登录方式：${formatLoginType(current?.loginType ?? target.loginType)}`,
                    `角色ID：${current?.roleId ?? target.roleId ?? '未返回'}`,
                    '后续游戏模块查询会优先使用这个账号。'
                ]
                    .filter(Boolean)
                    .join('\n'))
            });
            return;
        }
        if (routeKey === 'wg删除账号') {
            const bindings = await getWeGameBindings(context.userIdentifier);
            if (bindings.length === 0) {
                throw new Error('当前还没有已绑定的 WeGame 账号');
            }
            const index = extractAccountIndex(String(route.param('index') ?? ''), '#wg删除账号 <序号>');
            const target = bindings[index - 1];
            if (!target) {
                throw new Error('未找到对应账号，请先发送 #wg账号列表 查看序号');
            }
            await deleteWeGameBinding(context.userIdentifier, target.id);
            const refreshed = await syncWeGameBindings(context);
            const current = pickActiveBinding(refreshed);
            void message.send({
                format: buildTextFormat([
                    `已删除账号：${getBindingName(target)}`,
                    `登录方式：${formatLoginType(target.loginType)}`,
                    `剩余绑定数量：${refreshed.length}`,
                    current ? `当前默认账号：${getBindingName(current)}` : '当前已没有可用绑定账号。'
                ].join('\n'))
            });
        }
    }
    catch (error) {
        void message.send({
            format: buildTextFormat(error instanceof Error ? error.message : 'WeGame 账号操作失败')
        });
    }
};

export { wegameAccount as default };
