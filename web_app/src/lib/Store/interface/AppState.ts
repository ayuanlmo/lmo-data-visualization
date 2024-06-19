interface AppState {
    // 当前模板配置信息
    currentConfig: {
        csvData: Array<string> | Array<number>;
        config: {},
        duration: number;
    },
    // 当前模板音频配置信息
    templateCurrentAudioConfig: {
        name: string;
        volume: number,
        src: string,
        complete: boolean,
        playState: boolean
    },
    // 当前模板默认数据
    currentTemplateDefaultData: {},
    // 当前模板视频配置信息(合成时)
    currentTemplateVideoConfig: {},
    // 当前模板信息
    currentTemplate: null
}

export interface IAppStore {
    currentTemplate: {
        cover: string;
        createTime: string;
        description: string;
        id: string;
        name: string;
        path: string;
        type: number;
    };
    currentTemplateConfig: {
        data: any;
        config: {
            text: {
                [key: string]: {
                    color: string;
                    value: string;
                    display: boolean;
                    fontSize: number;
                    align: string;
                    width: number;
                    height: number;
                    x: number;
                    y: number;
                }
            };
            theme: {
                type: string;
                configs: Array<string>;
                values: Array<string>;
            },
            background: {
                type: string;
                color: string;
                image: string;
                arrangement: string;
            },
            video: {
                duration: number;
                fps: number;
                clarity: string;
            },
            audio: {
                path: string;
                full: boolean;
                volume: number;
            }
        },
        otherConfig: {
            label: string;
            configs: Array<{
                label: string;
                key: string;
                type: string;
                value: any;
            }>;
            values: {
                [key: string]: any;
            }
        }
    }
}

export default AppState;
