import React, {useEffect, useState} from 'react';
import {Grid, Input, NumberInput, Select, SelectOption, Switch} from "@hi-ui/hiui";
import {ITemplateSelectTextElement, TTemplateTextConfigAlignType} from "../../types/TemplateMessage";
import PostMessage from "../../lib/PostMessage";
import ColorPicker from "../ColorPicker";
import {useTranslation} from "react-i18next";

export interface ITextConfigProps {
    config: ITemplateSelectTextElement | null;
}

const updateConfig = (setConfigFunc: React.Dispatch<React.SetStateAction<ITemplateSelectTextElement>>, updates: Partial<ITemplateSelectTextElement>) => {
    setConfigFunc((prev) => ({...prev, ...updates}));
};

const TextConfig: React.FC<ITextConfigProps> = ({config}) => {
    const [localConfig, setLocalConfig] = useState<ITemplateSelectTextElement>(config as ITemplateSelectTextElement);
    const {t} = useTranslation();

    useEffect(() => {
        if (config !== localConfig) setLocalConfig(config as ITemplateSelectTextElement);
    }, [config]);

    useEffect(() => {
        PostMessage.send({type: "SET_TEXT_CONFIG", message: {...localConfig}});
    }, [localConfig]);

    return (
        <div className='text-config app_none_user_select'>
            <div className='text-config-title app_flex_box'>{t('textConfig')}</div>
            {
                Object.entries({
                    display: {
                        label: t('display'),
                        component: () => <Switch
                            checked={localConfig.display}
                            onChange={
                                (e) => updateConfig(setLocalConfig, {display: e})
                            }
                        />
                    },
                    value: {
                        label: t('textContent'),
                        component: () => <Input
                            value={localConfig.value}
                            onChange={
                                ({target}) => updateConfig(setLocalConfig, {value: target.value})
                            }
                        />
                    },
                    fontSize: {
                        label: t('fontSize'),
                        component: () => <NumberInput
                            value={localConfig.fontSize}
                            onChange={
                                (value) => updateConfig(setLocalConfig, {fontSize: Number(value ?? 0)})
                            }
                        />
                    },
                    color: {
                        label: t('fontColor'),
                        component: () => <ColorPicker
                            value={localConfig.color}
                            onChange={
                                (value) => updateConfig(setLocalConfig, {color: value})
                            }
                        />
                    },
                    align: {
                        label: t('textAlign'), component: () =>
                            <Select
                                value={localConfig.align}
                                onChange={
                                    (val) => updateConfig(setLocalConfig, {align: val as TTemplateTextConfigAlignType})
                                }
                            >
                                <SelectOption value='left'>{t('textAlignLeft')}</SelectOption>
                                <SelectOption value='center'>{t('textAlignCenter')}</SelectOption>
                                <SelectOption value='right'>{t('textAlignRight')}</SelectOption>
                            </Select>
                    },
                    x: {
                        label: `${t('textPosition')} X`,
                        component: () =>
                            <Input
                                prepend={<div>X</div>}
                                value={`${localConfig.x}`}
                                onChange={(e) => updateConfig(setLocalConfig, {x: Number(e.target.value)})
                                }
                            />
                    },
                    y: {
                        label: `${t('textPosition')} Y`,
                        component: () =>
                            <Input
                                prepend={<div>Y</div>}
                                value={`${localConfig.y}`}
                                onChange={
                                    ({target}) => updateConfig(setLocalConfig, {y: Number(target.value)})
                                }
                            />
                    },
                    height: {
                        label: `${t('size')} H`,
                        component: () =>
                            <Input
                                prepend={
                                    <div>H</div>
                                }
                                value={`${localConfig.height}`}
                                onChange={
                                    (e) => updateConfig(setLocalConfig, {height: Number(e.target.value)})
                                }
                            />
                    },
                    width: {
                        label: `${t('size')} W`,
                        component: () =>
                            <Input
                                prepend={<div>W</div>}
                                value={`${localConfig.width}`}
                                onChange={
                                    (e) => updateConfig(setLocalConfig, {width: Number(e.target.value)})
                                }
                            />
                    }
                }).map(([key, {label, component}]) =>
                    <div
                        className={'text-config-item'}
                        key={key}
                    >
                        <Grid.Row
                            gutter={true}
                            justify="space-between"
                        >
                            <Grid.Col span={{lg: 12, xl: 12, md: 12, sm: 12, xs: 12}}>
                                <div className='text-config-item-label'>{label}</div>
                            </Grid.Col>
                            <Grid.Col
                                justify={'flex-end'}
                                span={{lg: 12, xl: 12, md: 12, sm: 12, xs: 12}}
                            >
                                <div>{component()}</div>
                            </Grid.Col>
                        </Grid.Row>
                    </div>
                )
            }
        </div>
    );
};

export default TextConfig;
