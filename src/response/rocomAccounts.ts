import { buildRocomAccountsCardData, buildRocomAccountsText, getRocomAccounts } from '@src/model/rocomAccount';
import RocomAccountListCard from '@src/img/views/RocomAccountListCard';
import { Format, useEvent, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const statusFormat = Format.create();
  const statusMarkdown = Format.createMarkdown();
  const format = Format.create();
  const md = Format.createMarkdown();

  try {
    statusMarkdown.addText('正在查询洛克账号列表，请稍后...');
    statusFormat.addMarkdown(statusMarkdown);
    void message.send({ format: statusFormat });

    const { accounts, bindingsTotal } = await getRocomAccounts(event);

    const img = await renderComponentIsHtmlToBuffer(RocomAccountListCard, {
      data: buildRocomAccountsCardData(accounts, bindingsTotal)
    });

    if (typeof img === 'boolean') {
      md.addText(buildRocomAccountsText(accounts, bindingsTotal));
      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    format.addImage(img);
  } catch (error) {
    md.addText(`查询洛克账号列表失败：${error instanceof Error ? error.message : '未知错误'}`);
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  void message.send({ format });
};
