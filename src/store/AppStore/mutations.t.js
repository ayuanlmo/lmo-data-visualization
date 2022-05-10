import * as Type from '@/const/MutationTypes.t';
import {PostMessage} from '@/lib/PostMessage/index.t';

export default {
    [Type.set_current_template_default_data](state, data){
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
    }
};