import type {FastifyReply, FastifyRequest} from "fastify";
import MemoryCache from "./../../lib/MemoryCache.js";

export default class Catch {
    public static clearCatch(_request: FastifyRequest, reply: FastifyReply): void {
        MemoryCache.clear();
        reply.code(204).send();
    }
}
