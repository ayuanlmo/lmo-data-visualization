import cn from './resources/cn';
import tw from './resources/tw';
import en from './resources/en';
import jp from './resources/en';
import ru from './resources/ru';
import ko from './resources/ko';

export const supportedLngs = ['zh-CN', 'zh-TW', 'en', 'ko', 'ru-RU', 'jp'] as const;

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
