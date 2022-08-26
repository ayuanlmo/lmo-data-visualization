import Store from "@/store";
import {Notification} from "element-ui";
import {closeLoading} from "@lib/Loading";

export const PostMessage = (message = {}) => {
    const _ = document.querySelector('iframe').contentWindow;

    _.postMessage(message, location.origin);
};

void (() => {
    addEventListener('message', (m) => {
        if (m.origin === location.origin) {
            const msg = m.data;

            if (msg.type === 'TemplateLoad')
                closeLoading();
            if (msg.type === 'first') {
                Store.commit('SET_CURRENT_TEMPLATE_TEXT_SETTING', msg.data.text);
                Store.commit('SET_CURRENT_CSV_DATA', msg.data.defaultData);
                Store.commit('SET_CURRENT_TEMPLATE_THEME_COLORS', msg.data.themeColors);
            }
            if (msg.type === 'FullConfig')
                Store.commit('SET_CURRENT_TEMPLATE_DEFAULT_DATA', msg.data);
            if (msg.type === 'Play')
                Store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_PLAY_STATE', true);
            if (msg.type === 'PlayEnd')
                Store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_PLAY_STATE', false);
            if (msg.type === 'RenderError')
                return Notification({
                    title: '模板渲染错误',
                    type: 'error',
                    message: msg.data
                });
        }
    });
})();