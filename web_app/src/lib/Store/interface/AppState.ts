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

export default AppState;
