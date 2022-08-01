const globalThis = window ?? globalThis;
const _ = window ?? globalThis;
const appConfig = require('@/config/AppConfig');

void ((_, __FACTORY) => {
    try {
        _['__LMO'] = __FACTORY();
    } catch (e) {
        return {};
    }
    console.log('  _______                       _______                ');
    console.log(' \'   /    ` , __     ___.      \'   /    ` , __     ___.');
    console.log('     |    | |\'  `. .\'   `          |    | |\'  `. .\'   `');
    console.log('     |    | |    | |    |          |    | |    | |    |');
    console.log('     /    / /    |  `---|          /    / /    |  `---|');
    console.log('                    \\___/                         \\___/');
    console.log(`%c [婷婷C++]  %c ${_['__LMO']._PM['_TING_TING_C++']}`, 'color:pink;background:#030307;padding:4px 0;', 'background:#EE6666;padding:4px 0;');
})(globalThis ?? global, () => {
    return {
        _PM: {
            '_TING_TING_C++': _['V'] ? _['V']['T_CPP']['__'] : false,
            '_TING_TING_BUFFER': _['V'] ? _['V']['T_Buffer']['__'] : false,
            _CREATE_CPP_MEMORY: _['M'] ? _['M']['CPP_MEMORY']['__CREATE'] : () => {
                return false;
            }
        },
        _PF: {
            _TING_TING: _['V'] ? _['V']['includes']('ting-ting') : false,
            _NETWORK: {
                _SOCKET: {
                    _WEBSOCKET: 'WebSocket' in _,
                    _TING_TING_WS: '__CreateWebSocket' in _,
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