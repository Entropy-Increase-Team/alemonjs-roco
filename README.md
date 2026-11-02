# 阿柠檬-洛克王国世界

可通过以下方式部署运行环境

`alemonx` https://github.com/lemonade-lab/alemonx/releases

`alemongo` https://github.com/lemonade-lab/alemongo

`alemondesk` https://github.com/lemonade-lab/alemondesk

如果你并不是熟悉阿柠檬生态设计可访问 https://alemonjs.com

### 安装

- 地址

```sh
https://github.com/xiuxianjs/alemonjs-roco.git
```

- branch

```sh
release
```

### 起步

`#洛克帮助`

## 配置

```yaml
alemonjs-roco:
  wegame:
    # WeGame 后端地址，结尾不要带 /
    base_url: https://wegame.shallow.ink
    # 开发者 WeGame API Key，scope 必须是 wegame
    # 示例：xx_xxxx_xxxxxxxxxxxxxxxx
    # 用于登录、账号绑定、账号管理，以及已获批权限的游戏模块接口
    # 例如洛克模块需要这把 key 已获批 game:rocom 下的 rocom.access
    # 若留空，会自动尝试匿名令牌，仅可用于无需 API Key 的接口
    api_key: ''
    # 第三方客户端类型，只能是 bot / app / web
    # ALemonJS 机器人请填写 bot
    # 示例：bot
    client_type: bot
    # 当前客户端实例 ID，可用于区分多机器人实例
    # 示例：ALemonJS-bot-01
    client_id: ''
    # 设备指纹，留空时会按机器信息自动生成
    # 示例：ALemonJS_rocom_xxxxxxxxx_abcdef1234567890
    device_fingerprint: ''
    # 请求超时时间，单位毫秒
    # 示例：15000
    request_timeout_ms: 15000
    # 登录状态轮询间隔，单位毫秒
    # 示例：2000
    login_poll_interval_ms: 2000
    # 等待扫码登录完成的超时时间，单位毫秒
    # 示例：180000
    login_timeout_ms: 180000
```

## 免责声明

- 勿用于以盈利为目的的场景

- 代码开放，无需征得特殊同意，可任意使用。能备注来源最好，但不强求

- 图片与其他素材均来自于网络，仅供交流学习使用，如有侵权请联系，会立即删除

## Expose 插件通讯

使用 ALemonJS 2.1.119 或更高兼容版本。插件注册 `roco` 协议，契约版本为 `2.0.0`，提供 54 个接口（38 个 read、16 个 write），与当前路由的 49 个处理器建立映射。文本查询返回 `{ status: "success", text }`，资料和列表返回 `{ status: "success", data }`，data 字段由各接口的输出 Schema 校验，不再将 JSON 塞入 text。批量操作可能返回 `status: "partial"` 或 `"rejected"`，请同时检查框架的 `result.ok` 和业务结果。具体参数通过 `client.schema()` 获取。

其他插件在真实消息处理器中调用：

```ts
import { Expose } from 'alemonjs';

const client = Expose.create();
const provider = client.list('roco')[0];
if (provider) {
  const result = await client.call('roco', provider.name, 'get_profile', {});
  if (result.ok) {
    // get_profile 返回 { status: "success", text: string }
    console.log(result.data);
  }
}
```

`get_record` 接受可选的 `page`（1–100）；`find_pet`、`find_skill` 接受必填的 `keyword`（1–100 字符）。无参数接口传 `{}`。账号身份取自框架当前消息，不接受调用参数指定用户。接口复用现有业务查询，不返回账号凭证，不主动发送消息。

可在现有 `alemonjs-roco` 配置节点下添加：

```yaml
expose:
  enabled: true
  allowed_callers:
    - your-caller-plugin
```

省略 `allowed_callers` 时允许框架识别的调用插件，空数组拒绝所有调用；`enabled: false` 禁用接口。调用须具有有效的消息事件和平台、机器人、用户身份。超时或取消不会撤销已发出的后端查询，调用方应检查 `result.ok` 与错误状态。

### 接口范围

