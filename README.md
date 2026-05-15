# 阿柠檬-洛克王国世界

可通过以下2种方式部署运行环境

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
    # Yunzai 机器人请填写 bot
    # 示例：bot
    client_type: bot
    # 当前客户端实例 ID，可用于区分多机器人实例
    # 示例：yunzai-bot-01
    client_id: ''
    # 设备指纹，留空时会按机器信息自动生成
    # 示例：yunzai_rocom_xxxxxxxxx_abcdef1234567890
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
