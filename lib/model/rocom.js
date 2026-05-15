import { rocomHelpDefaultGroups, rocomModuleMeta } from '../data/rocom/defaults.js';
import { readRocomHelpConfig } from './wegameResource.js';

function normalizeText(value) {
    return String(value ?? '').trim();
}
function getRocomCommandPrefixes() {
    const values = rocomModuleMeta.commandPrefixes;
    return values.map(item => normalizeText(item)).filter(Boolean);
}
function buildRocoMainHelpSubtitle() {
    return '支持前缀：+ / #roco / #洛克 / #洛克王国';
}
function buildRocoWikiHelpSubtitle() {
    return '支持前缀：#roco / #洛克 / #洛克王国';
}
function normalizeMenuGroups(groups) {
    return groups
        .map(group => ({
        groupTitle: normalizeText(group.group ?? '常用命令'),
        menuItems: Array.isArray(group.list)
            ? group.list
                .map(item => {
                const row = item;
                return {
                    cmd: normalizeText(row.title),
                    desc: normalizeText(row.desc)
                };
            })
                .filter(item => item.cmd || item.desc)
            : []
    }))
        .filter(group => group.groupTitle || group.menuItems.length > 0);
}
function normalizeHelpConfig(input) {
    if (Array.isArray(input)) {
        return input.filter(item => item && typeof item === 'object');
    }
    if (!input || typeof input !== 'object') {
        return [];
    }
    const groups = input.groups;
    return Array.isArray(groups) ? groups.filter(item => item && typeof item === 'object') : [];
}
async function getRocomHelpGroups() {
    const userGroups = normalizeMenuGroups(normalizeHelpConfig(await readRocomHelpConfig()));
    if (userGroups.length > 0) {
        return userGroups;
    }
    return rocomHelpDefaultGroups.map(group => ({
        groupTitle: group.groupTitle,
        menuItems: group.menuItems.map(item => ({
            cmd: item.cmd,
            desc: item.desc
        }))
    }));
}
function toHelpCardCategories(groups) {
    return groups.map(group => ({
        title: group.groupTitle,
        items: group.menuItems.map(item => ({
            title: item.cmd,
            desc: item.desc,
            example: item.cmd
        }))
    }));
}
function findHelpGroups(groups, titles) {
    const titleSet = new Set(titles);
    return groups.filter(group => titleSet.has(group.groupTitle));
}
function hasMenuItems(groups) {
    return groups.some(group => group.menuItems.length > 0);
}
function pickRocoMainGroups(groups) {
    const exact = findHelpGroups(groups, ['洛克王国世界']);
    if (hasMenuItems(exact)) {
        return exact;
    }
    const filtered = groups.filter(group => !['WeGame 登录', 'WeGame 管理', '图鉴资料'].includes(group.groupTitle));
    if (hasMenuItems(filtered)) {
        return filtered;
    }
    return groups;
}
function pickRocoWikiGroups(groups) {
    const exact = findHelpGroups(groups, ['图鉴资料']);
    if (hasMenuItems(exact)) {
        return exact;
    }
    const filtered = groups.filter(group => group.menuItems.some(item => item.cmd.startsWith('#roco') || item.cmd.startsWith('/roco') || item.cmd.startsWith('＃roco')));
    if (hasMenuItems(filtered)) {
        return filtered;
    }
    return groups.slice(-1);
}
async function buildRocomHelpText() {
    const groups = await getRocomHelpGroups();
    const lines = ['洛克王国世界帮助', buildRocoMainHelpSubtitle()];
    for (const group of groups) {
        lines.push('');
        lines.push(`${group.groupTitle}：`);
        for (const item of group.menuItems) {
            lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
        }
    }
    return lines.join('\n');
}
function buildRocoMainHelpText() {
    return (async () => {
        const groups = pickRocoMainGroups(await getRocomHelpGroups());
        const lines = ['洛克王国世界帮助', buildRocoMainHelpSubtitle()];
        for (const group of groups) {
            lines.push('');
            lines.push(`${group.groupTitle}：`);
            for (const item of group.menuItems) {
                lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
            }
        }
        return lines.join('\n');
    })();
}
function buildRocoWikiHelpText() {
    return (async () => {
        const groups = pickRocoWikiGroups(await getRocomHelpGroups());
        const lines = ['图鉴资料帮助', buildRocoWikiHelpSubtitle()];
        for (const group of groups) {
            lines.push('');
            lines.push(`${group.groupTitle}：`);
            for (const item of group.menuItems) {
                lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
            }
        }
        return lines.join('\n');
    })();
}
async function getRocomHelpCardData() {
    const groups = await getRocomHelpGroups();
    const subtitle = buildRocoMainHelpSubtitle();
    return {
        title: '洛克王国世界帮助',
        subtitle,
        prefixTitle: '支持前缀',
        prefixText: subtitle.replace(/^支持前缀：/, ''),
        footerBrand: 'Yunzai & WeGame Roco Kingdom Plugin',
        footerNote: 'Yunzai & WeGame Roco Kingdom Plugin',
        categories: toHelpCardCategories(groups)
    };
}
async function getWeGameHelpCardData() {
    const groups = await getRocomHelpGroups();
    const picked = findHelpGroups(groups, ['WeGame 登录', 'WeGame 管理']);
    return {
        title: 'WeGame 帮助',
        subtitle: '默认前缀：#wg',
        prefixTitle: '支持前缀',
        prefixText: '#wg',
        footerBrand: 'Yunzai & WeGame Roco Kingdom Plugin',
        footerNote: 'Yunzai & WeGame Roco Kingdom Plugin',
        categories: toHelpCardCategories(picked)
    };
}
async function getRocoWikiHelpCardData() {
    const groups = await getRocomHelpGroups();
    const picked = pickRocoWikiGroups(groups);
    const subtitle = buildRocoWikiHelpSubtitle();
    return {
        title: '图鉴资料帮助',
        subtitle,
        prefixTitle: '支持前缀',
        prefixText: subtitle.replace(/^支持前缀：/, ''),
        footerBrand: 'Yunzai & WeGame Roco Kingdom Plugin',
        footerNote: 'Yunzai & WeGame Roco Kingdom Plugin',
        categories: toHelpCardCategories(picked)
    };
}
async function getRocoMainHelpCardData() {
    const groups = await getRocomHelpGroups();
    const picked = pickRocoMainGroups(groups);
    const subtitle = buildRocoMainHelpSubtitle();
    return {
        title: '洛克王国世界帮助',
        subtitle,
        prefixTitle: '支持前缀',
        prefixText: subtitle.replace(/^支持前缀：/, ''),
        footerBrand: 'Yunzai & WeGame Roco Kingdom Plugin',
        footerNote: 'Yunzai & WeGame Roco Kingdom Plugin',
        categories: toHelpCardCategories(picked)
    };
}

export { buildRocoMainHelpText, buildRocoWikiHelpText, buildRocomHelpText, getRocoMainHelpCardData, getRocoWikiHelpCardData, getRocomCommandPrefixes, getRocomHelpCardData, getRocomHelpGroups, getWeGameHelpCardData };
