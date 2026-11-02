import { eggPostSchema, projectPost, eggFiltersSchema, projectFilters } from './schemas';
import { ExposeError, getCurrentEvent, isMaster } from 'alemonjs';
import { query, emptyInput, object, text, page, uid, dataQuery, action, record, array, strings, stringSchema, numberSchema } from './shared';
import { bindRocomUid } from '../model/rocomBind';
import {
  fetchEggExchanges,
  fetchMyEggExchanges,
  postEggExchange,
  closeEggExchange,
  createEggExchangeSubscription,
  fetchEggExchangeSubscriptions,
  deleteEggExchangeSubscription
} from '../model/rocomEggExchange';
import { updateModule, forceUpdateModule } from '../model/rocomUpdate';
import { buildWeGameConfigRegistryText, buildWeGameConfigSummary } from '../model/wegameConfig';
import { buildWeGameHelpText, buildWeGameCatalogText, buildWeGameModuleManagementDisabledText } from '../model/wegame';

export function requireMaster() {
  const event = getCurrentEvent();

  if (!event || !isMaster(event.UserId, event.Platform)) {
    throw new ExposeError('FORBIDDEN', '此接口仅允许机器人管理员调用');
  }
}

export const writeActions = {
  bind_uid: query<{ uid: string }>('绑定当前用户的游戏 UID', object({ uid: text }, ['uid']), (input, user) => bindRocomUid(user, uid(input.uid)), 'write'),
  get_egg_exchanges: dataQuery(
    '查询换蛋广场',
    object({ page }),
    record({ items: array(eggPostSchema), page: numberSchema, totalPages: numberSchema, total: numberSchema }),
    async (input: { page?: number }, user) => {
      const data = await fetchEggExchanges(input.page ?? 1, user.userIdentifier);
      const items = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : [];

      return {
        items: items.map(projectPost),
        page: Number(data.page_no ?? input.page ?? 1),
        totalPages: Number(data.total_pages ?? 1),
        total: Number(data.total ?? items.length)
      };
    }
  ),
  get_my_egg_exchanges: dataQuery('查询当前用户发布的换蛋帖', emptyInput, record({ items: array(eggPostSchema) }), async (_input, user) => {
    const data = await fetchMyEggExchanges(user.userIdentifier);

    return { items: (Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : []).map(projectPost) };
  }),
  post_egg_exchange: dataQuery(
    '发布换蛋帖，提交后由后端审核；不要自动重试',
    object({ have: text, want: text, remark: text }, ['have', 'want']),
    record(strings('postId', 'text')),
    async (input: { have: string; want: string; remark?: string }, user) => {
      if (!input.have.trim() || !input.want.trim()) {
        throw new ExposeError('INVALID_INPUT', '我有和想要不能为空');
      }
      const result = await postEggExchange({ have_text: input.have, want_text: input.want, remark: input.remark }, user.userIdentifier);

      return { postId: String(result.post_id ?? result.id ?? ''), text: '换蛋帖已提交审核' };
    },
    'write'
  ),
  close_egg_exchange: query<{ id: string }>(
    '关闭当前用户的换蛋帖',
    object({ id: text }, ['id']),
    async (input, user) => {
      await closeEggExchange(input.id, user.userIdentifier);

      return `已关闭换蛋帖 ${input.id}`;
    },
    'write'
  ),
  get_egg_subscriptions: dataQuery(
    '查询当前用户的换蛋订阅',
    emptyInput,
    record({ subscriptions: array(record({ id: stringSchema, filters: eggFiltersSchema })) }),
    async (_input, user) => {
      const data = await fetchEggExchangeSubscriptions(user.userIdentifier);

      return {
        subscriptions: (Array.isArray(data.subscriptions) ? (data.subscriptions as Record<string, unknown>[]) : []).map(item => ({
          id: String(item.subscription_id ?? ''),
          filters: projectFilters(item.filters)
        }))
      };
    }
  ),
  subscribe_egg_exchange: dataQuery(
    '创建换蛋订阅，至少提供一项筛选条件；不要自动重试',
    object({ want_text: text, have_text: text, want_note: text, id: text, q: text }),
    record(strings('subscriptionId', 'text')),
    async (input: { want_text?: string; have_text?: string; want_note?: string; id?: string; q?: string }, user) => {
      const filters = Object.fromEntries(
        Object.entries(input)
          .map(([key, value]) => [key, value.trim()])
          .filter(([, value]) => value)
      );

      if (!Object.keys(filters).length) {
        throw new ExposeError('INVALID_INPUT', '至少提供一项筛选条件');
      }
      const result = await createEggExchangeSubscription(filters, user.userIdentifier);
      const sub = result.subscription as Record<string, unknown> | undefined;

      return { subscriptionId: String(sub?.subscription_id ?? ''), text: '换蛋订阅已创建' };
    },
    'write'
  ),
  unsubscribe_egg_exchange: action(
    '取消换蛋订阅，省略 ID 时取消当前用户全部换蛋订阅；可能部分成功，不自动重试',
    object({ id: text }),
    record({ status: { type: 'string', enum: ['success', 'partial', 'rejected'] }, removed: array(stringSchema), failed: array(stringSchema) }),
    async (input: { id?: string }, user) => {
      const data = await fetchEggExchangeSubscriptions(user.userIdentifier);
      const subscriptions = Array.isArray(data.subscriptions) ? (data.subscriptions as Array<Record<string, unknown>>) : [];
      const ids = subscriptions.map(item => String(item.subscription_id ?? '')).filter(Boolean);

      if (input.id && !ids.includes(input.id)) {
        throw new ExposeError('FORBIDDEN', '未找到当前用户的该订阅');
      }
      const removed: string[] = [];
      const failed: string[] = [];

      for (const id of input.id ? [input.id] : ids) {
        try {
          await deleteEggExchangeSubscription(id, user.userIdentifier);
          removed.push(id);
        } catch {
          failed.push(id);
        }
      }

      return { status: failed.length ? (removed.length ? 'partial' : 'rejected') : 'success', removed, failed };
    },
    'write'
  ),
  get_wegame_help: query('查询 WeGame 账号指令帮助', emptyInput, buildWeGameHelpText),
  get_modules: query('查询 WeGame 模块目录', emptyInput, buildWeGameCatalogText),
  download_module: query('返回现有模块下载功能的可用性说明；此版本不执行下载', emptyInput, () => buildWeGameModuleManagementDisabledText('download')),
  update_wegame: query('返回现有 WeGame 更新功能的可用性说明；此版本不执行更新', emptyInput, () => buildWeGameModuleManagementDisabledText('update')),
  get_config: query<{ code?: string }>(
    '管理员查询配置，敏感字段隐藏',
    object({ code: { type: 'string', enum: ['wegame-core', 'rocom', 'rocom-merchant-runtime'] } }),
    input => {
      requireMaster();
      if (!input.code) {
        return buildWeGameConfigRegistryText();
      }

      return buildWeGameConfigSummary(input.code, true);
    }
  ),
  update_plugin: query(
    '管理员执行插件快进更新，不自动重试',
    emptyInput,
    async () => {
      requireMaster();

      return (await updateModule()).lines.join('\n');
    },
    'write'
  ),
  force_update_plugin: query<{ confirm: boolean }>(
    '管理员强制更新，会覆盖插件本地修改，必须明确 confirm=true；不自动重试',
    object({ confirm: { type: 'boolean' } }, ['confirm']),
    async input => {
      requireMaster();
      if (input.confirm !== true) {
        throw new ExposeError('INVALID_INPUT', '强制更新需要明确确认覆盖本地修改');
      }

      return (await forceUpdateModule()).lines.join('\n');
    },
    'write'
  )
};
