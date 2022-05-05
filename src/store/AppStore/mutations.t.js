import * as Type from '@/const/MutationTypes.t'

export default {
    [Type.set_current_template](state, data) {
        state.currentTemplate = data;
    }
};