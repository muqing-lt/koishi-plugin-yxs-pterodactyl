"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.license = exports.author = exports.version = exports.description = exports.name = exports.config = exports.Config = void 0;
exports.apply = apply;
const koishi_1 = require("koishi");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ws_1 = __importDefault(require("ws"));
exports.Config = koishi_1.Schema.object({
    panelUrl: koishi_1.Schema.string()
        .description('翼龙面板的基础 URL (例如: https://i91.mczbc.cn)')
        .required()
        .default('https://i91.mczbc.cn'),
    allowedGroups: koishi_1.Schema.array(koishi_1.Schema.string())
        .description('允许使用指令的 QQ 群号列表。留空则允许所有群。')
        .default([]),
    commands: koishi_1.Schema.object({
        bind: koishi_1.Schema.string().description('绑定账号指令').default('yxs.bind'),
        unbind: koishi_1.Schema.string().description('解绑账号指令').default('yxs.unbind'),
        start: koishi_1.Schema.string().description('启动服务器指令').default('yxs.start'),
        stop: koishi_1.Schema.string().description('停止服务器指令').default('yxs.stop'),
        restart: koishi_1.Schema.string().description('重启服务器指令').default('yxs.restart'),
        kill: koishi_1.Schema.string().description('强制终止服务器指令').default('yxs.kill'),
        status: koishi_1.Schema.string().description('查看服务器状态指令').default('yxs.status'),
    }).description('自定义插件指令的触发词').default({
        bind: 'yxs.bind',
        unbind: 'yxs.unbind',
        start: 'yxs.start',
        stop: 'yxs.stop',
        restart: 'yxs.restart',
        kill: 'yxs.kill',
        status: 'yxs.status',
    })
});
const STORAGE_PATH = path_1.default.resolve(__dirname, '../data.json');
var Storage;
(function (Storage) {
    function init() {
        try {
            const dir = path_1.default.dirname(STORAGE_PATH);
            if (!fs_1.default.existsSync(dir))
                fs_1.default.mkdirSync(dir, { recursive: true });
            if (!fs_1.default.existsSync(STORAGE_PATH))
                fs_1.default.writeFileSync(STORAGE_PATH, JSON.stringify({}, null, 2), 'utf8');
            return true;
        }
        catch (error) {
            console.error('[YxsPteroPlugin] 初始化存储文件失败:', error);
            return false;
        }
    }
    Storage.init = init;
    function get() {
        try {
            if (!fs_1.default.existsSync(STORAGE_PATH))
                init();
            const data = fs_1.default.readFileSync(STORAGE_PATH, 'utf8');
            return JSON.parse(data) || {};
        }
        catch (error) {
            console.error('[YxsPteroPlugin] 读取存储文件失败:', error);
            return {};
        }
    }
    Storage.get = get;
    function set(data) {
        try {
            fs_1.default.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2), 'utf8');
            return true;
        }
        catch (error) {
            console.error('[YxsPteroPlugin] 写入存储文件失败:', error);
            return false;
        }
    }
    Storage.set = set;
    function getToken(qq) {
        return get()[qq];
    }
    Storage.getToken = getToken;
    function saveToken(qq, token) {
        const data = get();
        data[qq] = token;
        return set(data);
    }
    Storage.saveToken = saveToken;
    function removeToken(qq) {
        const data = get();
        delete data[qq];
        return set(data);
    }
    Storage.removeToken = removeToken;
    function hasBinding(qq) {
        return !!get()[qq];
    }
    Storage.hasBinding = hasBinding;
})(Storage || (Storage = {}));
const StatusMap = {
    'offline': '🔴 离线',
    'online': '🟢 在线',
    'starting': '🟡 启动中',
    'stopping': '🟡 停止中',
    'restarting': '🟡 重启中',
    'installing': '🟡 安装中',
    'updating': '🟡 更新中',
    'suspended': '🔴 已暂停',
    'running': '🟢 运行中',
    'idle': '🟢 空闲中',
    'null': '⚫ 待初始化',
    'undefined': '❓ 未知状态',
};
const bytesToMB = (bytes) => {
    if (!bytes || bytes < 0)
        return '0.00';
    return (bytes / 1024 / 1024).toFixed(2);
};
function apply(ctx, config) {
    if (Storage.init()) {
        ctx.logger.info(`[YxsPteroPlugin] 本地存储文件初始化成功：${STORAGE_PATH}`);
    }
    else {
        ctx.logger.error('[YxsPteroPlugin] 本地存储文件初始化失败！');
    }
    const getWebSocketRealStatus = async (clientToken, serverUuid) => {
        return new Promise(async (resolve) => {
            let ws = null;
            const timeoutTimer = setTimeout(() => {
                ctx.logger.warn(`[YxsPteroPlugin] WebSocket 状态获取超时`);
                ws?.close();
                resolve(null);
            }, 5000);
            try {
                const wsCredential = await axios_1.default.get(`${config.panelUrl}/api/client/servers/${serverUuid}/websocket`, {
                    headers: {
                        'Authorization': `Bearer ${clientToken}`,
                        'Accept': 'application/vnd.pterodactyl.v1+json',
                        'Content-Type': 'application/json',
                    },
                    timeout: 5000,
                });
                const { token, socket } = wsCredential.data.data;
                ws = new ws_1.default(socket, {
                    headers: { 'Origin': config.panelUrl },
                });
                ws.on('open', () => {
                    ws?.send(JSON.stringify({ event: 'auth', args: [token] }));
                });
                ws.on('message', (data) => {
                    const message = JSON.parse(data.toString());
                    if (message.event === 'status') {
                        const realStatus = message.args[0];
                        ctx.logger.info(`[YxsPteroPlugin] WebSocket 实时状态（${serverUuid}）：${realStatus}`);
                        clearTimeout(timeoutTimer);
                        ws?.close();
                        resolve(realStatus);
                    }
                });
                ws.on('error', (error) => {
                    ctx.logger.error(`[YxsPteroPlugin] WebSocket 连接失败：${error.message}`);
                    clearTimeout(timeoutTimer);
                    ws?.close();
                    resolve(null);
                });
            }
            catch (error) {
                ctx.logger.error(`[YxsPteroPlugin] 获取 WebSocket 凭证失败：${error.message}`);
                clearTimeout(timeoutTimer);
                ws?.close();
                resolve(null);
            }
        });
    };
    const checkGroupPermission = (groupId) => {
        if (!groupId)
            return true;
        if (config.allowedGroups.length === 0)
            return true;
        return config.allowedGroups.includes(groupId);
    };
    const request = async (clientToken, method, path, data) => {
        const fullPath = `/api/client${path.startsWith('/') ? path : `/${path}`}`.replace(/\/+/g, '/');
        const url = new URL(fullPath, config.panelUrl);
        try {
            const response = await (0, axios_1.default)({
                method,
                url: url.href,
                headers: {
                    'Authorization': `Bearer ${clientToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.pterodactyl.v1+json',
                },
                data,
                timeout: 10000,
            });
            return response.data;
        }
        catch (error) {
            const axiosError = error;
            const errorMsg = axiosError.response?.data ? JSON.stringify(axiosError.response.data) : axiosError.message;
            ctx.logger.error(`[YxsPteroPlugin] API 请求失败: ${method} ${url.href} | 错误信息: ${errorMsg}`);
            if (axiosError.response) {
                const status = axiosError.response.status;
                const responseData = axiosError.response.data;
                if (status === 401)
                    throw new Error('❌ 认证失败：Token 无效/过期或前缀错误（需 ptlc_）。');
                if (status === 403)
                    throw new Error(`❌ 权限不足：请勾选 servers:read、websocket.connect 权限。`);
                if (status === 404)
                    throw new Error(`❌ 路由不存在：确认面板 URL 和服务器 UUID 正确。`);
                if (status === 400 && responseData.errors?.[0]?.code === 'ConflictingServerStateException') {
                    throw new Error('❌ 服务器状态冲突：可能未启动或正在执行其他操作。');
                }
                if (status >= 500)
                    throw new Error('❌ 面板内部错误：联系管理员或稍后再试。');
            }
            else if (axiosError.request) {
                throw new Error('❌ 网络错误：无法连接面板，请检查 URL 或网络。');
            }
            throw new Error(`❌ API 请求失败：${axiosError.message}`);
        }
    };
    const getUserServers = async (clientToken) => {
        const data = await request(clientToken, 'GET', '');
        return data.data || [];
    };
    const getServerDetails = async (clientToken, serverUuid) => {
        const data = await request(clientToken, 'GET', `/servers/${serverUuid}`);
        return data.attributes;
    };
    const getServerResources = async (clientToken, serverUuid) => {
        const data = await request(clientToken, 'GET', `/servers/${serverUuid}/resources`);
        return data.attributes.resources;
    };
    const sendPowerSignal = async (clientToken, serverUuid, signal) => {
        await request(clientToken, 'POST', `/servers/${serverUuid}/power`, { signal });
    };
    const getRealServerStatus = async (clientToken, serverUuid, rawStatus, resources) => {
        const wsStatus = await getWebSocketRealStatus(clientToken, serverUuid);
        if (wsStatus) {
            return StatusMap[wsStatus] || '❓ 未知状态';
        }
        ctx.logger.warn(`[YxsPteroPlugin] WebSocket 状态获取失败，使用资源推断（${serverUuid}）`);
        const mappedStatus = StatusMap[rawStatus] || '❓ 未知状态';
        if ((mappedStatus === '⚫ 待初始化' || mappedStatus === '❓ 未知状态') &&
            resources &&
            (resources.memory_bytes > 1024 * 1024 || resources.cpu_absolute > 0)) {
            return '🟢 在线（资源推断）';
        }
        return mappedStatus;
    };
    const handleServerAction = async (argv, action) => {
        const { session } = argv;
        const groupId = session.groupId;
        const qq = session.userId;
        if (!checkGroupPermission(groupId))
            return '❌ 当前群聊不允许使用此指令';
        const clientToken = Storage.getToken(qq);
        if (!clientToken) {
            return `❌ 你尚未绑定账号，请先使用 \`${config.commands.bind} <Client API Token>\` 绑定（Token 前缀 ptlc_）`;
        }
        try {
            const servers = await getUserServers(clientToken);
            if (servers.length === 0)
                return `❌ 你的 Token 未绑定任何服务器。`;
            let serverList = `请选择要${action === 'view' ? '查看' : action}的服务器：\n`;
            servers.forEach((server, index) => {
                serverList += `${index + 1}. ${server.attributes.name}（UUID：${server.attributes.uuid}）\n`;
            });
            await session.send(serverList);
            const reply = await session.prompt(30000);
            if (!reply)
                return '⏰ 操作超时，请重新发送指令并及时选择服务器';
            const selectedIndex = parseInt(reply) - 1;
            if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= servers.length) {
                return '❌ 无效编号，请输入列表中的数字';
            }
            const selectedServer = servers[selectedIndex];
            const serverUuid = selectedServer.attributes.uuid;
            const serverName = selectedServer.attributes.name;
            const listStatus = selectedServer.attributes.status || 'null';
            switch (action) {
                case 'view': {
                    let serverDetails, resources;
                    let rawStatus = listStatus;
                    let totalMemoryMB = selectedServer.attributes.limits.memory || 0;
                    let totalDiskMB = selectedServer.attributes.limits.disk || 0;
                    try {
                        serverDetails = await getServerDetails(clientToken, serverUuid);
                        rawStatus = serverDetails.status || listStatus;
                        totalMemoryMB = serverDetails.limits.memory || totalMemoryMB;
                        totalDiskMB = serverDetails.limits.disk || totalDiskMB;
                    }
                    catch (detailError) {
                        ctx.logger.warn(`[YxsPteroPlugin] 获取服务器详情失败，降级使用列表信息：${detailError.message}`);
                    }
                    try {
                        resources = await getServerResources(clientToken, serverUuid);
                    }
                    catch (resourceError) {
                        if (resourceError.message.includes('服务器状态冲突')) {
                            const statusDisplay = await getRealServerStatus(clientToken, serverUuid, rawStatus, null);
                            return `📊 **服务器状态详情 - ${serverName}**\n` +
                                `├─ UUID：${serverUuid}\n` +
                                `├─ 状态：${statusDisplay}\n` +
                                `├─ CPU：--\n` +
                                `├─ 内存使用：-- / ${totalMemoryMB} MB\n` +
                                `├─ 磁盘使用：-- / ${totalDiskMB} MB\n` +
                                `├─ 节点：${selectedServer.attributes.node || '未知节点'}\n` +
                                `└─ ⚠️  提示：服务器未启动，无法获取实时资源使用数据`;
                        }
                        throw resourceError;
                    }
                    const statusDisplay = await getRealServerStatus(clientToken, serverUuid, rawStatus, resources);
                    const usedMemoryMB = bytesToMB(resources.memory_bytes);
                    const usedDiskMB = bytesToMB(resources.disk_bytes);
                    const uptimeMin = Math.floor((resources.uptime || 0) / 1000 / 60);
                    const uptimeDisplay = uptimeMin > 0 ? `${uptimeMin} 分钟` : '--';
                    return `📊 **服务器状态详情 - ${serverName}**\n` +
                        `├─ UUID：${serverUuid}\n` +
                        `├─ 状态：${statusDisplay}\n` +
                        `├─ CPU：${resources.cpu_absolute || 0}%\n` +
                        `├─ 内存使用：${usedMemoryMB} MB / ${totalMemoryMB} MB\n` +
                        `├─ 磁盘使用：${usedDiskMB} MB / ${totalDiskMB} MB\n` +
                        `├─ 网络接收：${bytesToMB(resources.network_rx_bytes)} MB\n` +
                        `├─ 网络发送：${bytesToMB(resources.network_tx_bytes)} MB\n` +
                        `├─ 运行时间：${uptimeDisplay}\n` +
                        `├─ 节点：${serverDetails?.node || selectedServer.attributes.node || '未知节点'}\n` +
                        `💡 状态来源：${statusDisplay.includes('（资源推断）') ? '资源使用量' : 'WebSocket 实时推送'}`;
                }
                case 'start':
                case 'stop':
                case 'restart':
                case 'kill': {
                    await sendPowerSignal(clientToken, serverUuid, action);
                    return `🚀 正在${action === 'start' ? '启动' : action === 'stop' ? '停止' : action === 'restart' ? '重启' : '强制终止'}服务器：${serverName}\n请用 \`${config.commands.status}\` 查看最新状态`;
                }
                default: return '❌ 未知操作';
            }
        }
        catch (error) {
            return error.message;
        }
    };
    ctx.command(config.commands.bind, '绑定翼龙 Client API Token')
        .usage(`格式：\`${config.commands.bind} <Client API Token>\`\n\n💡 按文档要求操作：\n1. 生成 Token：面板 "Account -> API" 点击 "Create API Key"。\n2. 勾选权限：必须勾选 servers:read（资源）、servers:power-control（启停）、websocket.connect（实时状态）。\n3. Token 前缀：必须以 ptlc_ 开头（管理员 Token 不可用）。`)
        .example(`${config.commands.bind} ptlc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
        .action(async (argv, clientToken) => {
        const { session } = argv;
        const qq = session.userId;
        if (!clientToken)
            return `❌ 请提供 Client API Token\n格式：\`${config.commands.bind} <Token>\``;
        if (!clientToken.startsWith('ptlc_'))
            return '❌ 无效 Token：需以 ptlc_ 为前缀（请生成 Client API Token）。';
        try {
            await getUserServers(clientToken);
            const saveSuccess = Storage.saveToken(qq, clientToken);
            if (!saveSuccess)
                throw new Error('存储绑定信息失败，请检查文件权限。');
            return `✅ 成功绑定翼龙账号！\n绑定 QQ：${qq}\n可使用 \`${config.commands.status}\` 查看服务器实时状态和资源使用。`;
        }
        catch (error) {
            return `❌ 绑定失败：${error.message}`;
        }
    });
    ctx.command(config.commands.unbind, '解绑翼龙账号')
        .action(async (argv) => {
        const { session } = argv;
        const qq = session.userId;
        if (!Storage.hasBinding(qq))
            return '❌ 你尚未绑定账号';
        const removeSuccess = Storage.removeToken(qq);
        if (!removeSuccess)
            return '❌ 解绑失败，请检查文件权限。';
        return `✅ 成功解绑翼龙账号！`;
    });
    ctx.command(config.commands.status, '查看服务器实时状态和资源使用').action(argv => handleServerAction(argv, 'view'));
    ctx.command(config.commands.start, '启动服务器').action(argv => handleServerAction(argv, 'start'));
    ctx.command(config.commands.stop, '停止服务器（优雅关闭）').action(argv => handleServerAction(argv, 'stop'));
    ctx.command(config.commands.restart, '重启服务器').action(argv => handleServerAction(argv, 'restart'));
    ctx.command(config.commands.kill, '强制终止服务器（紧急情况）')
        .usage('⚠️  警告：强制关闭可能导致数据丢失！')
        .action(argv => handleServerAction(argv, 'kill'));
    ctx.logger.info('[YxsPteroPlugin] 翼龙面板 Client API 插件加载完成！');
    ctx.logger.info(`[YxsPteroPlugin] 面板 URL：${config.panelUrl}`);
    ctx.logger.info(`[YxsPteroPlugin] 指令前缀已改为 "yxs"，支持指令：${Object.values(config.commands).join('、')}`);
    ctx.logger.info(`[YxsPteroPlugin] 已启用 WebSocket 实时状态检测（基于 Console Access 模块）`);
}
exports.config = exports.Config;
exports.name = 'yxs-pterodactyl';
exports.description = '对接翼龙面板 Client API，支持服务器实时状态（WebSocket）、资源监控、启停/重启/强制终止（指令前缀 yxs）';
exports.version = '7.0.0';
exports.author = 'yuanxueshi';
exports.license = 'MIT';
