import actions from './actions.t';
import getters from './getters.t';
import mutations from './mutations.t';
import state from './state.t';

export default {
    actions: {
        ...actions
    },
    getters: {
        ...getters
    },
    mutations: {
        ...mutations
    },
    state: {
        ...state
    }
};