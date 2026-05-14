import { buildRocomAccountsText, getRocomAccounts } from '@src/model/rocomAccount';
import { Format, useEvent, useMessage } from 'alemonjs';

export default async () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();

  try {
    const { accounts, bindingsTotal } = await getRocomAccounts(event);

    md.addText(buildRocomAccountsText(accounts, bindingsTotal));
  } catch (error) {
    md.addText(`查询洛克账号列表失败：${error instanceof Error ? error.message : '未知错误'}`);
  }

  format.addMarkdown(md);
  void message.send({ format });
};
