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
        }
    }
});

export const {
    setCurrentTemplate,
    setCurrentTemplateConfig,
    setCurrentTemplateBackground,
    setCurrentTemplateOtherConfigValues,
    setCurrentTemplateThemeConfig
} = AppStore.actions;

export default AppStore.reducer;
