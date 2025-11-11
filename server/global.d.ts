declare interface GlobalThis extends global {
    WebSocketPool: any;
}

declare const global: GlobalThis;

import 'express';
import type {TFunction} from 'i18next';

declare global {
    namespace Express {
        interface Request {
            t: TFunction<'translation', undefined, string[]>;
            language?: string;
            languages?: string[];
        }
    }
}
