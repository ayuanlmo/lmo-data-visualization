export interface AudioPlayerInterface {
    isDestroy: boolean;
    canplay: boolean;
    load: () => void;
    setSrc: (src: string) => Promise<void>;
    play: (s?: boolean) => void;
    setVolume: (v: number) => void;
    destroy: () => void;
    continue: (src: string) => Promise<void>;
    pause: (src: string) => Promise<void>;
    getRef: () => HTMLAudioElement;
    addEventListener: <T extends keyof HTMLMediaElementEventMap>(event: T, listener: (...args: Array<HTMLMediaElementEventMap[T]>) => any) => void;
    removeEventListener: <T extends keyof HTMLMediaElementEventMap>(event: T, listener: (...args: Array<HTMLMediaElementEventMap[T]>) => any) => void;
}

class AudioPlayer implements AudioPlayerInterface {
    public isDestroy: boolean;
    public canplay: boolean;
    private audioObject: HTMLAudioElement | null;
    private url: string;

    constructor(url: string) {
        this.url = url;
        this.audioObject = null;
        this.isDestroy = false;
        this.canplay = false;
        this.init();
    }

    public load(): void {
        this.audioObject?.paused && this.audioObject.pause();
        this.audioObject?.load();
    }

    public async setSrc(url: string): Promise<void> {
        this.url = url;
        await this.pause();
        this.audioObject && (this.audioObject.src = this.url);
        this.load();
    }

    public play(s: boolean = false): void {
        this.pause().then(async (): Promise<void> => {
            if (s) {
                this.audioObject && (this.audioObject.currentTime = 0);
                setTimeout(async (): Promise<void> => {
                    await this.audioObject?.play();
                });
            } else
                await this.continue();
        });
    }

    public setVolume(v: number): void {
        this.audioObject && (this.audioObject.volume = v);
    }

    public destroy(): void {
        if (!this.audioObject?.paused)
            this.pause();
        this.audioObject = null;
        this.isDestroy = true;
    }

    public async continue(): Promise<void> {
        await this.audioObject?.play();
    }

    public getRef(): HTMLAudioElement {
        return this.audioObject as HTMLAudioElement;
    }

    public addEventListener<T extends keyof HTMLMediaElementEventMap>(event: T, listener: (...args: Array<HTMLMediaElementEventMap[T]>) => any): void {
        if (event)
            this.audioObject?.addEventListener(event, listener);
    }

    // 移除事件侦听器
    public removeEventListener<T extends keyof HTMLMediaElementEventMap>(event: T, listener: (...args: Array<HTMLMediaElementEventMap[T]>) => any): void {
        if (event)
            this.audioObject?.removeEventListener(event, listener);
    }

    public pause(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout((): void => {
                if (!this.audioObject?.paused) {
                    this.audioObject?.pause();
                }
                resolve();
            });
        });
    }

    private init(): void {
        if (this.audioObject === null && !this.isDestroy) {
            if (!('Audio' in window)) {
                throw '(AudioPlayer) Error: Your browser does not support audio playback.';
            }
            this.audioObject = new Audio(this.url);
            this.audioObject.addEventListener('ended', (): void => {
                this.audioObject?.pause();
            });
            this.audioObject.addEventListener('canplaythrough', (): void => {
                this.canplay = true;
            });
        }
    }
}

export default AudioPlayer;
