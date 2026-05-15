import { rocomModuleMeta } from '../data/rocom/defaults.js';
import { wegameHelpDefaultConfigData } from '../data/wegame/defaults.js';

const WEGAME_PREFIX = '#wg';
function normalizeText(value) {
    return String(value ?? '').trim();
}
function formatCommand(command = '') {
    return `${WEGAME_PREFIX}${normalizeText(command)}`;
}
function getBuiltinWeGameModules() {
    return [
        {
            ...rocomModuleMeta,
            installed: true,
            enabled: true,
            source: 'builtin'
        }
    ];
}
function normalizeHelpGroups(input) {
    const groups = input && typeof input === 'object' && !Array.isArray(input) && Array.isArray(input.help_group)
        ? input.help_group
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
                    cmd: normalizeText(row.title),
                    desc: normalizeText(row.desc)
                };
            })
                .filter((entry) => Boolean(entry))
            : [];
        return {
            groupTitle: normalizeText(group.group),
            menuItems: list
        };
    })
        .filter((group) => Boolean(group));
}
function getWeGameHelpGroups() {
    return normalizeHelpGroups(wegameHelpDefaultConfigData);
}
function buildWeGameHelpText() {
    const groups = getWeGameHelpGroups();
    const lines = ['WeGame 帮助', `默认前缀：${WEGAME_PREFIX}`];
    for (const group of groups) {
        lines.push('');
        lines.push(`${group.groupTitle}：`);
        for (const item of group.menuItems) {
            lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
        }
    }
    return lines.join('\n');
}
function buildWeGameInstalledModuleHintText() {
    return [
        '已安装游戏组件，常用核心命令：',
        '`#wg更新` - 更新 WeGame 核心插件与全部已安装模块',
        '`#wg更新 [模块名]` - 仅更新指定模块',
        '更多帮助请查看 +帮助'
    ].join('\n');
}
function getWeGameHelpCardData() {
    const groups = getWeGameHelpGroups();
    return {
        title: 'WeGame 帮助',
        subtitle: `默认前缀：${WEGAME_PREFIX}`,
        prefixTitle: '默认前缀',
        prefixText: WEGAME_PREFIX,
        footerBrand: 'WeGame-plugin',
        footerNote: 'WeGame-plugin',
        categories: groups.map(group => ({
            title: group.groupTitle,
            items: group.menuItems.map(item => ({
                title: item.cmd,
                desc: item.desc,
                example: item.cmd
            }))
        }))
    };
}
function getInstalledWeGameModules() {
    return getBuiltinWeGameModules().map(({ source: _source, ...item }) => item);
}
function hasInstalledWeGameModules() {
    return getBuiltinWeGameModules().length > 0;
}
function buildWeGameCatalogText() {
    const lines = ['WeGame 模块列表', '仓库：当前应用内建模块', '默认分支：当前应用发布版本', ''];
    const installed = getBuiltinWeGameModules();
    lines.push('已安装模块：');
    if (installed.length === 0) {
        lines.push('暂无');
        return lines.join('\n');
    }
    for (const item of installed) {
        lines.push(`- ${item.code} | ${item.name}`);
    }
    lines.push('');
    lines.push('远程可下载模块：');
    lines.push('当前应用不提供远程模块仓库。');
    lines.push('');
    lines.push(`下载命令：${formatCommand('模块下载 <模块名>')}`);
    lines.push(`更新命令：${formatCommand('更新 [模块名]')}`);
    return lines.join('\n');
}
function buildWeGameModuleManagementDisabledText(action) {
    return action === 'download'
        ? ['当前应用不提供模块仓库下载。', `可发送 ${formatCommand('模块')} 查看当前已接入模块。`, '如需新增能力，请更新当前应用版本。'].join('\n')
        : ['当前应用不负责仓库或模块在线更新。', '如需更新能力，请更新当前应用发布版本。', `可发送 ${formatCommand('模块')} 查看当前已接入模块。`].join('\n');
}

export { WEGAME_PREFIX, buildWeGameCatalogText, buildWeGameHelpText, buildWeGameInstalledModuleHintText, buildWeGameModuleManagementDisabledText, getInstalledWeGameModules, getWeGameHelpCardData, hasInstalledWeGameModules };
