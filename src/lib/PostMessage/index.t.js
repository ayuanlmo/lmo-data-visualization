import Store from "@/store";

export const PostMessage = (message = {}) => {
    document.querySelector('iframe').contentWindow.postMessage(message, location.origin);
};

const OnMessage = (m) => {
    if (m.origin === location.origin) {
        const msg = m.data;

        console.log('收到消息', msg);

        if (msg.type === 'first') {
            Store.commit('SET_CURRENT_TEMPLATE_TEXT_SETTING', msg.data.text);
            Store.commit('SET_CURRENT_CSV_DATA', msg.data.defaultData);
            Store.commit('SET_CURRENT_TEMPLATE_THEME_COLORS', msg.data.themeColors);
        }
        if (msg.type === 'FullConfig') {
            Store.commit('SET_CURRENT_TEMPLATE_DEFAULT_DATA',msg.data);
        }
    }
};

addEventListener('message', OnMessage);
