import * as Type from '@/const/MutationTypes.t';
import {PostMessage} from '@/lib/PostMessage/index.t';
import {
    set_template_current_audio_config_name,
    set_template_current_audio_config_play_state,
    set_template_current_audio_config_src,
    set_template_current_audio_config_volume
} from "@/const/MutationTypes.t";

export default {
    [Type.set_current_template_default_data](state, data) {
        state.currentConfig = data;
    },
    [Type.set_current_template](state, data) {
        state.currentTemplate = data;
    },
    [Type.set_current_csv_data](state, data) {
        state.currentConfig.csvData = data;
        state.currentConfig.data = data;
    },
    [Type.set_current_template_text_setting](state, data) {
        PostMessage({
            type: 'UpdateTitle',
            data: data
        });
        state.currentConfig.text = data;
    },
    [Type.set_current_template_theme_colors](state, data) {
        state.currentConfig.themeColors = data;
    },
    [Type.set_template_current_audio_config_name](state, data) {
        state.templateCurrentAudioConfig.name = data;
    },
    [Type.set_template_current_audio_config_volume](state, data) {
        state.templateCurrentAudioConfig.volume = data;
    },
    [Type.set_template_current_audio_config_src](state, data) {
        state.templateCurrentAudioConfig.src = data;
    },
    [Type.set_template_current_audio_config_play_state](state, data) {
        state.templateCurrentAudioConfig.playState = data;
    }
};