import { getWeGameUserContext, getWeGameBindings, getBindingName, setPrimaryWeGameBinding, syncWeGameBindings, pickActiveBinding, formatLoginType } from '../model/wegameAccount.js';
import { extractAccountIndex, buildTextFormat } from './wegameResponseShared.js';
import { useEvent, useRoute, useMessage } from 'alemonjs';

var wegameSwitchBinding = async () => {
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
    }
    catch (error) {
        void message.send({
            format: buildTextFormat(error instanceof Error ? error.message : 'WeGame 账号操作失败')
        });
    }
};

export { wegameSwitchBinding as default };
