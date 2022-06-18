export default {
    //当前模板配置信息
    currentConfig: {
        csvData: '',
        config: {},
        duration: 5000
    },
    //当前模板音频配置信息
    templateCurrentAudioConfig: {
        name: '',
        volume: 1,
        src: '',
        complete: false,
        playState: false
    },
    //当前模板默认数据
    currentTemplateDefaultData: {
        csvData: ''
    },
    //当前模板视频配置信息(合成时)
    currentTemplateVideoConfig: {},
    //服务器推送的消息
    serverPushMessage: [],
    //当前模板信息
    currentTemplate: null,
    //开发者模式
    devMode: false
};