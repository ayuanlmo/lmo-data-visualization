/**
 * @class LmoAudioPlayer
 * @constructor
 * @param src {string} Audio Url
 * @author ayuanlmo
 * @description 适用于WebApp的简易音频播放器组件
 * **/

export default class LmoAudioPlayer {
    constructor(src = '') {
        this.Audio = null;
        this.src = src;
        this.isDestroy = false;
        this.canplay = false;
        this.createPlayer();
    }

    // 创建播放器
    createPlayer() {
        if (this.Audio === null && !this.isDestroy) {
            this.Audio = null;
            this.Audio = new Audio(this.src);
            this.addEventListener('ended', () => {
                this.pause();
            });
            this.addEventListener('canplaythrough', () => {
                this.canplay = true;
            });
        }
    }

    // 设置音频文件地址
    setSrc(src) {
        this.Audio.src = src;
        this.src = src;
        this.load();
    }

    // 重新加载
    load() {
        this.Audio.load();
    }

    /**
     * @method play
     * @description 开始播放
     * @param s {boolean} 从头开始
     * **/
    play(s = true) {
        this.pause().then(() => {
            if (s) {
                this.Audio.currentTime = 0;
                setTimeout(() => {
                    this.Audio.play();
                });
            } else
                this.continue();
        });
    }

    // 暂停
    pause() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 异步暂停 防止造成意外的调用
                if (!this.Audio.paused)
                    this.Audio.pause();
                resolve();
            });
            this.Audio.currentTime = 0;
        });
    }

    // 获取音频对象
    ref() {
        return this.Audio;
    }

    // 销毁
    destroy() {
        if (!this.Audio.paused)
            this.Audio.pause();
        this.Audio = null;
        this.isDestroy = true;
    }

    // 设置音量
    setVolume(v) {
        this.Audio.volume = v;
    }

    // 添加事件侦听器
    addEventListener(event, listener) {
        if (event)
            this.Audio.addEventListener(event, listener);
    }

    // 移除事件侦听器
    removeEventListener(event, listener) {
        if (event)
            this.Audio.removeEventListener(event, listener);
    }

    // 继续播放
    continue() {
        this.Audio.play();
    }
}