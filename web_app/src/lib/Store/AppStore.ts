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
                background: {
                    type: '',
                    color: '',
                    image: '',
                    arrangement: ''
                }
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
        }
    }
});

export const {
    setCurrentTemplate,
    setCurrentTemplateConfig,
    setCurrentTemplateBackground
} = AppStore.actions;

export default AppStore.reducer;
