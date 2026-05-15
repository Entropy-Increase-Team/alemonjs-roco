import fileUrl$1 from './config_default.yaml.js';
import fileUrl from './rocom_help_default.yaml.js';
import { storeKeys } from '../../constants/storeKeys.js';
import { parseImportedYamlResource } from '../../model/simpleYaml.js';

function normalizeText(value) {
    return String(value ?? '').trim();
}
function normalizeRocomHelpGroups(input) {
    const groups = Array.isArray(input)
        ? input
        : input && typeof input === 'object' && Array.isArray(input.groups)
            ? input.groups
            : [];
    return groups
        .map(item => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            return null;
        }
        const group = item;
        const list = Array.isArray(group.list)
            ? group.list
                .map(entry => {
                if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                    return null;
                }
                const row = entry;
                return {
                    title: normalizeText(row.title),
                    desc: normalizeText(row.desc)
                };
            })
                .filter((entry) => Boolean(entry))
            : [];
        return {
            group: normalizeText(group.group),
            list
        };
    })
        .filter((group) => Boolean(group));
}
const rocomDefaultConfigData = parseImportedYamlResource(fileUrl$1);
const rocomModuleMeta = {
    code: 'rocom',
    name: '洛克',
    description: '洛克业务模块，提供档案、家园、战绩、阵容、交换大厅、查蛋与远行商人订阅能力。',
    version: '0.2.1',
    apiDoc: 'modules/rocom/Rocom-API.md',
    commandPrefixes: ['+', '#roco', '＃roco', '/roco', '#洛克', '＃洛克', '/洛克', '#洛克王国', '＃洛克王国', '/洛克王国'],
    commands: [
        '#洛克帮助',
        '#洛克账号列表',
        '#洛克档案',
        '#洛克uid',
        '#洛克家园',
        '#洛克刷新家园',
        '#洛克战绩',
        '#洛克精灵列表',
        '#洛克阵容',
        '#洛克查看阵容',
        '#洛克交换大厅',
        '#洛克尺寸查询',
        '#洛克远行商人',
        '#洛克订阅远行商人',
        '#洛克取消订阅远行商人',
        '#洛克查蛋',
        '#洛克配种'
    ],
    help: {
        title: '#洛克帮助',
        desc: '查看洛克帮助；也可使用 +帮助'
    },
    config: {
        storeKey: storeKeys.config.rocom
    }
};
const rocomHelpYamlGroups = normalizeRocomHelpGroups(parseImportedYamlResource(fileUrl));
const rocomHelpDefaultGroups = rocomHelpYamlGroups.map(group => ({
    groupTitle: group.group,
    menuItems: group.list.map(item => ({
        cmd: item.title,
        desc: item.desc
    }))
}));

export { rocomDefaultConfigData, rocomHelpDefaultGroups, rocomModuleMeta };
