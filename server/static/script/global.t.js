void function (__GLOBAL, __FACTORY) {
    __GLOBAL['__LMO__'] = __FACTORY();
}(window ?? global, () => {
    const __GLOBAL = window;

    __GLOBAL['__'] = '${{{__GLOBAL}}}##' ?? ['__GLOBAL_LMO__'];
    __GLOBAL['chartConfig'] = '${{{%CONF}}}';
    if (__GLOBAL['YC']) {
        (async () => {
            __GLOBAL['YC']['_IMPORT_SYNC'](['_ting_ting-gu', '_ting_ting-com', '_ting_ting-ws']);
            return {
                '_': await __GLOBAL['YC']('lmo_ting_ting')['__PUSH_STATE']('L-LIKE-TING-TING', __GLOBAL['_YC']) ?? {},
                '_WS': await __GLOBAL['YC']('lmo_ting_ting')['__WEB_SOCKET']['__CREATE_SOCKET']()['__OPEN']()['__CONNECT_SOCKET'](),
                '_CON': () => __GLOBAL['YC']('ting-ting-com')['_COMM'](E => E['_'])
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
        __GLOBAL['_LMO']['ON']('LOAD', async E => await E['_START']()());
        __GLOBAL['_LMO']['ON']('PLAY_END', E => __GLOBAL['LMO_STOP_RECORD'](E));
    }
    __GLOBAL.UP_EVENT = (E) => {
        E['__LMO_DEFAULT']() && E['__STOP_DEFAULT_EVENT']();
        E['__SEND_EVENT'](__GLOBAL['chartConfig'] ?? global['chartConfig']);
        E['__RENDER'] = () => {
            (async () => await E['__LMO']['__START_RENDER']())();
        };
        E._CONF = _['__GET_CONF']();
        E._END = _['__GET_END_TIME']();
        if (_['__IS_ONLOAD']) {
            _['__O']();
            (async () => await _('__START')(__GLOBAL['__LMO']))();
        }
        return E;
    };
    __GLOBAL['_PUSH_EVENT'] = () => {
        return __GLOBAL['_LMO'] ?? 'UNDEF';
    };
});