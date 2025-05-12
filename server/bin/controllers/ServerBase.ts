import {Request, Response} from "express";
import Utils from "../../utils";
import MemoryCache from "../../lib/MemoryCache";
import createSuccessMessage = Utils.createSuccessMessage;

export default class ServerBase {
    public static GetServerBaseInfo(req: Request, res: Response): void {
        const memoryUsage = process.memoryUsage();
        const uptime = process.uptime();
        const [days, hours, minutes, seconds] = [
            Math.floor(uptime / (24 * 60 * 60)),
            Math.floor(uptime / (60 * 60) % 24),
            Math.floor(uptime / 60 % 60),
            Math.floor(uptime % 60)
        ];
        const {node, v8} = process.versions;

        res.json(createSuccessMessage({
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
                synthesisServicesConnectStatus: MemoryCache.get('SYNTHESIS_SERVICES_CONNECT_STATUS')
            },
            rtVersion: {
                node,
                v8
            }
        }));
    }
};
