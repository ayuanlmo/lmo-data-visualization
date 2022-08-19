/**
 * @class LmoAudioPlayer
 * @constructor
 * @param src {string} Audio Url
 * **/

export default class LmoAudioPlayer {
    constructor(src = '') {
        this.Audio = null;
        this.Playing = false;
        this.src = src;
        this.init();
    }

    init() {
        if (this.Audio === null) {
            this.Audio = document.createElement('audio');
            this.Audio.addEventListener('ended', () => {
                this.pause();
            });
            this.setSrc(this.src);
        }
    }

    setVolume(v) {
        this.Audio.volume = v;
    }

    setSrc(src) {
        this.Audio.src = src;
        this.src = src;
    }

    load() {
        this.Audio.load();
    }

    play(s = true) {
        if (s) this.Audio.currentTime = 0;
        this.Audio.play();
    }

    pause() {
        if (!this.Audio.paused) {
            this.Audio.pause();
            this.Audio.currentTime = 0;
        }
    }

    ref() {
        return this.Audio;
    }

    destroy() {
        if (!this.Audio.paused)
            this.Audio.pause();
        this.Audio = null;
    }

    continue() {
        this.play(false);
    }
}