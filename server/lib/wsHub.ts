import type {IWsApp} from "../bin/WebSocketServer.js";

/**
 * 显式 WebSocket 连接中心：浏览器侧 `/connect` 与预览 `/template` 的连接都注册到此处，
 * `sendMessage` 采用定向广播（不经全局对象）。
 */
class WsHubImpl {
    private readonly clients: Set<IWsApp> = new Set();
    private readonly templateClients: Set<IWsApp> = new Set();

    public addClient(ws: IWsApp): () => void {
        this.clients.add(ws);
        return (): void => {
            this.clients.delete(ws);
        };
    }

    public addTemplate(ws: IWsApp): () => void {
        this.templateClients.add(ws);
        return (): void => {
            this.templateClients.delete(ws);
        };
    }

    public get clientCount(): number {
        return this.clients.size;
    }

    public broadcastToClients(message: string): void {
        this.clients.forEach((ws: IWsApp): void => {
            try {
                ws.send?.(message);
            } catch (e) {
                // 单个连接发送失败不应影响其余广播
            }
        });
    }

    public broadcastToTemplates(message: string): void {
        this.templateClients.forEach((ws: IWsApp): void => {
            try {
                ws.send?.(message);
            } catch (e) {
                // 同上
            }
        });
    }
}

export const WsHub: WsHubImpl = new WsHubImpl();
export default WsHub;
