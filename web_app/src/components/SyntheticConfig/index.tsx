import React from "react";
import {ColProps, RowProps, Switch} from "@hi-ui/hiui";
import Grid from "@hi-ui/grid";
import Slider from "@hi-ui/slider";
import Radio from "@hi-ui/radio";
import {clarityConfigs, durationConfigs, fpsConfigs} from './config';

const SyntheticConfig = (): React.JSX.Element => {
    const {Col, Row}:
        {
            Col: React.ForwardRefExoticComponent<ColProps & React.RefAttributes<HTMLDivElement | null>>;
            Row: React.ForwardRefExoticComponent<RowProps & React.RefAttributes<HTMLDivElement | null>>;
        } = Grid;
    const colspan = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};

    return (
        <div className={'text-config app_none_user_select'}>
            <div className={'text-config-title app_flex_box'}>音频配置</div>
            <div className={'text-config-item app_flex_box'}>
                <Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}
                >
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>完整音频</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <Switch/>
                    </Col>
                    <Col justify={'flex-end'} span={24}>
                        <div className={'select-bg-image app_cursor_pointer app_position_relative'} style={{
                            width: '100%'
                        }}>
                            请选择音频
                        </div>
                    </Col>
                    <Col justify={'flex-end'} span={24}>
                        <Row gutter={true}
                             justify={"space-between"}
                             style={{
                                 width: '100%'
                             }}>
                            <Col span={6}>
                                <div className={'text-config-item-label'}>音量大小</div>
                            </Col>
                            <Col span={14}>
                                <div style={{
                                    marginTop: '-4px'
                                }}>
                                    <Slider defaultValue={100}/>
                                </div>
                            </Col>
                            <Col span={4}>
                                <div className={'text-config-item-label'}>100</div>
                            </Col>
                        </Row>
                    </Col>
                    <div className={'config-line '}></div>
                </Row>
            </div>
            <div className={'text-config-title app_flex_box'}>视频配置</div>
            <div className={'text-config-item app_flex_box'}>
                <Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>码率 (帧)</div>
                    </Col>
                    <Col span={colspan}>
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
                    </Col>
                </Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}>
                    <Col span={6}>
                        <div className={'text-config-item-label'}>时间 (秒)</div>
                    </Col>
                    <Col span={18}>
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
                    </Col>
                </Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <Row
                    gutter={true}
                    justify={"space-between"}
                    style={{
                        width: '100%'
                    }}>
                    <Col span={6}>
                        <div className={'text-config-item-label'}>清晰度</div>
                    </Col>
                    <Col span={18}>
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
                    </Col>
                </Row>
            </div>
            {/*<div className={'text-config-item-label'}>清晰度 (秒)</div>*/}
        </div>
    );
};

export default SyntheticConfig;