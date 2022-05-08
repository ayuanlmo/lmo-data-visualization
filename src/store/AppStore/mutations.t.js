import * as Type from '@/const/MutationTypes.t';
import {PostMessage} from '@/lib/PostMessage/index.t';
import {set_current_template_theme_colors} from "@/const/MutationTypes.t";

export default {
    [Type.set_current_template](state, data) {
        state.currentTemplate = data;
    },
    [Type.set_current_csv_data](state, data) {
        state.currentConfig.csvData = data;
    },
    [Type.set_current_template_text_setting](state, data) {
        PostMessage({
            type: 'UpdateTitle',
            data: data
        });
        state.currentConfig.config.text = data;
    },
    [Type.set_current_template_theme_colors](state, data) {
        state.currentConfig.config.themeColors = data;
    }
};