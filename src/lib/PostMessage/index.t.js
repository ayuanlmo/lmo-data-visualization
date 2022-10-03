/**
 * @PostMessage
 * @description 传送/接收讯息
 * **/
import Store from "@/store";
import {closeLoading, createNotification} from "@lib/BasicInteraction";

/**
 * @method PostMessage
 * @param message {object}
 * @description 传送讯息
 * **/
export const PostMessage = (message = {}) => {
    const _ = document.querySelector('iframe').contentWindow;

    _.postMessage(message, location.origin);
};

void (() => {
    //讯息侦听器
    addEventListener('message', (m) => {
        if (m.origin === location.origin) {
            const msg = m.data;

            //模板加载完毕
            if (msg.type === 'TemplateLoad')
                closeLoading();
            //首次加载
            if (msg.type === 'first') {
                Store.commit('SET_CURRENT_TEMPLATE_TEXT_SETTING', msg.data.text);
                Store.commit('SET_CURRENT_CSV_DATA', msg.data.defaultData);
                Store.commit('SET_CURRENT_TEMPLATE_THEME_COLORS', msg.data.themeColors);
            }
            //收到模板所有的配置文件
            if (msg.type === 'FullConfig')
                Store.commit('SET_CURRENT_TEMPLATE_DEFAULT_DATA', msg.data);
            //模板正在渲染
            if (msg.type === 'Play')
                Store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_PLAY_STATE', true);
            //模板渲染完毕
            if (msg.type === 'PlayEnd')
                Store.commit('SET_TEMPLATE_CURRENT_AUDIO_CONFIG_PLAY_STATE', false);
            //模板渲染发生错误(该错误可能是非致命错误)
            if (msg.type === 'RenderError')
                return createNotification({
                    title: '模板渲染错误',
                    type: 'error',
                    message: msg.data
                });
        }
    });
})();