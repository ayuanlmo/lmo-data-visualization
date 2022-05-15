require('./style.t.scss');

import About from '@/components/About/index.t';

export default {
    name: 'lmo-header',
    render(h) {
        return (
            h('div', {
                class: 'lmo-data_visualization_header'
            }, [
                h('div', {
                    class: 'lmo_flex_box'
                }, [
                    h(About, {ref: 'about'}),
                    h('img', {
                        attrs: {
                            src: require('../../assets/svg/lmo-logo.svg')
                        }
                    }),
                    h('h3', {
                        class: 'lmo_theme_color lmo_cursor_pointer',
                        on: {
                            click: () => {
                                this.$refs.about.show();
                            }
                        }
                    }, [require('@config/AppConfig').appName])
                ])
            ])
        );
    }
};