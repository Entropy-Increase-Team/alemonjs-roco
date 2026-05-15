import { rocomModuleMeta } from '../data/rocom/defaults.js';

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
function getInstalledWeGameModules() {
    return getBuiltinWeGameModules().map(({ source: _source, ...item }) => item);
}
function buildWeGameHelpText() {
    const installed = getInstalledWeGameModules();
    const lines = [
        'WeGame 帮助',
        `默认前缀：${WEGAME_PREFIX}`,
        '',
        '基础指令：',
        `- ${formatCommand('帮助')} | 查看帮助`,
        `- ${formatCommand('qq登陆')} | 使用 QQ 扫码登录 WeGame`,
        `- ${formatCommand('wx登陆')} | 使用微信扫码登录 WeGame`,
        `- ${formatCommand('账号列表')} | 查看当前已绑定 WeGame 账号列表`,
        `- ${formatCommand('切换账号 <序号>')} | 切换当前默认账号`,
        `- ${formatCommand('删除账号 <序号>')} | 删除指定绑定账号`,
        `- ${formatCommand('模块')} | 查看当前应用已接入模块`,
        `- ${formatCommand('模块下载 <模块名>')} | 当前应用不提供模块仓库下载`,
        `- ${formatCommand('更新')} | 当前应用不负责仓库或模块更新`,
        '',
        '游戏模块：'
    ];
    if (installed.length === 0) {
        lines.push('- 暂无内建游戏模块');
        return lines.join('\n');
    }
    for (const item of installed) {
        const title = item.help?.title ?? item.commands.find(command => /(帮助|help)/i.test(command)) ?? `${item.name}帮助`;
        const desc = item.help?.desc ?? `${item.name}帮助`;
        lines.push(`- ${title} | ${desc}`);
    }
    return lines.join('\n');
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

export { WEGAME_PREFIX, buildWeGameCatalogText, buildWeGameHelpText, buildWeGameModuleManagementDisabledText, getInstalledWeGameModules };
