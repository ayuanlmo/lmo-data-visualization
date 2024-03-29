import * as TYPE from '@/const/MutationTypes.t';
import {PostMessage} from '@/lib/PostMessage/index.t';
import {UPDATE_COLOR, UPDATE_COLOR_MODE, UPDATE_DURATION, UPDATE_TEXT} from '@/const/MessageType.t';

export default {
    [TYPE.SET_CURRENT_TEMPLATE_DEFAULT_DATA](state, data) {
        state.currentConfig = data;
    },
    [TYPE.SET_CURRENT_TEMPLATE](state, data) {
        state.currentTemplate = data;
    },
    [TYPE.SET_TEMPLATE_CURRENT_BACKGROUND](state, data) {
        state.currentConfig['background'] = data;
    },
    [TYPE.SET_CURRENT_CSV_DATA](state, data) {
        state.currentConfig['csvData'] = data;
        state.currentConfig['data'] = data;
    },
    [TYPE.SET_CURRENT_TEMPLATE_TEXT_SETTING](state, data) {
        PostMessage({
            type: UPDATE_TEXT,
            data: data
        });
        state.currentConfig['text'] = data;
    },
    [TYPE.SET_CURRENT_TEMPLATE_COLOR_SETTING](state, data) {
        PostMessage({
            type: UPDATE_COLOR,
            data: data
        });
        state.currentConfig['color'] = {
            ...state.currentConfig['color'],
            ...data
        };
    },
    [TYPE.SET_CURRENT_TEMPLATE_COLOR_MODE](state, data) {
        state.currentConfig['color']['more'] = data;
        PostMessage({
            type: UPDATE_COLOR_MODE,
            data: data
        });
    },
    [TYPE.SET_CURRENT_TEMPLATE_THEME_COLORS](state, data) {
        state.currentConfig['themeColors'] = data;
    },
    [TYPE.SET_TEMPLATE_CURRENT_AUDIO_CONFIG_NAME](state, data) {
        state.templateCurrentAudioConfig.name = data;
    },
    [TYPE.SET_TEMPLATE_CURRENT_AUDIO_CONFIG_COMPLETE](state, data) {
        state.templateCurrentAudioConfig.complete = data;
    },
    [TYPE.SET_TEMPLATE_CURRENT_AUDIO_CONFIG_VOLUME](state, data) {
        state.templateCurrentAudioConfig.volume = data;
    },
    [TYPE.SET_TEMPLATE_CURRENT_AUDIO_CONFIG_SRC](state, data) {
        state.templateCurrentAudioConfig.src = data;
    },
    [TYPE.SET_TEMPLATE_CURRENT_AUDIO_CONFIG_PLAY_STATE](state, data) {
        state.templateCurrentAudioConfig.playState = data;
    },
    [TYPE.SET_TEMPLATE_CURRENT_DURATION](state, data) {
        PostMessage({
            type: UPDATE_DURATION,
            data: data * 1000
        });
        state.currentConfig['duration'] = data * 1000;
    },
    [TYPE.SET_SERVER_PUSH_MESSAGE](state, data) {
        state.serverPushMessage.push(data);
    },
    [TYPE.SET_CURRENT_TEMPLATE_VIDEO_CONFIG](state, data = {}) {
        state.currentTemplateVideoConfig = data;
    },
    [TYPE.RESET_CURRENT_TEMPLATE_CONFIG](state) {
        state.currentConfig = {
            csvData: '',
            config: {},
            duration: 5000
        };
    },
    [TYPE.RESET_TEMPLATE_CURRENT_AUDIO_CONFIG](state) {
        state.templateCurrentAudioConfig = {
            name: '',
            volume: 1,
            src: '',
            complete: false,
            playState: false
        };
    },
    [TYPE.SET_CURRENT_THEME_COLORS](state, data) {
        state.currentConfig['themeColor'] = data;
    }
};