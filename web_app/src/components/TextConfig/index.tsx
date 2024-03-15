import React, {useState} from 'react';
import {Input, NumberInput, Select, SelectOption, Switch} from "@hi-ui/hiui";
import Grid from "@hi-ui/grid";
import {ITemplateSelectTextElement} from "../../types/TemplateMessage";

export interface ITextConfigProps {
    config: null | ITemplateSelectTextElement
}

function TextConfig(props: ITextConfigProps): React.JSX.Element {
    const {Col, Row} = Grid;
    const colspan = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};

    const [config, setConfig] = useState(props.config as ITemplateSelectTextElement);

    console.log(config);

    return (
        <div className={'text-config app_none_user_select'}>
            <div className={'text-config-title app_flex_box'}>文字配置</div>
            <div className={'text-config-item app_flex_box'}>
                <Row gutter={true} justify={"space-between"}>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>显示</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <Switch
                            checked={config.display}
                            onChange={
                                (e: boolean) => {
                                    setConfig({
                                        ...config,
                                        display: e
                                    });
                                }
                            }
                        />
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>文字内容</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <Input
                            value={config.value}
                            defaultValue={config.value}
                        />
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>字号</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <NumberInput
                            value={config.fontSize}
                        />
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>颜色</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <div>
                            <input
                                type={'color'}
                                value={config.color}
                            />
                        </div>
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>对齐方式</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <div>
                            <Select>
                                <SelectOption>居左</SelectOption>
                                <SelectOption>居中</SelectOption>
                                <SelectOption>居右</SelectOption>
                            </Select>
                        </div>
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>位置</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <div className={'text-config-item-flex-box app_flex_box'}>
                            <Row gutter={true} justify={'space-between'}>
                                <Col span={colspan}>
                                    <Input
                                        prepend={<div>X</div>}
                                    />
                                </Col>
                                <Col span={colspan}>
                                    <Input
                                        prepend={<div>Y</div>}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>大小</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <div className={'text-config-item-flex-box app_flex_box'}>
                            <Row gutter={true} justify={'space-between'}>
                                <Col span={colspan}>
                                    <Input
                                        prepend={<div>H</div>}
                                    />
                                </Col>
                                <Col span={colspan}>
                                    <Input
                                        prepend={<div>W</div>}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className={'config-line'}></div>
        </div>
    );
}

export default TextConfig;
