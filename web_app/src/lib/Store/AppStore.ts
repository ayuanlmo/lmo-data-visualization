import {createSlice} from '@reduxjs/toolkit';

const defaultCurrentTemplateConfigData = {
    data: [],
    config: {
        text: {},
        theme: {
            type: '',
            configs: [],
            value: []
        },
        background: {
            type: '',
            color: '',
            image: '',
            arrangement: ''
        },
        video: {
            duration: 5000,
            fps: 30,
            clarity: '1080P'
        },
        audio: {
            path: '',
            full: false,
            volume: 100
        }
    },
    otherConfig: {
        label: '',
        configs: [],
        values: {}
    }
};

const AppStore = createSlice({
    name: 'app',
    initialState: {
        currentTemplate: {
            cover: "",
            createTime: "",
            description: "",
            id: "",
            name: "",
            path: "",
            type: 0
        },
        currentTemplateConfig: {
            ...defaultCurrentTemplateConfigData
        }
    },
    reducers: {
        // 初始化模板配置文件
        initCurrentTemplateConfigData(state): void {
            state.currentTemplateConfig = {
                ...defaultCurrentTemplateConfigData
            };
        },
        // 设置当前模板
        setCurrentTemplate(state, {payload}): void {
            state.currentTemplate = payload;
        },
        // 设置模板配置文件
        setCurrentTemplateConfig(state, {payload}): void {
            state.currentTemplateConfig = payload;
        },
        // 设置模板背景
        setCurrentTemplateBackground(state, {payload}): void {
            state.currentTemplateConfig.config.background = payload;
        },
        // 设置模板其他配置
        setCurrentTemplateOtherConfigValues(state, {payload}): void {
            state.currentTemplateConfig.otherConfig.values = payload;
        },
        // 设置模板主题配置
        setCurrentTemplateThemeConfig(state, {payload}): void {
            state.currentTemplateConfig.config.theme = payload;
        },
        // 设置模板音频配置
        setCurrentTemplateAudioConfig(state, {payload}): void {
            state.currentTemplateConfig.config.audio = payload;
        },
        // 设置模板视频配置
        setCurrentTemplateVideoConfig(state, {payload}): void {
            state.currentTemplateConfig.config.video = payload;
        }
    }
});

export const {
    setCurrentTemplate,
    setCurrentTemplateConfig,
    setCurrentTemplateBackground,
    setCurrentTemplateOtherConfigValues,
    setCurrentTemplateThemeConfig,
    setCurrentTemplateAudioConfig,
    setCurrentTemplateVideoConfig,
    initCurrentTemplateConfigData
} = AppStore.actions;

export default AppStore.reducer;
