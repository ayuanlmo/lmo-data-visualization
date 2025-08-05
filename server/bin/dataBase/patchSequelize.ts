import {Sequelize} from 'sequelize';
import Logger from "../../lib/Log";

declare module 'sequelize' {
    interface Sequelize {
        [key: string]: any;
    }
}

export function patchSequelize(sequelize: Sequelize): void {
    const originalQuery = sequelize.query;

    (sequelize.query as any) = async function (...args: any[]) {
        try {
            // @ts-ignore
            return await originalQuery.apply(sequelize, args);
        } catch (error: any) {
            console.warn('[Sequelize Global Error]', {
                message: error.message,
                sql: error.sql,
                params: args[1]?.replacements,
                stack: error.stack?.split('\n').slice(0, 10).join('\n'),
                timestamp: new Date().toISOString(),
            });

            const logLine: string = `[${new Date().toISOString()}] ${error.message}\nSQL: ${error.sql}\nParams: ${JSON.stringify(
                args[1]?.replacements
            )}\nStack: ${error.stack}\n\n`;

            Logger.error(logLine);

            throw error;
        }
    };
}
