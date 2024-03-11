import {configureStore} from '@reduxjs/toolkit';
import AppStore from "./AppStore";

const store = configureStore({
    reducer: {
        app: AppStore
    }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
