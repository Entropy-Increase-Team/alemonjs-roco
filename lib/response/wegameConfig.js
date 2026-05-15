import { buildWeGameConfigRegistryText, buildWeGameConfigSummary } from '../model/wegameConfig.js';
import { useRoute, useMessage, Format } from 'alemonjs';

var wegameConfig = async () => {
    const [route] = useRoute();
    const [message] = useMessage();
    const code = route.rawArgs
        .map(item => String(item).trim())
        .filter(Boolean)
        .join(' ');
    const format = Format.create();
    const md = Format.createMarkdown();
    if (!code) {
        md.addText([
            'WeGame 配置注册表',
            buildWeGameConfigRegistryText(),
            '',
            '查看详情：#wg配置 wegame-core',
            '查看模块：#wg配置 rocom',
            '查看运行数据：#wg配置 rocom-merchant-runtime'
        ].join('\n'));
        format.addMarkdown(md);
        void message.send({ format });
        return;
    }
    md.addText(await buildWeGameConfigSummary(code));
    format.addMarkdown(md);
    void message.send({ format });
};

export { wegameConfig as default };
