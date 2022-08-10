require('./style.t.scss');

let durationTimer = 0;

let timeTimer = 0;

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
                                this.play();
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
                        `${require('@/utils/index').formatSec(this.currentTime)} / ${require('@/utils/index').formatSec(this.duration / 1000)}`
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
            clearTimeout(durationTimer);
            this.timerDuration = this.duration / 100;
            this.currentProgress += this.timerDuration;
            this.progressWidth += 1;
            if (this.progressWidth >= 100)
                return this.progressWidth = 100;
            if (this.currentProgress === this.duration)
                return;
            durationTimer = setTimeout(this.init, this.timerDuration);
        },
        initTime() {
            clearTimeout(timeTimer);
            this.currentTime += 1;
            if (this.duration / 1000 !== this.currentTime && this.currentTime > this.duration / 1000)
                return this.currentTime = this.duration / 1000;

            timeTimer = setTimeout(this.initTime, 1000);
        },
        reset() {
            this.timerDuration = 0;
            this.currentProgress = 0;
            this.progressWidth = 0;
            this.currentTime = 0;
            this.init();
            this.initTime();
        },
        onmessage(e) {
            if (e.data.type === 'TemplateRender') {
                this.reset();
            }
        },
        play() {
            this.$emit('play');
        },
        onkeydown(e) {
            if (e.code === 'Space') {
                this.reset();
                this.play();
            }
        }
    },
    mounted() {
        addEventListener('message', this.onmessage);
        addEventListener('keydown', this.onkeydown);
    },
    destroyed() {
        removeEventListener('message', this.onmessage);
        removeEventListener('keydown', this.onkeydown);
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