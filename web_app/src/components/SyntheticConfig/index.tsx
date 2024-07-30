import React from "react";
import {Grid, GridResponsiveSize, Radio, Slider, Switch} from "@hi-ui/hiui";
import {clarityConfigs, durationConfigs, fpsConfigs} from './config';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import {setCurrentTemplateAudioConfig, setCurrentTemplateVideoConfig} from "../../lib/Store/AppStore";
import {Dispatch} from "@reduxjs/toolkit";
import SelectBackgroundImage from "../ColorConfig/SelectBackgroundImage";
import PostMessage from "../../lib/PostMessage";
import postMessage from "../../lib/PostMessage";

const SyntheticConfig = (): React.JSX.Element => {
    const colspan: GridResponsiveSize<number> = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};
    const currentTemplateVideoConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.video);
    const currentTemplateAudioConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.audio);
    const dispatch: Dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <div className={'text-config app_none_user_select'}>
            <div className={'text-config-title app_flex_box'}>{t('audioConfig')}</div>
            <div className={'text-config-item app_flex_box'}>
                <Grid.Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}
                >
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('fullAudio')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
                        <Switch
                            defaultChecked={currentTemplateAudioConfig.full}
                            onChange={(checked: boolean): void => {
                                dispatch(setCurrentTemplateAudioConfig({
                                    ...currentTemplateAudioConfig,
                                    full: checked
                                }));
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={24}>
                        <div
                            style={{
                                width: '100%'
                            }}>
                            <SelectBackgroundImage
                                type={'audio'}
                                onSelect={(e: string, src: string | undefined): void => {
                                    postMessage.send({
                                        type: "RENDER",
                                        message: {}
                                    });
                                    dispatch(setCurrentTemplateAudioConfig({
                                        ...currentTemplateAudioConfig,
                                        src: src ?? '',
                                        path: src ?? ''
                                    }));
                                }}
                            />
                        </div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={24}>
                        <Grid.Row gutter={true}
                                  justify={"space-between"}
                                  style={{
                                      width: '100%'
                                  }}>
                            <Grid.Col span={10}>
                                <div className={'text-config-item-label'}>{t('audioVolume')}</div>
                            </Grid.Col>
                            <Grid.Col span={10}>
                                <div style={{
                                    marginTop: '-4px'
                                }}>
                                    <Slider
                                        defaultValue={currentTemplateAudioConfig.volume}
                                        onChange={(e: number): void => {
                                            dispatch(setCurrentTemplateAudioConfig({
                                                ...currentTemplateAudioConfig,
                                                volume: e
                                            }));
                                        }}
                                    />
                                </div>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <div className={'text-config-item-label'}>{currentTemplateAudioConfig.volume}</div>
                            </Grid.Col>
                        </Grid.Row>
                    </Grid.Col>
                    <div className={'config-line '}></div>
                </Grid.Row>
            </div>
            <div className={'text-config-title app_flex_box'}>{t('videoConfig')}</div>
            <div className={'text-config-item app_flex_box'}>
                <Grid.Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('videoFps')}</div>
                    </Grid.Col>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item app_flex_box'}>
                            <div
                                className={'app_flex_box'}
                                style={{
                                    marginTop: '-1.375em',
                                    justifyContent: 'end',
                                    width: '100%'
                                }}>
                                <Radio.Group
                                    defaultValue={currentTemplateVideoConfig.fps}
                                    value={currentTemplateVideoConfig.fps}
                                    type={"button"}
                                    autoWidth={true}
                                    data={fpsConfigs}
                                    onChange={(e: React.ReactText): void => {
                                        dispatch(setCurrentTemplateVideoConfig({
                                            ...currentTemplateVideoConfig,
                                            fps: e as number
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <Grid.Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}>
                    <Grid.Col span={6}>
                        <div className={'text-config-item-label'}>{t('videoDuration')}</div>
                    </Grid.Col>
                    <Grid.Col span={18}>
                        <div className={'text-config-item app_flex_box'}>
                            <div
                                className={'app_flex_box'}
                                style={{
                                    marginTop: '-1.375em',
                                    justifyContent: 'end',
                                    width: '100%'
                                }}>
                                <Radio.Group
                                    type={"button"}
                                    autoWidth={true}
                                    data={durationConfigs}
                                    defaultValue={currentTemplateVideoConfig.duration}
                                    value={currentTemplateVideoConfig.duration}
                                    onChange={(e: React.ReactText): void => {
                                        PostMessage.send({
                                            type: 'SET_DURATION',
                                            message: {
                                                duration: e
                                            }
                                        });
                                        dispatch(setCurrentTemplateVideoConfig({
                                            ...currentTemplateVideoConfig,
                                            duration: e as number
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <Grid.Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}>
                    <Grid.Col span={6}>
                        <div className={'text-config-item-label'}>{t('videoClarity')}</div>
                    </Grid.Col>
                    <Grid.Col span={18}>
                        <div className={'text-config-item app_flex_box'}>
                            <div
                                className={'app_flex_box'}
                                style={{
                                    marginTop: '-1.375em',
                                    justifyContent: 'end',
                                    width: '100%'
                                }}>
                                <Radio.Group
                                    type={"button"}
                                    autoWidth={true}
                                    data={clarityConfigs}
                                    value={currentTemplateVideoConfig.clarity}
                                    defaultValue={currentTemplateVideoConfig.clarity}
                                    onChange={(e: React.ReactText): void => {
                                        dispatch(setCurrentTemplateVideoConfig({
                                            ...currentTemplateVideoConfig,
                                            clarity: e as number
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
        </div>
    );
};

export default SyntheticConfig;