| 功能             | Expose 接口                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 帮助、图鉴、技能 | `get_help`、`list_pet_wiki`、`find_pet`、`find_skill`                                                                                              |
| 角色及家园       | `get_accounts`、`get_profile`、`search_player`、`get_home`、`get_pets`、`get_home_pets`、`get_home_pet_detail`、`get_record`、`bind_uid`           |
| 阵容、查蛋、配种 | `get_lineups`、`get_lineup_detail`、`parse_lineup`、`query_egg`、`query_breeding`、`query_size`                                                    |
| 商人、活动、公告 | `get_merchant`、`get_merchant_today`、`get_merchant_catalog`、`get_calendar`、`get_activity_image`、`get_announcements`、`get_announcement_detail` |
| 交换大厅与换蛋帖 | `get_exchange_hall`、`get_egg_exchanges`、`get_my_egg_exchanges`、`post_egg_exchange`、`close_egg_exchange`                                        |
| 换蛋与商人订阅   | `get_egg_subscriptions`、`subscribe_egg_exchange`、`unsubscribe_egg_exchange`、`subscribe_merchant`、`unsubscribe_merchant`                        |
| 家园订阅         | `get_home_status`、`get_home_subscriptions`、`subscribe_home`、`unsubscribe_home`                                                                  |
| WeGame 账号      | `get_wegame_help`、`get_bindings`、`start_login`、`get_login_session`、`wait_login`、`cancel_login`、`switch_binding`、`delete_binding`            |
| 模块管理         | `get_modules`、`get_config`、`update_plugin`、`force_update_plugin`、`download_module`、`update_wegame`                                            |

`start_login({ platform: 'qq' | 'wechat' })` 的 `result.data.data` 包含 `sessionId`、`state`、`qrImage`、`expiresAt`、`message`。同用户同平台重复创建恢复已有会话，并发请求不会重复创建二维码。展示二维码后，以同一消息用户身份调用 `wait_login({ sessionId })`；重复等待共享原轮询。

调用超时后通过 `get_login_session({})` 恢复创建中的会话、二维码或最终结果。state 包括 `none`、`starting`、`ready`、`waiting`、`completed`、`failed`、`cancelled`、`expired`。调用成功只说明读取状态成功，只有 completed 表示登录成功。最终结果保留 5 分钟；进程重启后内存会话不保留，需查询绑定状态或重新创建。

`cancel_login({ sessionId })` 校验所有者并中止二维码请求或轮询，不撤销已经提交的登录凭证。调用方的普通超时保留后台登录以便恢复；令牌始终留在插件内部。

### 2.0.0 调用迁移

- `get_bindings` 返回 `{ status, data: { bindings } }`，账号包含稳定的 id、名称、角色及状态，不包含凭证。
- `switch_binding`、`delete_binding` 改传 `{ bindingId }`，旧 `{ index }` 会被拒绝。删除不存在的 ID 返回 `outcome: "absent"`，不会改删其他账号；删除完成但本地同步失败返回 `status: "partial"`、`synced: false`。
- 原先读取 `JSON.parse(result.data.text)` 的接口改为读取 `result.data.data`。`find_pet` 返回 found 和 pets，`find_skill` 返回 total 和 matches；具体字段以 Schema 为准。
- `subscribe_merchant` 改传 `{ items: ['1', '国王球'], mentionAll: false }`，不再拼接 args。全部无效时返回 `INVALID_INPUT`；部分成功返回 partial 和 unknownIndexes。
- `unsubscribe_egg_exchange` 返回 status、removed、failed，全部失败不会标记为 success。

写接口不会自动重试；调用超时后应先查询实际状态，避免重复发帖、删除或切换错误账号。家园与商人订阅范围取自当前会话。`get_config`、`update_plugin`、`force_update_plugin` 仅允许框架配置的机器人管理员调用，配置输出隐藏密钥、设备指纹和客户端实例 ID；强制更新还要求 `confirm: true`，会覆盖本地修改。

`download_module` 和 `update_wegame` 与现有聊天指令保持一致，只返回功能停用说明，不执行安装或更新。`get_activity_image` 返回现有活动指令使用的静态图片地址。

### 验证

```sh
yarn tsc --noEmit
yarn build
node --test test/expose*.test.mjs
```

也可执行 `yarn test:expose` 自动构建后运行全部 Expose 测试。

`test/expose-coverage.json` 记录路由与接口的对应关系。业务测试使用隔离的本地 HTTP 后端和临时存储，运行真实业务函数，覆盖稳定账号 ID、删除重试、登录恢复及取消、业务拒绝和部分成功、群聊和私聊订阅隔离。路由映射数量不代表业务验收数量；离线测试不代表生产 WeGame、真实扫码或平台推送已联调。
