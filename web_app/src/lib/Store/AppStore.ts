import {createSlice} from '@reduxjs/toolkit';

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
            data: [],
            config: {
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
                    duration: 5,
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
                values: {}
            }
        }
    },
    reducers: {
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
    setCurrentTemplateVideoConfig
} = AppStore.actions;

export default AppStore.reducer;
