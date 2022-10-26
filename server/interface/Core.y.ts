export interface WsAppType {
    clients: Array<any>;
}

export interface WsClientsType {
    send: any;
}

export interface CopyFileItemType {
    name: string;
}

export interface FluentFfmpegErrorTypes {
    message: string;
}

interface CreateTemplateDataType {
    customize: {
        title: string;
        description: string;
    }
}

export interface CreateTaskDataType extends CreateTemplateDataType {
    name: string;
    templateConfig: {
        background: {
            image: string;
        };
        isCustom: number;
        currentConfig: {};
    };
    config: {
        video: {
            duration: number;
            fps: string;
            clarity: string;
        };
        audio: {
            src: string;
            volume: string;
            complete: boolean;
        };
    },
    template: string
}
