import { searchSkill } from '@src/data/index';
import { Format, useEvent, useMessage } from 'alemonjs';

export default () => {
  const [event] = useEvent({
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create']
  });
  const [message] = useMessage();
  const text = event.current.MessageText?.trim() ?? '';

  const format = Format.create();
  const md = Format.createMarkdown();

  // 提取技能名
  const skillName = text.replace(/^[!！/#＃](?:roco|洛克)(?:技能|jn)\s*/, '').trim();

  if (!skillName) {
    md.addText('[洛克王国] 请输入技能名，例如: #洛克技能 闪光冲击');
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const results = searchSkill(skillName);

  if (results.length === 0) {
    md.addText(`[洛克王国] 未找到技能「${skillName}」`);
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 最多展示 10 个结果
  const limited = results.slice(0, 10);
  const lines = limited.map(({ pet, skill }) => {
    return `【${pet.name}】${skill.name} | ${skill.element}系 | ${skill.type} | 威力:${skill.power} | 耗能:${skill.cost}\n  ${skill.desc}`;
  });

  const header = `[洛克王国] 技能搜索「${skillName}」找到 ${results.length} 条结果${results.length > 10 ? '（仅显示前10条）' : ''}:\n\n`;

  md.addText(header + lines.join('\n\n'));
  format.addMarkdown(md);
  void message.send({ format });
};
