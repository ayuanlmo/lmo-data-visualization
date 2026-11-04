import type {FastifyReply, FastifyRequest} from "fastify";
import Utils from "./../../utils/index.js";
import createSuccessMessage = Utils.createSuccessMessage;

export default class ServerBase {
    public static GetServerBaseInfo(_request: FastifyRequest, reply: FastifyReply): void {
        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();
        const [days, hours, minutes, seconds] = [
            Math.floor(uptime / (24 * 60 * 60)),
            Math.floor(uptime / (60 * 60) % 24),
            Math.floor(uptime / 60 % 60),
            Math.floor(uptime % 60)
        ];
        const {node, v8} = process.versions;

        reply.send(createSuccessMessage({
            main: {
                memory: {
                    rss: Number((memoryUsage.rss / 1024 / 1024).toFixed(2)),
                    heapTotal: Number((memoryUsage.heapTotal / 1024 / 1024).toFixed(2)),
                    heapUsed: Number((memoryUsage.heapUsed / 1024 / 1024).toFixed(2)),
                    external: Number((memoryUsage.external / 1024 / 1024).toFixed(2)),
                    arrayBuffers: Number((memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2))
                },
                upTime: {
                    days, hours, minutes, seconds
                },
                // 合成服务恒在线（同进程）；字段保留以维持前端 ServerInfo.tsx 契约
                synthesisServicesConnectStatus: true
            },
            rtVersion: {
                node,
                v8
            }
        }));
    }
};
