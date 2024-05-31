import React from "react";
import {Grid, GridResponsiveSize, Radio, Slider, Switch} from "@hi-ui/hiui";
import {clarityConfigs, durationConfigs, fpsConfigs} from './config';
import {useTranslation} from "react-i18next";

const SyntheticConfig = (): React.JSX.Element => {
    const colspan: GridResponsiveSize<number> = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};
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
                        <Switch/>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={24}>
                        <div className={'select-bg-image app_cursor_pointer app_position_relative'} style={{
                            width: '100%'
                        }}>
                            {t('pleaseSelectAudio')}
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
                                    <Slider defaultValue={100}/>
                                </div>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <div className={'text-config-item-label'}>100</div>
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
                                <Radio.Group type={"button"} autoWidth={true} data={fpsConfigs}/>
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
                                <Radio.Group type={"button"} autoWidth={true} data={durationConfigs}/>
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
                                <Radio.Group type={"button"} autoWidth={true} data={clarityConfigs}/>
                            </div>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
        </div>
    );
};

export default SyntheticConfig;