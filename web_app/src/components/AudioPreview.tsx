import React, {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {useTemplateMessageListener} from "../bin/Hooks";
import {RootState} from "../lib/Store";

let timer: NodeJS.Timeout | null = null;
const AudioPreview = (): React.JSX.Element => {
    const audioElementRef: React.MutableRefObject<HTMLAudioElement | null> = useRef<HTMLAudioElement | null>(document.getElementById(window.__LMO_APP_CONFIG.__PLAYER_EL_ID) as HTMLAudioElement);
    const currentTemplateConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config);
    const {audio: currentAudioConfig, video: currentVideoConfig} = currentTemplateConfig;

    const pause = (): void => {
        if (!audioElementRef.current) return;
        if (!audioElementRef.current.paused) {
            audioElementRef.current.pause();
            audioElementRef.current.currentTime = 0;
        }
    };

    const play = (): void => {
        const audioElement: HTMLAudioElement | null = audioElementRef.current;

        if (!audioElement || audioElement.src === '' || audioElement.src === location.href) return;
        if (timer) clearTimeout(timer);

        (async (): Promise<void> => {
            pause();
            await audioElement.play();
        })();

        if (!currentAudioConfig.full) {
            timer = setTimeout((): void => {
                pause();
                audioElement.src = '';
            }, currentVideoConfig.duration);
        }
    };

    useEffect((): () => void => {
        const audioElement: HTMLAudioElement | null = audioElementRef.current;

        if (audioElement) {
            if (currentAudioConfig.src)
                audioElement.src = '/api' + currentAudioConfig.src;
            else
                audioElement.src = '';
        }

        return (): void => {
            pause();
        };
    }, [currentAudioConfig]);

    useTemplateMessageListener('TEMPLATE_RENDER', (): void => {
        play();
    });

    return <></>;
};

export default AudioPreview;
