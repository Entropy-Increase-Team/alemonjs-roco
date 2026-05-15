import { getWeGameUserContext, getWeGameBindings, deleteWeGameBinding, syncWeGameBindings, pickActiveBinding, getBindingName, formatLoginType } from '../model/wegameAccount.js';
import { extractAccountIndex, buildTextFormat } from './wegameResponseShared.js';
import { useEvent, useRoute, useMessage } from 'alemonjs';

var wegameDeleteBinding = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [route] = useRoute();
    const [message] = useMessage();
    const context = getWeGameUserContext(event);
    try {
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
    catch (error) {
        void message.send({
            format: buildTextFormat(error instanceof Error ? error.message : 'WeGame 账号操作失败')
        });
    }
};

export { wegameDeleteBinding as default };
