# 🦕 @yuanxueshi/koishi-plugin-yxs-pterodactyl

[![npm version](https://img.shields.io/npm/v/@yuanxueshi/koishi-plugin-yxs-pterodactyl?style=flat-square)](https://www.npmjs.com/package/@yuanxueshi/koishi-plugin-yxs-pterodactyl)
[![npm downloads](https://img.shields.io/npm/dm/@yuanxueshi/koishi-plugin-yxs-pterodactyl?style=flat-square)](https://www.npmjs.com/package/@yuanxueshi/koishi-plugin-yxs-pterodactyl)
[![license](https://img.shields.io/github/license/muqing-lt/koishi-plugin-yxs-pterodactyl?style=flat-square)](LICENSE)
[![Koishi Version](https://img.shields.io/badge/Koishi-%E2%89%A54.17.0-blue?style=flat-square)](https://koishi.chat/)
[![stable version](https://img.shields.io/badge/stable-1.4.9-green?style=flat-square)](https://www.npmjs.com/package/@yuanxueshi/koishi-plugin-yxs-pterodactyl/v/1.4.9)

一个对接 **翼龙面板（Pterodactyl Panel）** 的 Koishi 插件，允许你在 QQ 群中直接管理服务器（启动、停止、重启、查看状态等），无需登录面板网页，**1.4.9 版本为稳定版，已适配多数生产环境**。

---

## ✨ 核心功能特性

| 特性 | 详细说明 |
|------|----------|
| 🚀 服务器控制 | 支持启动/停止/重启/强制终止，覆盖核心运维场景 |
| 📊 实时状态监控 | 🔹 状态类型：在线/离线/启动中/停止中/重启中等（图标化展示）<br>🔹 资源监控：CPU 使用率、内存/硬盘使用量（已用/总计）、网络收发量<br>🔹 运行数据：服务器运行时间、所在节点<br>🔹 实时同步：基于 WebSocket 推送，状态延迟低，告别“待初始化”误导 |
| 🔗 账号绑定 | QQ 与翼龙账号一对一绑定，权限隔离，数据本地安全存储 |
| 🔒 群权限管控 | 可指定允许使用插件的 QQ 群聊，避免滥用 |
| ⚙️ 指令自定义 | 支持修改指令触发词，避免与其他插件冲突 |
| 🛡️ 安全可靠 | Client Token 本地加密存储，操作日志完整记录，排查问题更高效 |
| 🌍 多服支持 | 同时管理多个翼龙面板服务器，切换无压力 |
| 🔌 WebSocket 实时状态 | 基于翼龙 Console Access 模块，状态推送延迟低，精准度高 |

---

## 📦 安装方法

### 方法 1：Koishi 插件市场（推荐）
1. 打开 Koishi 管理界面 → 插件市场
2. 搜索 `@yuanxueshi/koishi-plugin-yxs-pterodactyl`
3. 选择 **1.4.9 版本** → 点击「安装」→ 启用插件

### 方法 2：npm 安装（指定稳定版）
```bash
# 进入 Koishi 项目目录
cd your-koishi-project
# 安装 1.4.9 稳定版
npm install @yuanxueshi/koishi-plugin-yxs-pterodactyl@1.4.9 --save
# 或 yarn
yarn add @yuanxueshi/koishi-plugin-yxs-pterodactyl@1.4.9
```

### 方法 3：本地开发安装
```bash
# 克隆源码
git clone https://github.com/muqing-lt/koishi-plugin-yxs-pterodactyl.git
cd koishi-plugin-yxs-pterodactyl
# 切换到 1.4.9 稳定版分支
git checkout v1.4.9
# 安装依赖并编译
yarn install
yarn build
# 链接到 Koishi 项目（开发模式）
yarn link
cd your-koishi-project
yarn link @yuanxueshi/koishi-plugin-yxs-pterodactyl
```

---

## ⚙️ 配置说明

<details>
<summary>展开查看详细配置</summary>

安装完成后，需在 Koishi 插件配置页填写以下信息（仅需配置面板基础 URL，无需管理员 API Key）：

| 配置项 | 类型 | 是否必填 | 描述 | 示例值 |
|--------|------|----------|------|--------|
| 面板基础 URL | 字符串 | ✅ 是 | 翼龙面板访问地址（需包含 `http/https`，无需加 `/api` 或子路径后缀） | `https://i91.mczbc.cn` |
| 允许使用的群聊 | 数组（字符串） | ❌ 否 | 仅指定群聊可使用插件，留空则所有群聊均可使用 | `["12345678", "87654321"]` |
| 指令自定义 | 对象 | ❌ 否 | 自定义指令触发词（默认前缀 `yxs`，避免冲突） | 见下方示例 |

### 配置示例
```json
{
  "panelUrl": "https://panel.your-server.com",
  "allowedGroups": ["12345678"],
  "commands": {
    "bind": "yxs.bind",
    "unbind": "yxs.unbind",
    "start": "yxs.start",
    "stop": "yxs.stop",
    "restart": "yxs.restart",
    "kill": "yxs.kill",
    "status": "yxs.status"
  }
}
```

### 关键说明
- 无需填写「API Key」：插件采用用户个人 Client Token 绑定模式，无需面板管理员权限，更安全。
- 配置校验：面板 URL 需确保能正常访问，否则会导致 API 请求失败。
</details>

---

## 🚀 使用指南（核心指令）

### 前置步骤：获取 Client Token（必做）
1. 登录翼龙面板 → 进入「Account（账号）」→ 「API」页面
2. 点击「Create API Key」→ 输入名称（如 `QQ机器人`）
3. 勾选以下权限（必须勾选，否则功能异常）：
   - `servers:read`（读取服务器列表和状态）
   - `servers:power-control`（控制服务器启停）
   - `websocket.connect`（实时获取状态）
4. 点击「Create」→ 复制生成的 `ptlc_` 前缀 Token（仅显示一次，务必保存）

### 1. 账号绑定（必须先绑定）
| 指令 | 格式 | 说明 | 示例 |
|------|------|------|------|
| 绑定账号 | `yxs.bind <Client Token>` | 绑定 QQ 与翼龙账号，Token 前缀必须为 `ptlc_` | `yxs.bind ptlc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

**成功反馈**：
```
✅ 成功绑定翼龙账号！
绑定 QQ：123456789
可使用 `yxs.status` 查看服务器状态和资源使用。
```

### 2. 账号解绑
| 指令 | 格式 | 说明 |
|------|------|------|
| 解绑账号 | `yxs.unbind` | 解除当前 QQ 与翼龙账号的绑定，删除本地存储的 Token |

**成功反馈**：
```
✅ 成功解绑翼龙账号！
后续需重新绑定才能使用插件功能。
```

### 3. 服务器管理核心指令
| 指令 | 功能 | 操作流程 | 成功反馈示例 |
|------|------|----------|--------------|
| `yxs.status` | 查看服务器状态+资源使用（核心功能） | 1. 发送指令 → 2. 选择服务器编号 | 📊 **服务器状态详情 - MC服务器**<br>├─ UUID：f82db052-3699-4383-9637-ce5d08526c6a<br>├─ 状态：🟢 在线<br>├─ CPU：23.5%<br>├─ 内存使用：1280.00 MB / 2048 MB<br>├─ 磁盘使用：3200.00 MB / 10240 MB<br>├─ 网络接收：1.25 MB<br>├─ 网络发送：0.83 MB<br>├─ 运行时间：45 分钟<br>├─ 节点：Node-1<br>💡 状态来源：WebSocket 实时推送 |
| `yxs.start` | 启动服务器 | 1. 发送指令 → 2. 选择服务器编号 | 🚀 正在启动服务器：MC服务器<br>请用 `yxs.status` 查看最新状态 |
| `yxs.stop` | 优雅停止服务器 | 1. 发送指令 → 2. 选择服务器编号 | ⏹️ 正在停止服务器：MC服务器<br>请用 `yxs.status` 查看最新状态 |
| `yxs.restart` | 重启服务器 | 1. 发送指令 → 2. 选择服务器编号 | 🔄 正在重启服务器：MC服务器<br>请用 `yxs.status` 查看最新状态 |
| `yxs.kill` | 强制终止服务器 | 1. 发送指令 → 2. 选择服务器编号 | ⚠️ 正在强制终止服务器：MC服务器<br>请用 `yxs.status` 查看最新状态 |

### 📊 状态显示详细说明（核心补充）
#### 1. 状态类型及含义
| 状态图标 | 状态文本 | 含义 | 常见场景 |
|----------|----------|------|----------|
| 🟢 在线 | 在线/运行中 | 服务器正常运行，可提供服务 | 启动后稳定运行时 |
| 🔴 离线 | 离线 | 服务器已关闭，未运行 | 手动停止或异常关闭后 |
| 🟡 启动中 | 启动中 | 服务器正在启动，尚未就绪 | 执行 `yxs.start` 后 |
| 🟡 停止中 | 停止中 | 服务器正在优雅关闭 | 执行 `yxs.stop` 后 |
| 🟡 重启中 | 重启中 | 服务器正在重启（先停后启） | 执行 `yxs.restart` 后 |
| 🟡 安装中 | 安装中 | 服务器正在安装插件/环境 | 面板触发安装流程时 |
| 🟡 更新中 | 更新中 | 服务器正在更新核心文件 | 面板触发更新流程时 |
| 🔴 已暂停 | 已暂停 | 服务器被面板管理员暂停 | 资源超限或手动暂停后 |
| ⚫ 待初始化 | 待初始化 | 服务器未启动且无资源使用 | 新创建未启动的服务器 |

#### 2. 资源显示字段解释
| 字段 | 说明 | 格式示例 |
|------|------|----------|
| CPU | 实时 CPU 使用率（百分比） | 23.5% |
| 内存使用 | 已用内存 / 总内存（单位：MB） | 1280.00 MB / 2048 MB |
| 磁盘使用 | 已用磁盘空间 / 总磁盘空间（单位：MB） | 3200.00 MB / 10240 MB |
| 网络接收 | 服务器接收的网络数据量（单位：MB） | 1.25 MB |
| 网络发送 | 服务器发送的网络数据量（单位：MB） | 0.83 MB |
| 运行时间 | 服务器持续运行时长（单位：分钟） | 45 分钟（离线时显示 `--`） |
| 节点 | 服务器所在的翼龙面板节点 | Node-1 |

#### 3. 状态来源说明
- 📡 **WebSocket 实时推送**：优先采用（1.4.9 版本核心优化），基于翼龙面板 Console Access 模块，状态延迟＜1秒，精准度最高。
- 📊 **资源推断**：WebSocket 连接失败时兜底，通过内存/CPU 使用量判断（如内存＞1MB 则推断为“在线”），避免显示“待初始化”误导。

### 操作流程说明
1. 发送任意管理指令后，机器人会列出你有权管理的服务器列表（仅显示名称和 UUID，简洁清晰）；
2. 回复对应服务器编号（如 `1`），机器人将执行操作；
3. 状态查询结果实时刷新，资源数据为当前最新值。

---

## 📋 注意事项

1. **面板版本兼容**：支持翼龙面板 v1.6+（推荐 v1.11.11.0 稳定版）；
2. **网络可达性**：Koishi 机器人所在服务器需能访问翼龙面板的 API 地址（防火墙放行 443 端口）；
3. **Token 安全**：Client Token 仅存储在 Koishi 本地，插件不会上传或分享给第三方，泄露后需及时在面板撤销；
4. **权限最小化**：给 Token 仅勾选必需权限，避免多余权限泄露带来风险；
5. **指令冲突**：若与其他插件指令冲突，可在配置页修改「指令自定义」中的触发词；
6. **稳定版保障**：1.4.9 版本已修复状态显示异常、资源读取失败等核心问题，适合生产环境使用。

---

## ❌ 常见问题（FAQ）

### Q1：绑定 Token 时提示「认证失败：Token 无效/过期」？
A1：
- 检查 Token 前缀是否为 `ptlc_`（管理员 API Key 前缀为 `pterodactyl_`，不可用）；
- 确认 Token 未过期（面板 API 页面可查看有效期）；
- 重新生成 Token 并勾选 `servers:read`/`servers:power-control`/`websocket.connect` 权限。

### Q2：执行 `yxs.status` 显示「服务器状态冲突：可能未启动」？
A2：服务器当前处于离线状态，无法获取实时资源数据，启动服务器后即可正常查看。

### Q3：状态一直显示「待初始化」但资源能读取？
A3：1.4.9 版本已通过 WebSocket 实时状态推送修复此问题，若仍出现：
- 检查 Token 是否勾选 `websocket.connect` 权限；
- 确认面板 URL 配置正确（无多余子路径）；
- 重启插件后重新绑定 Token。

### Q4：执行指令提示「当前群聊不允许使用此指令」？
A4：管理员在插件配置页的「允许使用的群聊」中添加当前群号即可。

### Q5：API 请求失败/超时？
A5：
- 检查面板 URL 是否能正常访问（浏览器打开验证）；
- 测试机器人服务器网络：`curl https://你的面板地址/api/client`（返回 JSON 即正常）；
- 确认面板未被防火墙拦截，或联系面板管理员检查 API 服务状态。

---

## 👨‍💻 开发与贡献

### 开发环境要求
- Node.js ≥ 16.x
- Koishi ≥ 4.17.0
- TypeScript ≥ 5.4.5
- yarn ≥ 1.22.x

### 本地开发流程
```bash
# 克隆源码
git clone https://github.com/muqing-lt/koishi-plugin-yxs-pterodactyl.git
cd koishi-plugin-yxs-pterodactyl
# 切换到 1.4.9 稳定版
git checkout v1.4.9
# 安装依赖
yarn install
# 实时编译（开发模式）
yarn dev
# 构建生产版本
yarn build
# 运行测试
yarn test
```

### 贡献指南
1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/xxx`）
3. 提交代码（遵循 Conventional Commits 规范，如 `feat: 新增xxx功能`）
4. 推送分支（`git push origin feature/xxx`）
5. 提交 Pull Request 到 `main` 分支

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)，允许自由使用、修改和分发，无需额外授权。

---

## 📞 反馈与支持

- 稳定版本：1.4.9（已修复已知所有核心问题）
- 仓库地址：[https://github.com/muqing-lt/koishi-plugin-yxs-pterodactyl](https://github.com/muqing-lt/koishi-plugin-yxs-pterodactyl)
- 问题反馈：请在 [GitHub Issues](https://github.com/muqing-lt/koishi-plugin-yxs-pterodactyl/issues) 提交（附错误日志和操作步骤）
- 作者：yuanxueshi

如果觉得这个插件对你有帮助，欢迎给个 Star ⭐ 支持一下！