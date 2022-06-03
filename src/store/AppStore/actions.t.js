import {post} from '@/lib/Request/index.t';

import * as Type from '@/const/actionsTypes';
import * as URL from '@/const/interfaceUrls';

export default {
    [Type.get_template_list]({commit}) {
        return post(URL.get_template_data);
    },
    [Type.get_media]({commit}) {
        return post(URL.get_media);
    }
};
