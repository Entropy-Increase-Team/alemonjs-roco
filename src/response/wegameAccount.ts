import {
  buildBindingsText,
  createWeGameLogin,
  deleteWeGameBinding,
  formatLoginType,
  getBindingName,
  getSavedCredential,
  getWeGameBindings,
  getWeGameUserContext,
  pickActiveBinding,
  setPrimaryWeGameBinding,
  syncWeGameBindings,
  waitWeGameLogin
} from '@src/model/wegameAccount';
import { Format, useEvent, useMessage, useRoute } from 'alemonjs';

function buildTextFormat(text: string) {
  const format = Format.create();
  const md = Format.createMarkdown();

  md.addText(text);
  format.addMarkdown(md);

  return format;
}

function extractAccountIndex(raw: string, usage: string): number {
  const value = String(raw ?? '').trim();

  if (!/^\d+$/u.test(value)) {
    throw new Error(`格式：${usage}`);
  }

  return Number(value);
}

export default async () => {
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
        format: buildTextFormat(
          ['请使用另外一台设备的 QQ 扫描下方链接中的二维码完成 WeGame 登录。', `二维码地址：${qrImage}`, '登录成功后会自动同步到账号绑定列表。'].join('\n')
        )
      });

      const credential = await waitWeGameLogin(context.userIdentifier, context.userKey, 'qq', frameworkToken);
      const bindings = await syncWeGameBindings(context);
      const active = pickActiveBinding(bindings);

      void message.send({
        format: buildTextFormat(
          [
            '登录成功。',
            `登录方式：${formatLoginType(active?.loginType ?? credential.loginType ?? 'qq')}`,
            `当前账号：${active ? getBindingName(active) : (credential.role?.name ?? credential.tgpId ?? '未返回')}`,
            active?.roleId ? `角色ID：${active.roleId}` : '',
            '可发送 #wg账号列表 查看已绑定账号。'
          ]
            .filter(Boolean)
            .join('\n')
        )
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
        format: buildTextFormat(
          ['请使用另外一台设备的微信扫描下方链接中的二维码完成 WeGame 登录。', `二维码地址：${qrImage}`, '登录成功后会自动同步到账号绑定列表。'].join('\n')
        )
      });

      const credential = await waitWeGameLogin(context.userIdentifier, context.userKey, 'wechat', frameworkToken);
      const bindings = await syncWeGameBindings(context);
      const active = pickActiveBinding(bindings);

      void message.send({
        format: buildTextFormat(
          [
            '登录成功。',
            `登录方式：${formatLoginType(active?.loginType ?? credential.loginType ?? 'wechat')}`,
            `当前账号：${active ? getBindingName(active) : (credential.role?.name ?? credential.tgpId ?? '未返回')}`,
            active?.roleId ? `角色ID：${active.roleId}` : '',
            '可发送 #wg账号列表 查看已绑定账号。'
          ]
            .filter(Boolean)
            .join('\n')
        )
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

      void message.send({
        format: buildTextFormat(['WeGame 绑定列表', '', buildBindingsText(bindings), '', '切换：#wg切换账号 <序号>', '删除：#wg删除账号 <序号>'].join('\n'))
      });

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
        format: buildTextFormat(
          [
            `已切换默认账号为：${current ? getBindingName(current) : getBindingName(target)}`,
            `登录方式：${formatLoginType(current?.loginType ?? target.loginType)}`,
            current?.roleId ? `角色ID：${current.roleId}` : ''
          ]
            .filter(Boolean)
            .join('\n')
        )
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
        format: buildTextFormat(
          [
            `已删除账号：${getBindingName(target)}`,
            `剩余绑定数量：${refreshed.length}`,
            current ? `当前默认账号：${getBindingName(current)}` : '当前已没有可用绑定账号。'
          ].join('\n')
        )
      });
    }
  } catch (error) {
    void message.send({
      format: buildTextFormat(error instanceof Error ? error.message : 'WeGame 账号操作失败')
    });
  }
};
