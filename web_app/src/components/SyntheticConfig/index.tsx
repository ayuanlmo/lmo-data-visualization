import React from "react";
import {Grid, GridResponsiveSize, Radio, Slider, Switch} from "@hi-ui/hiui";
import {clarityConfigs, durationConfigs, fpsConfigs} from './config';

const SyntheticConfig = (): React.JSX.Element => {
    const colspan: GridResponsiveSize<number> = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};

    return (
        <div className={'text-config app_none_user_select'}>
            <div className={'text-config-title app_flex_box'}>音频配置</div>
            <div className={'text-config-item app_flex_box'}>
                <Grid.Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}
                >
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>完整音频</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
                        <Switch/>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={24}>
                        <div className={'select-bg-image app_cursor_pointer app_position_relative'} style={{
                            width: '100%'
                        }}>
                            请选择音频
                        </div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={24}>
                        <Grid.Row gutter={true}
                                  justify={"space-between"}
                                  style={{
                                      width: '100%'
                                  }}>
                            <Grid.Col span={6}>
                                <div className={'text-config-item-label'}>音量大小</div>
                            </Grid.Col>
                            <Grid.Col span={14}>
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
            <div className={'text-config-title app_flex_box'}>视频配置</div>
            <div className={'text-config-item app_flex_box'}>
                <Grid.Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>码率 (帧)</div>
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
                        <div className={'text-config-item-label'}>时间 (秒)</div>
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
                        <div className={'text-config-item-label'}>清晰度</div>
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