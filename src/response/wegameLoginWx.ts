import {
  buildWeGameLoginSuccessText,
  createWeGameLogin,
  getWeGameUserContext,
  pickActiveBinding,
  syncWeGameBindings,
  waitWeGameLogin
} from '@src/model/wegameAccount';
import { buildTextFormat, buildTextImageFormat, getLoginStatusText } from '@src/response/wegameResponseShared';
import { useEvent, useMessage } from 'alemonjs';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const context = getWeGameUserContext(event);

  try {
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
  } catch (error) {
    void message.send({
      format: buildTextFormat(error instanceof Error ? error.message : 'WeGame 账号操作失败')
    });
  }
};
