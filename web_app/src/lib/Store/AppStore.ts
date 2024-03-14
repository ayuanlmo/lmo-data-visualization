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
        }
    },
    reducers: {
        setCurrentTemplate(state, {payload}): void {
            state.currentTemplate = payload;
        }
    }
});

export const {
    setCurrentTemplate
} = AppStore.actions;

export default AppStore.reducer;
