import {_POST, _POST_Form_Data} from '@/lib/Request/index.t';
import * as TYPE from '@const/ActionsTypes.t';
import * as URL from '@const/InterfaceUrls';

export default {
    [TYPE.GET_TEMPLATE_LIST]({commit}) {
        return _POST(URL.GET_TEMPLATE_DATA);
    },
    [TYPE.GET_MEDIA]({commit}) {
        return _POST(URL.GET_MEDIA);
    },
    [TYPE.UPLOAD_MEDIA]({commit}, params) {
        return _POST_Form_Data(URL.UPLOAD_MEDIA, params);
    },
    [TYPE.GET_UPLOAD_MEDIA]({commit}) {
        return _POST(URL.GET_UPLOAD_MEDIA);
    }
};
