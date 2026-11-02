import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
let updating = false;
function getModuleRoot() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    if (path.basename(here) === 'dist' || path.basename(here) === 'lib') {
        return path.resolve(here, '..');
    }
    return path.resolve(here, '..', '..');
}
function normalizeExecOutput(value = '') {
    return String(value || '').trim();
}
function getGitErrorMessage(error) {
    const err = error;
    return normalizeExecOutput(err?.stderr) || normalizeExecOutput(err?.stdout) || normalizeExecOutput(err?.message) || '未知错误';
}
function execModuleGit(args) {
    return execFileAsync('git', args, {
        cwd: getModuleRoot(),
        timeout: 30000,
        windowsHide: true
    });
}
async function getGitHead() {
    try {
        const result = await execModuleGit(['rev-parse', '--short', 'HEAD']);
        return normalizeExecOutput(result.stdout);
    }
    catch {
        return '';
    }
}
async function getGitBranch() {
    try {
        const result = await execModuleGit(['branch', '--show-current']);
        return normalizeExecOutput(result.stdout);
    }
    catch {
        return '';
    }
}
async function getGitCommitTime() {
    try {
        const result = await execModuleGit(['log', '-1', '--pretty=%cd', '--date=format:%F %T']);
        return normalizeExecOutput(result.stdout);
    }
    catch {
        return '';
    }
}
function formatCommit(result) {
    if (result.updated && result.beforeHead && result.afterHead) {
        return `${result.beforeHead} -> ${result.afterHead}`;
    }
    return result.afterHead || result.beforeHead || '未知提交';
}
async function updateModule() {
    if (updating) {
        throw new Error('当前已有更新任务进行中，请稍后再试。');
    }
    updating = true;
    try {
        const moduleRoot = getModuleRoot();
        if (!fs.existsSync(path.join(moduleRoot, '.git'))) {
            throw new Error('当前插件目录不是 Git 仓库，无法更新。');
        }
        const branch = await getGitBranch();
        const beforeHead = await getGitHead();
        let pullResult;
        try {
            pullResult = await execModuleGit(['pull', '--ff-only']);
        }
        catch (error) {
            throw new Error(`更新失败：${getGitErrorMessage(error)}`);
        }
        const afterHead = await getGitHead();
        const updatedAt = await getGitCommitTime();
        const output = [pullResult?.stdout, pullResult?.stderr].filter(Boolean).join('\n').trim();
        const updated = beforeHead && afterHead ? beforeHead !== afterHead : !/already up[- ]to[- ]date|已经是最新/iu.test(output);
        const lines = [updated ? '洛克王国世界 插件更新成功' : '洛克王国世界 插件已是最新'];
        if (branch) {
            lines.push(`分支：${branch}`);
        }
        lines.push(`提交：${formatCommit({ updated, beforeHead, afterHead })}`);
        if (updatedAt) {
            lines.push(`最后提交时间：${updatedAt}`);
        }
        if (updated) {
            lines.push('', '重启机器人后生效。');
        }
        return { updated, lines };
    }
    finally {
        updating = false;
    }
}
async function forceUpdateModule() {
    if (updating) {
        throw new Error('当前已有更新任务进行中，请稍后再试。');
    }
    updating = true;
    try {
        const moduleRoot = getModuleRoot();
        if (!fs.existsSync(path.join(moduleRoot, '.git'))) {
            throw new Error('当前插件目录不是 Git 仓库，无法更新。');
        }
        const branch = await getGitBranch();
        const beforeHead = await getGitHead();
        const remoteRef = `origin/${branch || 'main'}`;
        try {
            await execModuleGit(['fetch', 'origin']);
        }
        catch (error) {
            throw new Error(`拉取远程失败：${getGitErrorMessage(error)}`);
        }
        try {
            await execModuleGit(['reset', '--hard', remoteRef]);
        }
        catch (error) {
            throw new Error(`强制重置失败：${getGitErrorMessage(error)}`);
        }
        const afterHead = await getGitHead();
        const updatedAt = await getGitCommitTime();
        const updated = beforeHead !== afterHead;
        const lines = [updated ? '洛克王国世界 插件强制更新成功' : '洛克王国世界 插件已是最新'];
        if (branch) {
            lines.push(`分支：${branch}`);
        }
        lines.push(`提交：${formatCommit({ updated, beforeHead, afterHead })}`);
        if (updatedAt) {
            lines.push(`最后提交时间：${updatedAt}`);
        }
        if (updated) {
            lines.push('', '重启机器人后生效。');
        }
        return { updated, lines };
    }
    finally {
        updating = false;
    }
}

export { forceUpdateModule, updateModule };
