import { rocomHelpDefaultGroups, rocomModuleMeta } from '../data/rocom/defaults.js';
import { readRocomHelpConfig } from './wegameResource.js';

function normalizeText(value) {
    return String(value ?? '').trim();
}
function getRocomCommandPrefixes() {
    const values = rocomModuleMeta.commandPrefixes;
    return values.map(item => normalizeText(item)).filter(Boolean);
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
async function buildRocomHelpText() {
    const groups = await getRocomHelpGroups();
    const lines = ['洛克帮助', '帮助入口：#洛克帮助 / #roco帮助 / +帮助'];
    for (const group of groups) {
        lines.push('');
        lines.push(`${group.groupTitle}：`);
        for (const item of group.menuItems) {
            lines.push(item.desc ? `${item.cmd} - ${item.desc}` : item.cmd);
        }
    }
    return lines.join('\n');
}

export { buildRocomHelpText, getRocomCommandPrefixes, getRocomHelpGroups };
