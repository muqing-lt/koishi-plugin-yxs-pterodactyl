# 🦕 @yuanxueshi/koishi-plugin-yxs-pterodactyl

[![npm version](https://img.shields.io/npm/v/@yuanxueshi/koishi-plugin-yxs-pterodactyl?style=flat-square)](https://www.npmjs.com/package/@yuanxueshi/koishi-plugin-yxs-pterodactyl)
[![npm downloads](https://img.shields.io/npm/dm/@yuanxueshi/koishi-plugin-yxs-pterodactyl?style=flat-square)](https://www.npmjs.com/package/@yuanxueshi/koishi-plugin-yxs-pterodactyl)
[![license](https://img.shields.io/github/license/yuanxueshi/koishi-plugin-yxs-pterodactyl?style=flat-square)](LICENSE)
[![Koishi Version](https://img.shields.io/badge/Koishi-%E2%89%A54.17.0-blue?style=flat-square)](https://koishi.chat/)

一个对接 **翼龙面板（Pterodactyl Panel）** 的 Koishi 插件，允许你在 QQ 群中直接管理服务器（启动、停止、重启、查看状态等），无需登录面板网页。

---

## ✨ 功能特性

| 特性 | 说明 |
|------|------|
| 🚀 核心控制 | 服务器启动/停止/重启/强制终止 |
| 📊 状态监控 | 实时查看 CPU/内存/硬盘/网络使用情况 |
| 🔗 账号绑定 | QQ 与翼龙账号一对一绑定，权限隔离 |
| 🔒 群权限控制 | 指定允许使用插件的 QQ 群聊 |
| ⚙️ 指令自定义 | 支持修改触发词，避免与其他插件冲突 |
| 🛡️ 安全可靠 | API Key 加密存储，操作日志完整记录 |
| 🌍 多服务器支持 | 同时管理多个翼龙面板服务器 |

---

## 📦 安装方法

### 方法 1：Koishi 插件市场（推荐）
1. 打开 Koishi 管理界面 → 插件市场
2. 搜索 `@yuanxueshi/koishi-plugin-yxs-pterodactyl`
3. 点击「安装」→ 启用插件

### 方法 2：npm 安装
```bash
# 进入 Koishi 项目目录
cd your-koishi-project
# 安装插件
npm install @yuanxueshi/koishi-plugin-yxs-pterodactyl --save
# 或 yarn
yarn add @yuanxueshi/koishi-plugin-yxs-pterodactyl
```

### 方法 3：本地开发安装
```bash
# 克隆源码
git clone https://github.com/yuanxueshi/koishi-plugin-yxs-pterodactyl.git
cd koishi-plugin-yxs-pterodactyl

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

安装完成后，需在 Koishi 插件配置页填写以下信息：

| 配置项 | 类型 | 是否必填 | 描述 | 示例值 |
|--------|------|----------|------|--------|
| 面板基础 URL | 字符串 | ✅ 是 | 翼龙面板访问地址（需包含 `http/https`，无需加 `/api` 后缀） | `https://panel.example.com` |
| API Key | 字符串 | ✅ 是 | 翼龙面板应用 API Key（管理员权限，获取路径：面板后台 → 应用 → API 密钥） | `ptlc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| 允许使用的群聊 | 数组（字符串） | ❌ 否 | 仅指定群聊可使用，留空则所有群可用 | `["12345678", "87654321"]` |
| 指令自定义 | 对象 | ❌ 否 | 自定义指令触发词 | 见下方示例 |

### 配置示例
```json
{
  "panelUrl": "https://panel.your-server.com",
  "apiKey": "ptlc_abcdefghijklmnopqrstuvwxyz123456",
  "allowedGroups": ["12345678"],
  "commands": {
    "bind": "ptero.bind",
    "unbind": "ptero.unbind",
    "start": "ptero.start",
    "stop": "ptero.stop",
    "restart": "ptero.restart",
    "kill": "ptero.kill",
    "status": "ptero.status"
  }
}
```

### API Key 权限要求
需给 API Key 开启以下权限（翼龙面板后台 → 应用 → API 密钥 → 权限设置）：
- `servers:read`（读取服务器列表）
- `servers:control`（控制服务器启停）
- `users:read`（验证用户权限）
</details>

---

## 🚀 使用指令

### 1. 账号绑定（必须先绑定）
| 指令 | 格式 | 说明 | 示例 |
|------|------|------|------|
| 绑定账号 | `ptero.bind <翼龙账号ID>` | 翼龙账号 ID 在面板「个人资料」中查看 | `ptero.bind 123456` |

**反馈示例**：
```
✅ 成功绑定翼龙账号 ID: 123456！
```

### 2. 账号解绑
| 指令 | 格式 | 说明 |
|------|------|------|
| 解绑账号 | `ptero.unbind` | 解除当前 QQ 与翼龙账号的绑定 |

**反馈示例**：
```
✅ 成功解绑翼龙账号 ID: 123456！
```

### 3. 服务器管理指令
| 指令 | 功能 | 反馈示例 |
|------|------|----------|
| `ptero.status` | 查看服务器状态 | 📊 服务器状态：MC Server (MC-123)<br>✅ 状态：ONLINE<br>🖥️ CPU：25.3%<br>🧠 内存：1536MB / 4096MB<br>💾 硬盘：2GB / 10GB<br>🌐 网络：↑0.5MB ↓2.3MB |
| `ptero.start` | 启动服务器 | 🚀 正在启动服务器：MC Server (MC-123)... |
| `ptero.stop` | 停止服务器（优雅关闭） | ⏹️ 正在停止服务器：MC Server (MC-123)... |
| `ptero.restart` | 重启服务器 | 🔄 正在重启服务器：MC Server (MC-123)... |
| `ptero.kill` | 强制终止服务器（紧急情况使用） | ⚠️ 正在强制终止服务器：MC Server (MC-123)... |

### 操作流程说明
1. 发送指令后，机器人会列出你有权管理的服务器列表；
2. 回复对应服务器编号（如 `1`），机器人会执行对应操作；
3. 操作结果会实时反馈到 QQ 群中。

---

## 📋 注意事项

1. **面板版本兼容**：支持翼龙面板 v1.6+（推荐使用最新稳定版）；
2. **网络可达性**：Koishi 机器人所在服务器需能访问翼龙面板的 API 地址（确保防火墙未拦截 443 端口）；
3. **数据安全**：绑定关系存储在 Koishi 数据库中，仅插件可访问，不会泄露给第三方；
4. **权限管理**：建议给普通用户分配最小权限，避免误操作；
5. **指令冲突**：若指令与其他插件冲突，可在配置页修改「指令自定义」中的触发词。

---

## ❌ 常见问题（FAQ）

### Q1：绑定账号时提示「未找到你有权限管理的服务器」？
A1：
- 检查翼龙账号 ID 是否填写正确（需与面板个人资料中的 ID 完全一致）；
- 确认该翼龙账号拥有服务器的管理权限（需面板管理员分配）。

### Q2：执行指令时提示「403 Forbidden」？
A2：API Key 权限不足，需在翼龙面板后台给 API Key 开启 `servers:read` 和 `servers:control` 权限。

### Q3：插件无法加载，提示「missing required value」？
A3：必填配置项（面板 URL 或 API Key）未填写或填写错误：
- 面板 URL 必须包含 `https://`（如 `https://panel.example.com`）；
- API Key 需完整复制，长度≥16位。

### Q4：指令无响应或超时？
A4：
- 检查翼龙面板是否正常运行（可通过网页访问验证）；
- 在机器人服务器执行 `curl https://panel.example.com/api/application` 测试网络连通性；
- 检查服务器是否处于异常状态（如磁盘满、内存溢出），需登录面板手动排查。

---

## 👨‍💻 开发与贡献

### 开发环境
- Node.js ≥ 16.x
- Koishi ≥ 4.17.0
- TypeScript ≥ 5.4.5
- yarn ≥ 1.22.x

### 本地开发流程
```bash
# 克隆源码
git clone https://github.com/yuanxueshi/koishi-plugin-yxs-pterodactyl.git
cd koishi-plugin-yxs-pterodactyl

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
3. 提交代码（`git commit -m 'feat: 新增xxx功能'`）
4. 推送分支（`git push origin feature/xxx`）
5. 提交 Pull Request

---

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)，欢迎自由使用、修改和分发。

---

## 📞 联系作者

- 作者：yuanxueshi
- 仓库地址：[https://github.com/yuanxueshi/koishi-plugin-yxs-pterodactyl](https://github.com/yuanxueshi/koishi-plugin-yxs-pterodactyl)
- 反馈问题：请在 [GitHub Issues](https://github.com/yuanxueshi/koishi-plugin-yxs-pterodactyl/issues) 中提交

如果觉得这个插件对你有帮助，欢迎给个 Star ⭐ 支持一下！
