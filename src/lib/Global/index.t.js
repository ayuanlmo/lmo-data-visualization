/**
 * @description 这是一份适用于 YC smp Runtime 的一套驱动程序
 * 如果您在其他Runtime运行该程序，可忽略。它不会影响该应用运行于其他Runtime
 * */
const globalThis = window ?? globalThis ?? global;
const _ = window ?? globalThis;
const appConfig = require('@/config/AppConfig');

void (async (_, __FACTORY) => {
    try {
        _['__LMO'] = __FACTORY();
    } catch (e) {
        return {};
    }
    console.log('\n' +
        '.   ,                    .        \n' +
        ' \\./ *._  _      ___     |._ _  _ \n' +
        '  |  |[ )(_]             |[ | )(_)\n' +
        '         ._|                      \n');
    console.log(`%c [Ying C++]  %c ${_['__LMO']._PM['_YING_C++']}`, 'color:pink;background:#030307;padding:4px 0;', 'background:#EE6666;padding:4px 0;');
})(globalThis ?? global, () => {
    return {
        _PM: {
            '_YING_C++': _['V'] ? _['V']['T_CPP']['__'] : false,
            '_YING_BUFFER': _['V'] ? _['V']['T_Buffer']['__'] : false,
            _CREATE_CPP_MEMORY: _['M'] ? _['M']['CPP_MEMORY']['__CREATE'] : () => {
                return false;
            }
        },
        _PF: {
            _YING: _['V'] ? _['V']['includes']('YING-YING') : false,
            _NETWORK: {
                _SOCKET: {
                    _WEBSOCKET: 'WebSocket' in _,
                    _YING_WS: '__CreateWebSocket' in _,
                    _YC_WS: '__ConnectSocket' in _
                }
            },
            _SU: {
                _MEMORY_ACCELERATION: _['M'] ? _['MEMORY_ACCELERATION']['__'] : false,
                _GPU_ACCELERATED_RENDERING: _['R'] ? _['R']['ACCELERATED_RENDERING']['__'] : false
            }
        },
        _APP_NAME: appConfig.appName,
        _AUTHOR: appConfig.appAuthor,
        _PRODUCTION: process.env.NODE_ENV !== 'development',
        _OPENSOURCE: appConfig.openSource,
        _BROWSER: {
            _NAME: navigator['userAgentData']['brands'][1]['brand'] ?? null,
            _NER: navigator['userAgentData']['brands'][1]['version'] ?? 0
        },
        _USER: {
            _AGENT: navigator.userAgent,
            _SYS: {
                _PLATFORM: navigator.platform,
                _NAME: navigator['userAgentData'].platform
            }
        },
        _LANG: {
            _DEFAULT: navigator.language,
            _LANGUAGES: navigator.languages
        }
    };
});