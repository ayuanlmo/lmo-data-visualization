export interface IBaseEventEmitter {
    readonly on: (event: string, listener: Function) => void;
    readonly emitEvent: (event: string, ...args: any[]) => void;
    readonly off: (event: string, listener: Function) => void;
}

/**
 * @class BaseEventEmitter
 * @author ayuanlmo
 * **/

export default class BaseEventEmitter implements IBaseEventEmitter {
    private events: Map<string, Function[]>;

    constructor() {
        this.events = new Map();
    }

    public on(event: string, listener: Function): void {
        if (!this.events.has(event))
            this.events.set(event, []);

        this.events.get(event)?.push(listener);
    }

    public emitEvent(event: string, ...args: Array<any>): void {
        const listeners: Array<Function> | undefined = this.events.get(event);

        if (listeners)
            listeners.forEach((listener: Function) => listener(...args));
    }

    public off(event: string, listener: Function): void {
        const listeners: Array<Function> | undefined = this.events.get(event);

        if (listeners)
            this.events.set(event, listeners.filter((fn: Function): boolean => fn !== listener));
    }
}
