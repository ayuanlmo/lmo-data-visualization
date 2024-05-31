import React, {useEffect, useState} from 'react';
import {Grid, GridResponsiveSize, Input, NumberInput, Select, SelectOption, Switch} from "@hi-ui/hiui";
import {ITemplateSelectTextElement, TTemplateTextConfigAlignType} from "../../types/TemplateMessage";
import PostMessage from "../../lib/PostMessage";
import ColorPicker from "../ColorPicker";
import {ReactState} from "../../types/ReactTypes";
import {useTranslation} from "react-i18next";

export interface ITextConfigProps {
    config: null | ITemplateSelectTextElement
}

const TextConfig = (props: ITextConfigProps): React.JSX.Element => {
    const colspan: GridResponsiveSize<number> = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};
    const [config, setConfig]: ReactState<ITemplateSelectTextElement> = useState<ITemplateSelectTextElement>(props.config as ITemplateSelectTextElement);
    const {t} = useTranslation();

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
            <div className={'text-config-title app_flex_box'}>{t('textConfig')}</div>
            <div className={'text-config-item app_flex_box'}>
                <Grid.Row gutter={true} justify={"space-between"}>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('display')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
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
                    </Grid.Col>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('textContent')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
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
                    </Grid.Col>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('fontSize')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
                        <NumberInput
                            value={config.fontSize}
                            onChange={(value: number | null): void => {
                                return setConfig({
                                    ...config,
                                    fontSize: Number(value ?? 0)
                                });
                            }}
                        />
                    </Grid.Col>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('fontColor')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
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
                    </Grid.Col>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('textAlign')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
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
                                <SelectOption value={'left'}>{t('textAlignLeft')}</SelectOption>
                                <SelectOption value={'center'}>{t('textAlignCenter')}</SelectOption>
                                <SelectOption value={'right'}>{t('textAlignRight')}</SelectOption>
                            </Select>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('textPosition')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
                        <div className={'text-config-item-flex-box app_flex_box'}>
                            <Grid.Row gutter={true} justify={'space-between'}>
                                <Grid.Col span={colspan}>
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
                                </Grid.Col>
                                <Grid.Col span={colspan}>
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
                                </Grid.Col>
                            </Grid.Row>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={colspan}>
                        <div className={'text-config-item-label'}>{t('size')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={colspan}>
                        <div className={'text-config-item-flex-box app_flex_box'}>
                            <Grid.Row gutter={true} justify={'space-between'}>
                                <Grid.Col span={colspan}>
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
                                </Grid.Col>
                                <Grid.Col span={colspan}>
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
                                </Grid.Col>
                            </Grid.Row>
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'config-line '}></div>
        </div>
    );
};

export default TextConfig;
