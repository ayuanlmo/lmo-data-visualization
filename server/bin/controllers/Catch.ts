import {Request, Response} from "express";
import MemoryCache from "../../lib/MemoryCache";

export default class Catch {
    public static clearCatch(_req: Request, res: Response): void {
        MemoryCache.clear();
        res.status(204).send();
    }
}
