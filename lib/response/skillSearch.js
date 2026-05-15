import { searchSkill } from '../data/index.js';
import { useRoute, useMessage, Format } from 'alemonjs';

var skillSearch = () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const format = Format.create();
    const md = Format.createMarkdown();
    const skillName = String(route.param('keyword') ?? '').trim();
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
    const limited = results.slice(0, 10);
    const lines = limited.map(({ pet, skill }) => {
        return `【${pet.name}】${skill.name} | ${skill.element}系 | ${skill.type} | 威力:${skill.power} | 耗能:${skill.cost}\n  ${skill.desc}`;
    });
    const header = `[洛克王国] 技能搜索「${skillName}」找到 ${results.length} 条结果${results.length > 10 ? '（仅显示前10条）' : ''}:\n\n`;
    md.addText(header + lines.join('\n\n'));
    format.addMarkdown(md);
    void message.send({ format });
};

export { skillSearch as default };
