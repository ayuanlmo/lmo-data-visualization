require('./style.t.scss');

export default {
    name: 'lmo-player_bar',
    props: {
        controllerButton: {
            type: Boolean,
            default: true
        },
        duration: {
            type: Number,
            default: 5000
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
                        on: {
                            click: () => {
                                this.reset();
                                this.$emit('play');
                            }
                        },
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
                    }, [
                        `${require('@/utils/index').formatSec(this.duration / 1000)} / ${require('@/utils/index').formatSec(this.currentTime)}`
                    ])
                ]),
                h('div', {
                    class: 'lmo-player_bar_progress_bar background'
                }, [
                    h('div', {
                        style: {
                            width: `${this.progressWidth}%`
                        },
                        class: 'lmo-player_bar_progress'
                    })
                ])
            ])
        );
    },
    methods: {
        init() {
            this.timerDuration = this.duration / 100;
            this.currentProgress += this.timerDuration;
            this.progressWidth += 1;
            if (this.progressWidth >= 100)
                return this.progressWidth = 100;
            if (this.currentProgress === this.duration)
                return;
            setTimeout(this.init, this.timerDuration);
        },
        initTime() {
            this.currentTime += 1;
            if (this.duration / 1000 !== this.currentTime && this.currentTime > this.duration / 1000)
                return this.currentTime = this.duration / 1000;
            setTimeout(this.initTime, 1000);
        },
        reset() {
            this.timerDuration = 0;
            this.currentProgress = 0;
            this.progressWidth = 0;
            this.currentTime = 0;
            this.init();
            this.initTime();
        }
    },
    mounted() {
        this.init();
        this.initTime();
    },
    data() {
        return {
            timerDuration: 0,
            currentProgress: 0,
            progressWidth: 0,
            currentTime: 0
        };
    }
};