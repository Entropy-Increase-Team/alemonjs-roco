import { getWeGameUserContext, createWeGameLogin, waitWeGameLogin, syncWeGameBindings, pickActiveBinding, buildWeGameLoginSuccessText } from '../model/wegameAccount.js';
import { buildTextImageFormat, buildTextFormat, getLoginStatusText } from './wegameResponseShared.js';
import { useEvent, useMessage } from 'alemonjs';

var wegameLoginQq = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const context = getWeGameUserContext(event);
    try {
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
    }
    catch (error) {
        void message.send({
            format: buildTextFormat(error instanceof Error ? error.message : 'WeGame 账号操作失败')
        });
    }
};

export { wegameLoginQq as default };
