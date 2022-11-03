/**
 * global.js
 * @author ayuanlmo
 * @module _ying_core-buffer for smp
 * @module _ying_core-socket for smp
 * @module _ying_core for smp
 * @description 这是一份适用于YC SMP Runtime的驱动文件。如果您的运行环境非YC SMP 可忽略它。它不会影响应用运行于其他运行环境
 * **/

void function (__GLOBAL, __FACTORY) {
    __GLOBAL['__LMO__'] = __FACTORY();
}(window ?? global, () => {
    const __GLOBAL = window['__GLOBAL'] ?? window['__GLOBAL_THIS'];

    if (!__GLOBAL) return;
    // import module

    (function () {
        // Y Core具有 T Core更好的兼容性
        /** <??First>**/__GLOBAL['YC']['_IMPORT_SYNC'](['_ying_core', '_ying_core-buffer', '_ying_core-socket', '_ying_com']);
        __GLOBAL['YC']['SET_CONFIG']({
            SELECT_FILE: '0',
            OPU_OUT_FILE: '0',
            NET: '0',
            HOST: 'Default',
            HTTPS: '0',
            CATCH_EXCEPTION: '1'
        });
        return {
            // 按条件返回当前环境状态
            '_': __GLOBAL['YC']('L_Ying')['__PUSH_STATE']('L LIKE Ying YC', __GLOBAL['_YC']) ?? {},
            // 返回一个套接字实例
            '_SOCKET': __GLOBAL['YC']('ying_core')['__WEB_SOCKET']['__CREATE_SOCKET']()['__OPEN']('${{{SOCKET_URL}}}')['__CONNECT'](),
            '_COM': () => __GLOBAL['YC']('ying_com')['_COMM'](_ => _['_']),
            // 保留之前的_CON 否则会抛异常.
            '_CON': 'UNDEF'
        };
    })();

    // 获取模板Config
    __GLOBAL['chartConfig'] = '${{{%CONF}}}';
    __GLOBAL['_LMO'] = __GLOBAL['YC'] ?? 'UNDEF';

    // <?? LOAD>
    (function* () {
        yield __GLOBAL['YC']['POST_MESSAGE']({
            _t: new Date().getTime().toString(),
            _typ: 'TempLate',
            _r: null,
            _e: [].push(...[''])
        });
    })().next();
    // <?? END_LOAD>

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
    __GLOBAL._VM_RAM = __GLOBAL['YC']['ying_core-buffer']['CREATE']('1.2M')['WAIT']();
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