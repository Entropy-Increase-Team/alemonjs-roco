import { getWeGameUserContext, getWeGameBindings, pickActiveBinding, requestWeGame } from './wegameAccount.js';

function normalizeText(value) {
    return String(value ?? '').trim();
}
function normalizeRocomAccount(payload) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }
    const data = payload;
    const binding = data.binding && typeof data.binding === 'object' ? data.binding : {};
    const role = data.role && typeof data.role === 'object' ? data.role : {};
    const bindingId = normalizeText(binding.id);
    const roleId = normalizeText(role.id);
    if (!bindingId && !roleId) {
        return null;
    }
    return {
        id: bindingId || roleId,
        bindingId,
        bindingIndex: 0,
        loginType: normalizeText(binding.loginType ?? binding.login_type),
        tgpId: normalizeText(binding.tgpId ?? binding.tgp_id),
        isPrimary: binding.isPrimary === true || binding.is_primary === true,
        isValid: binding.isValid !== false && binding.is_valid !== false,
        updatedAt: normalizeText(binding.updatedAt ?? binding.updated_at),
        roleId,
        roleName: normalizeText(role.name),
        level: role.level,
        starName: normalizeText(role.star_name),
        enrollDays: role.enroll_days,
        isOnline: role.is_online
    };
}
function formatLoginType(loginType) {
    const value = normalizeText(loginType).toLowerCase();
    if (value === 'qq') {
        return 'QQ扫码';
    }
    if (value === 'wechat') {
        return '微信扫码';
    }
    if (value === 'manual') {
        return '手动导入';
    }
    return value || '未返回';
}
function getAccountName(account) {
    return account.roleName || account.roleId || account.tgpId || '未命名角色';
}
function buildStatusTags(account) {
    const tags = [];
    if (account.isPrimary) {
        tags.push('主账号');
    }
    tags.push(account.isValid ? '有效' : '失效');
    if (account.isOnline !== undefined) {
        tags.push(Number(account.isOnline) === 1 ? '在线' : '离线');
    }
    return tags;
}
function buildRenderBadges(account) {
    const badges = [];
    if (account.isPrimary) {
        badges.push({ text: '主账号', type: 'primary' });
    }
    badges.push({
        text: account.isValid ? '有效' : '失效',
        type: account.isValid ? 'valid' : 'invalid'
    });
    if (account.isOnline !== undefined) {
        badges.push({
            text: Number(account.isOnline) === 1 ? '在线' : '离线',
            type: Number(account.isOnline) === 1 ? 'online' : 'offline'
        });
    }
    return badges;
}
function formatDateTime(value) {
    const text = normalizeText(value);
    if (!text) {
        return '未返回';
    }
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
        return text;
    }
    const pad = (num) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
async function fetchRocomAccounts(userIdentifier) {
    return await requestWeGame('/api/v1/games/rocom/accounts', {
        method: 'GET',
        headers: {
            'X-User-Identifier': userIdentifier
        },
        params: {
            user_identifier: userIdentifier
        }
    });
}
async function getRocomAccounts(event) {
    const context = getWeGameUserContext(event);
    const bindings = await getWeGameBindings(context.userIdentifier);
    const bindingIndexMap = new Map(bindings.map((binding, index) => [binding.id, index + 1]));
    const data = await fetchRocomAccounts(context.userIdentifier);
    const accounts = (Array.isArray(data.accounts) ? data.accounts : [])
        .map(item => {
        const account = normalizeRocomAccount(item);
        if (!account) {
            return null;
        }
        return {
            ...account,
            bindingIndex: bindingIndexMap.get(account.bindingId) ?? 0
        };
    })
        .filter((item) => Boolean(item));
    return {
        accounts,
        bindingsTotal: Math.max(Number(data.bindings_total ?? 0), bindings.length),
        activeBinding: pickActiveBinding(bindings)
    };
}
function getSubtitle(accounts, bindingsTotal) {
    const total = Math.max(bindingsTotal, accounts.length);
    if (accounts.length > 0 && total > accounts.length) {
        return `已识别 ${accounts.length} / ${total} 个可用洛克角色`;
    }
    if (accounts.length > 0) {
        return `当前共识别到 ${accounts.length} 个可用洛克角色`;
    }
    if (total > 0) {
        return `当前已绑定 ${total} 个 WeGame 账号，但还没有识别到可用洛克角色`;
    }
    return '当前还没有已绑定的 WeGame 账号';
}
function getEmptyText(bindingsTotal) {
    if (bindingsTotal > 0) {
        return '已绑定账号存在，但暂未识别到可用洛克角色';
    }
    return '暂无已绑定的 WeGame 账号';
}
function buildRocomAccountsCardData(accounts, bindingsTotal) {
    return {
        title: '洛克王国世界账号列表',
        subtitle: getSubtitle(accounts, bindingsTotal),
        bindings: accounts.map((account, index) => ({
            index: index + 1,
            bindingIndex: String(account.bindingIndex || '--'),
            nickname: getAccountName(account),
            roleId: account.roleId || '未返回',
            tgpId: account.tgpId || '未返回',
            loginType: formatLoginType(account.loginType),
            levelText: account.level !== undefined && account.level !== null && account.level !== '' ? `Lv.${account.level}` : '未返回',
            starName: account.starName || '未返回',
            updatedAt: formatDateTime(account.updatedAt),
            statusText: buildStatusTags(account).join(' | '),
            isPrimary: account.isPrimary,
            badges: buildRenderBadges(account)
        })),
        emptyText: getEmptyText(bindingsTotal),
        tip: accounts.length > 0 ? '发送 #wg切换账号 <绑定序号> 切换默认账号' : '可先发送 #wgqq登陆 或 #wgwx登陆 绑定账号',
        copyright: 'alemonjs-roco · RoCom'
    };
}
function buildRocomAccountsText(accounts, bindingsTotal) {
    if (accounts.length === 0) {
        return [
            '洛克王国世界账号列表',
            bindingsTotal > 0 ? `当前已绑定 ${bindingsTotal} 个 WeGame 账号，但还没有识别到可用洛克角色` : '当前还没有已绑定的 WeGame 账号'
        ].join('\n');
    }
    const lines = ['洛克王国世界账号列表', `当前共识别到 ${accounts.length} 个可用洛克角色`, ''];
    for (const account of accounts) {
        lines.push(`绑定序号：${account.bindingIndex || '未返回'}`);
        lines.push(`角色昵称：${getAccountName(account)}`);
        lines.push(`状态：${buildStatusTags(account).join(' | ')}`);
        lines.push(`登录方式：${formatLoginType(account.loginType)}`);
        lines.push(`角色ID：${account.roleId || '未返回'}`);
        lines.push(`WeGameID：${account.tgpId || '未返回'}`);
        lines.push(`更新时间：${formatDateTime(account.updatedAt)}`);
        lines.push('');
    }
    lines.push('切换默认账号：#wg切换账号 <绑定序号>');
    return lines.join('\n').trim();
}

export { buildRocomAccountsCardData, buildRocomAccountsText, getRocomAccounts };
