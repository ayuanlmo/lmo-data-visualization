/**
 * @class BaseEventEmitter
 * @author ayuanlmo
 * **/
var BaseEventEmitter = /** @class */ (function () {
    function BaseEventEmitter() {
        this.events = new Map();
    }
    BaseEventEmitter.prototype.on = function (event, listener) {
        var _a;
        if (!this.events.has(event))
            this.events.set(event, []);
        (_a = this.events.get(event)) === null || _a === void 0 ? void 0 : _a.push(listener);
    };
    BaseEventEmitter.prototype.emitEvent = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this.events.get(event);
        if (listeners)
            listeners.forEach(function (listener) { return listener.apply(void 0, args); });
    };
    BaseEventEmitter.prototype.off = function (event, listener) {
        var listeners = this.events.get(event);
        if (listeners)
            this.events.set(event, listeners.filter(function (fn) { return fn !== listener; }));
    };
    return BaseEventEmitter;
}());
export default BaseEventEmitter;
