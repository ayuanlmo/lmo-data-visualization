import {_POST} from '@/lib/Request/index.t';

import * as TYPE from '@const/ActionsTypes.t';
import * as URL from '@const/InterfaceUrls';

export default {
    [TYPE.GET_TEMPLATE_LIST]({commit}) {
        return _POST(URL.GET_TEMPLATE_DATA);
    },
    [TYPE.GET_MEDIA]({commit}) {
        return _POST(URL.GET_MEDIA);
    }
};
