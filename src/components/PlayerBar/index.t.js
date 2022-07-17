require('./style.t.scss');

export default {
    name: 'lmo-player_bar',
    props: {
        controllerButton: {
            type: Boolean,
            default: true
        }
    },
    render(h) {
        return (
            h('div', {
                class: 'lmo-player_bar lmo_flex_box'
            }, [
                h('div', {
                    class: 'lmo-player_bar_controller_box lmo_flex_box'
                }, [
                    h('div', {
                        class: {
                            'lmo_hide': !this.controllerButton
                        }
                    }, [
                        h('img', {
                            attrs: {
                                src: require('@/assets/svg/play-circle.svg')
                            }
                        })
                    ]),
                    h('div', {
                        class: 'lmo-player_bar_controller_time'
                    }, ['00:05 / 00:01'])
                ]),
                h('div', {
                    class: 'lmo-player_bar_progress_bar background'
                }, [
                    h('div', {
                        class: 'lmo-player_bar_progress_bar'
                    })
                ])
            ])
        );
    }
};