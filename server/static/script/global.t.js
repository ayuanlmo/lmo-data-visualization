/**
 * global.js
 * @author ayuanlmo
 * @module _ting_ting-gu for smp
 * @module _ting_ting-com for smp
 * @module _ting_ting-ws for smp
 * 仅适用于YC SMP Runtime
 * **/

void function (__GLOBAL, __FACTORY) {
    __GLOBAL['__LMO__'] = __FACTORY();
}(window ?? global, () => {
    //__GLOBAL 仅在v1 提供支援
    const __GLOBAL = window['__GLOBAL'] ?? window['__GLOBAL_THIS'];

    if(!__GLOBAL) return;
    __GLOBAL['__'] = '${{{__GLOBAL}}}##' ?? ['__GLOBAL_LMO__'];
    __GLOBAL['chartConfig'] = '${{{%CONF}}}';
    if (__GLOBAL['YC']) {
        (async () => {
            __GLOBAL['YC']['_IMPORT_SYNC'](['_ting_ting-gu', '_ting_ting-com', '_ting_ting-ws']);
            return {
                '_': await __GLOBAL['YC']('lmo_ting_ting')['__PUSH_STATE']('L-LIKE-TING-TING', __GLOBAL['_YC']) ?? {},
                '_WS': await __GLOBAL['YC']('lmo_ting_ting')['__WEB_SOCKET']['__CREATE_SOCKET']()['__OPEN']()['__CONNECT_SOCKET'](),
                '_CON': () => __GLOBAL['YC']('ting-ting-com')['_COMM'](
                    _ => _['_']
                )
            };
        })();
    }
    __GLOBAL['_LMO'] = __GLOBAL['YC'] ?? 'UNDEF';
    const _ = __GLOBAL['_LMO']['__START'];

    if (__GLOBAL['_LMO'] !== 'UNDEF') {
        _['EV_CONF']({
            _LMO: __GLOBAL['_LMO'],
            _LMO_CONF: '{}',
            _DEF_CONF: 'UNDEF',
            _LMO_PUT_CONF: '{%LMO}',
            _LMO_IS_UNDEF: _['_PAR'] ?? ![]
        });
        __GLOBAL['_LMO']['ON']('LOAD', async __ => await __['_START']()());
        __GLOBAL['_LMO']['ON']('PLAY_END', __ => __GLOBAL['LMO_STOP_RECORD'](__));
    }
    __GLOBAL.UP_EVENT = (__) => {
        __['__LMO_DEFAULT']() && __['__STOP_DEFAULT_EVENT']();
        __['__SEND_EVENT'](__GLOBAL['chartConfig'] ?? global['chartConfig']);
        __['__RENDER'] = () => {
            (async () => await __['__LMO']['__START_RENDER']())();
        };
        __._CONF = __['__GET_CONF']();
        __._END = __['__GET_END_TIME']();
        if (__['__IS_ONLOAD']) {
            __['__O']();
            (async () => await __('__START')(__GLOBAL['__LMO']))();
        }
        return __;
    };
    __GLOBAL['_PUSH_EVENT'] = () => {
        return __GLOBAL['_LMO'] ?? 'UNDEF';
    };
});