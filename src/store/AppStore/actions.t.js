import {post} from '@/lib/Request/index.t';

import * as Type from '@const/ActionsTypes.t';
import * as URL from '@const/InterfaceUrls.t';

export default {
    [Type.GET_TEMPLATE_LIST]({commit}) {
        return post(URL.GET_TEMPLATE_DATA);
    },
    [Type.GET_MEDIA]({commit}) {
        return post(URL.GET_MEDIA);
    }
};
