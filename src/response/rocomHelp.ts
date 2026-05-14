import { buildRocomHelpText } from '@src/model/rocom';
import { Format, useMessage } from 'alemonjs';

export default async () => {
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();

  md.addText(await buildRocomHelpText());
  format.addMarkdown(md);
  void message.send({ format });
};
