import WeGameBindingListCard from '../img/views/WeGameBindingListCard.js';
import { getWeGameUserContext, getWeGameBindings, getSavedCredential, buildWeGameBindingListCardData, buildBindingsText } from '../model/wegameAccount.js';
import { buildTextFormat } from './wegameResponseShared.js';
import { useEvent, useMessage, Format } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

var wegameBindingList = async () => {
    const [event] = useEvent({
        selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
    });
    const [message] = useMessage();
    const context = getWeGameUserContext(event);
    try {
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
    }
    catch (error) {
        void message.send({
            format: buildTextFormat(error instanceof Error ? error.message : 'WeGame 账号操作失败')
        });
    }
};

export { wegameBindingList as default };
