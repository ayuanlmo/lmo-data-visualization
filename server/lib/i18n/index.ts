import i18next from 'i18next';
import cn from './resources/cn.js';
import tw from './resources/tw.js';
import en from './resources/en.js';
import jp from './resources/en.js';
import ru from './resources/ru.js';
import ko from './resources/ko.js';

export const supportedLngs: Array<string> = ['zh-CN', 'zh-TW', 'en', 'ko', 'ru-RU', 'jp'];

export const i18nResources = {
    'zh-CN': {
        translation: {
            ...cn
        }
    },
    'zh-TW': {
        translation: {
            ...tw
        }
    },
    'en': {
        translation: {
            ...en
        }
    },
    'ru-RU': {
        translation: {
            ...ru
        }
    },
    'ko': {
        translation: {
            ...ko
        }
    },
    'jp': {
        translation: {
            ...jp
        }
    }
};

const DEFAULT_LNG = 'zh-CN';

let initialized = false;

/**
 * i18next 初始化：由 app 启动时显式 await（非 import 副作用），幂等。
 */
export const initI18n = async (): Promise<void> => {
    if (initialized) return;
    await i18next.init({
        fallbackLng: DEFAULT_LNG,
        lng: DEFAULT_LNG,
        supportedLngs,
        resources: {...i18nResources}
    });
    initialized = true;
};

/** 解析请求语言：`?lang=` query 优先（与 web_app 注入参数一致），回落 accept-language，再回落默认。 */
export const resolveLng = (queryLang: unknown, acceptLanguage?: string): string => {
    if (typeof queryLang === 'string' && supportedLngs.includes(queryLang))
        return queryLang;

    if (typeof acceptLanguage === 'string') {
        const primary: string = acceptLanguage.split(',')[0].trim();
        const match = supportedLngs.find((lng: string): boolean => primary.toLowerCase().startsWith(lng.toLowerCase().split('-')[0]));
        if (match) return match;
    }

    return DEFAULT_LNG;
};

/** 供 request.t 装饰使用的翻译函数。 */
export const translate = (lng: string): ((key: string, options?: Record<string, any>) => string) =>
    (key: string, options?: Record<string, any>): string => i18next.t(key, {lng, ...options}) as string;

export default i18next;
