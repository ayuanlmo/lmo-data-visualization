/**
 * Nprogress
 * @author ayuanlmo
 * @module nprogress
 * Created by ayuanlmo on 2022/04
 * **/

import Nprogress from 'nprogress';
require('./style.t.scss');

export const start = (d = 0.1) => {
    Nprogress['set'](d);
    setTimeout(async () => {
        await Nprogress['start']();
    });
};

export const done = () => {
    setTimeout(async () => {
        await Nprogress['done']();
    });
};
