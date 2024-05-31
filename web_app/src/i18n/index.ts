import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import zhCn from './config/zhCn.json';
import zhTw from './config/zhTw.json';
import koKr from './config/koKr.json';
import jpJp from './config/jpJp.json';
import ekUk from './config/enUk.json';
import MyStorage from "../lib/Storage";

const resources = {
    'zh-CN': {
        translation: zhCn
    },
    'zh-TW': {
        translation: zhTw
    },
    'ko': {
        translation: koKr
    },
    'jp': {
        translation: jpJp
    },
    'en-GB': {
        translation: ekUk
    }
};

i18n.use(initReactI18next)
    .init({
        resources: resources,
        lng: MyStorage.get('lang') ?? 'zh-CN',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
