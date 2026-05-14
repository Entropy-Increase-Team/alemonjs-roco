import { buildWeGameModuleManagementDisabledText } from '@src/model/wegame';
import { Format, useMessage } from 'alemonjs';

export default () => {
  const [message] = useMessage();
  const format = Format.create();
  const md = Format.createMarkdown();

  md.addText(buildWeGameModuleManagementDisabledText('update'));

  format.addMarkdown(md);
  void message.send({ format });
};
