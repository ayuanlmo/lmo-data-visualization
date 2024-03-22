import React, {useEffect, useState} from 'react';
import {ColProps, Input, NumberInput, RowProps, Select, SelectOption, Switch} from "@hi-ui/hiui";
import Grid from "@hi-ui/grid";
import {ITemplateSelectTextElement, TTemplateTextConfigAlignType} from "../../types/TemplateMessage";
import PostMessage from "../../lib/PostMessage";
import ColorPicker from "../ColorPicker";

export interface ITextConfigProps {
    config: null | ITemplateSelectTextElement
}

const TextConfig = (props: ITextConfigProps): React.JSX.Element => {
    const {Col, Row}:
        {
            Col: React.ForwardRefExoticComponent<ColProps & React.RefAttributes<HTMLDivElement | null>>;
            Row: React.ForwardRefExoticComponent<RowProps & React.RefAttributes<HTMLDivElement | null>>;
        } = Grid;
    const colspan = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};
    const [config, setConfig]:
        [ITemplateSelectTextElement, React.Dispatch<React.SetStateAction<ITemplateSelectTextElement>>]
        = useState(props.config as ITemplateSelectTextElement);

    useEffect((): void => {
        setConfig(props.config as ITemplateSelectTextElement);
    }, [props]);

    useEffect((): void => {
        PostMessage.send({
            type: "SET_TEXT_CONFIG",
            message: {
                ...config
            }
        });
    }, [config]);

    return (
        <div className={'text-config app_none_user_select'}>
            <div className={'text-config-title dark-mode app_flex_box'}>文字配置</div>
            <div className={'text-config-item app_flex_box'}>
                <Row gutter={true} justify={"space-between"}>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>显示</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <Switch
                            checked={config.display}
                            onChange={
                                (e: boolean): void => {
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
                            onChange={
                                (e: React.ChangeEvent<HTMLInputElement>): void => {
                                    setConfig({
                                        ...config,
                                        value: e.target.value
                                    });
                                }
                            }
                        />
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>字号</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <NumberInput
                            value={config.fontSize}
                            onChange={(value: number | null): void => {
                                return setConfig({
                                    ...config,
                                    fontSize: Number(value ?? 0)
                                });
                            }}
                        />
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>颜色</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <div>
                            <ColorPicker
                                value={config.color}
                                onChange={
                                    (value: string): void => {
                                        setConfig({
                                            ...config,
                                            color: value
                                        });
                                    }
                                }
                            />
                        </div>
                    </Col>
                    <Col span={colspan}>
                        <div className={'text-config-item-label'}>对齐方式</div>
                    </Col>
                    <Col justify={'flex-end'} span={colspan}>
                        <div>
                            <Select
                                value={config.align}
                                onChange={
                                    (val: React.ReactText): void => {
                                        setConfig({
                                            ...config,
                                            align: val as TTemplateTextConfigAlignType
                                        });
                                    }
                                }
                            >
                                <SelectOption value={'left'}>居左</SelectOption>
                                <SelectOption value={'center'}>居中</SelectOption>
                                <SelectOption value={'right'}>居右</SelectOption>
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
                                        value={`${config.x}`}
                                        defaultValue={`${config.x}`}
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>): void => {
                                                setConfig({
                                                    ...config,
                                                    x: Number(e.target.value)
                                                });
                                            }
                                        }
                                    />
                                </Col>
                                <Col span={colspan}>
                                    <Input
                                        prepend={<div>Y</div>}
                                        value={`${config.y}`}
                                        defaultValue={`${config.y}`}
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>): void => {
                                                setConfig({
                                                    ...config,
                                                    y: Number(e.target.value)
                                                });
                                            }
                                        }
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
                                        value={`${config.height}`}
                                        defaultValue={`${config.height}`}
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>): void => {
                                                setConfig({
                                                    ...config,
                                                    height: Number(e.target.value)
                                                });
                                            }
                                        }
                                    />
                                </Col>
                                <Col span={colspan}>
                                    <Input
                                        prepend={<div>W</div>}
                                        value={`${config.width}`}
                                        defaultValue={`${config.width}`}
                                        onChange={
                                            (e: React.ChangeEvent<HTMLInputElement>): void => {
                                                setConfig({
                                                    ...config,
                                                    width: Number(e.target.value)
                                                });
                                            }
                                        }
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className={'config-line dark-mode'}></div>
        </div>
    );
};

export default TextConfig;
