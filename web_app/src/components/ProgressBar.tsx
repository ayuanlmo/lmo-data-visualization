import React, {useEffect, useState} from "react";
import {Grid, GridResponsiveSize} from "@hi-ui/hiui";
import {useSelector} from "react-redux";
import Hooks from "../bin/Hooks";
import {RootState} from "../lib/Store";
import {ReactState} from "../types/ReactTypes";
import postMessage from "../lib/PostMessage";
import Utils from "../utils";
import YExtendTemplate from "./YExtendTemplate";
import useTemplateMessageListener = Hooks.useTemplateMessageListener;

let currentProgress: number = 0;
let timer: any = 0;

const ProgressBar = (): React.JSX.Element => {
    const colspanTime: GridResponsiveSize<number> = {lg: 4, xl: 3, md: 4, sm: 5, xs: 6};
    const colspanSlider: GridResponsiveSize<number> = {lg: 16, xl: 20, md: 18, sm: 16, xs: 14};
    const duration: number = useSelector((state: RootState) => state.app.currentTemplateConfig.config.video.duration);
    const chatAnimationIsControllable: boolean = useSelector((state: RootState) => state.app.currentTemplateConfig.config?.animation?.chatAnimationIsControllable ?? false);
    const [width, setWidth]: ReactState<number> = useState<number>(0);
    const [showPause, setShowPause]: ReactState<boolean> = useState<boolean>(true);

    const initProgress = (): void => {
        clearInterval(timer);

        timer = setInterval((): void => {
            requestAnimationFrame((): void => {
                currentProgress += 1;
                setWidth(currentProgress);
                if (currentProgress === 100) {
                    clearInterval(timer);
                    currentProgress = 0;
                    setShowPause(true);
                }
            });
        }, duration / 100);
    };
    const initRender = (): void => {
        if (!chatAnimationIsControllable) {
            setWidth(0);
            currentProgress = 0;
            postMessage.send({
                type: 'RENDER',
                message: {}
            });
        } else {
            if (currentProgress === 0) {
                currentProgress = 0;
                postMessage.send({
                    type: 'RENDER',
                    message: {}
                });
                initProgress();
            }
        }
        initProgress();

    };
    const visibilitychange = (): void => {
        if (!document.hidden)
            initRender();
    };

    useEffect((): void => {
        setShowPause(chatAnimationIsControllable);
    }, []);

    useEffect((): void => {
        if (showPause)
            clearInterval(timer);
        else
            initProgress();
        postMessage.send({
            type: !showPause ? 'START_ANIMATION' : 'PAUSE_ANIMATION',
            message: {}
        });
    }, [showPause]);

    useEffect((): () => void => {
        document.addEventListener('visibilitychange', visibilitychange);

        return () => document.removeEventListener('visibilitychange', visibilitychange);
    }, []);

    useEffect((): () => void => {
        return (): void => {
            clearInterval(timer);
        };
    }, []);

    useTemplateMessageListener('TEMPLATE_RENDER', (): void => {
        initProgress();
    });

    return (
        <div className={'progress-bar app_none_user_select'}>
            <div className={'progress-bar-content'}>
                <Grid.Row justify={'space-between'}>
                    <Grid.Col span={1}>
                        <div
                            className={'progress-bar-play-icon app_cursor_pointer'}
                            onClick={(): void => {
                                if (chatAnimationIsControllable)
                                    setShowPause(!showPause);
                                initRender();
                            }}
                        >
                            <YExtendTemplate show={showPause || !chatAnimationIsControllable}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"
                                     fill="none">
                                    <circle cx="17" cy="17" r="17" fill="#0688E5"/>
                                    <path
                                        d="M22.9063 17.1562L14.6562 10.5625C14.375 10.3437 13.9375 10.5312 13.9375 10.9062L13.9375 24.0937C13.9375 24.4687 14.375 24.6562 14.6563 24.4375L22.9063 17.8437C23.125 17.6562 23.125 17.3437 22.9063 17.1562Z"
                                        fill="#F8F9FB"/>
                                </svg>
                            </YExtendTemplate>
                            <YExtendTemplate show={!showPause && chatAnimationIsControllable}>
                                <svg className="icon" viewBox="0 0 1024 1024" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg" width="34" height="34">
                                    <path
                                        d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0zM454.4 723.2c0 19.2-19.2 32-44.8 32-25.6 0-44.8-12.8-44.8-32L364.8 300.8c0-19.2 19.2-32 44.8-32 25.6 0 44.8 12.8 44.8 32L454.4 723.2zM665.6 723.2c0 19.2-19.2 32-44.8 32-25.6 0-44.8-12.8-44.8-32L576 300.8c0-19.2 19.2-32 44.8-32 25.6 0 44.8 12.8 44.8 32L665.6 723.2z"
                                        data-spm-anchor-id="a313x.search_index.0.i20.29b43a810X3VOw"
                                        className="selected" fill="#0688E5"></path>
                                </svg>
                            </YExtendTemplate>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={colspanSlider}>
                        <div className={'progress-bar-slider'}>
                            <div
                                className={'progress-bar-slider-track'}
                                style={{
                                    width: `${width}%`
                                }}
                            />
                        </div>
                    </Grid.Col>
                    <Grid.Col span={colspanTime}>
                        <div className={'progress-bar-time app_none_user_select'}>
                            <span>
                                {
                                    Utils.formatSec(duration * (width / 100), true)
                                }
                            </span>
                            <span> / </span>
                            <span>
                                {
                                    Utils.formatSec(duration, true)
                                }
                            </span>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
        </div>
    );
};

export default ProgressBar;
