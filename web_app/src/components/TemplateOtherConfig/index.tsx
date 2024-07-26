import {Grid, GridResponsiveSize, Input, NumberInput, Radio, Select, SelectOption, Switch} from "@hi-ui/hiui";
import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import YExtendTemplate from "../YExtendTemplate";
import {ReactState} from "../../types/ReactTypes";
import PostMessage from "../../lib/PostMessage";
import {Dispatch} from "@reduxjs/toolkit";
import {setCurrentTemplateOtherConfigValues} from "../../lib/Store/AppStore";
import ColorPicker from "../ColorPicker";

interface IConfigTypes {
    label: string;
    value: number | string | boolean;
    key: string;
    type: 'switch' | 'input' | 'input-number' | 'select' | 'radio' | 'color';
    options: {
        label: string;
        value: string;
    }[];
}

type TTemplateOtherConfigGroupItem = {
    label: string;
    configs: IConfigTypes[];
}

interface ITemplateOtherConfig {
    configs?: IConfigTypes[];
    group?: Array<TTemplateOtherConfigGroupItem>
    label?: string;
    values: {
        [key: string]: number | string | boolean;
    }
}

const TemplateOtherConfig = (): React.JSX.Element => {
    const colspan: GridResponsiveSize<number> = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};
    const currentTemplateOtherConfig: ITemplateOtherConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.otherConfig) as ITemplateOtherConfig;
    const [values, setValues]: ReactState<object> = useState({});
    const dispatch: Dispatch = useDispatch();

    const setValue = (key: string, value: string | number | boolean): void => {
        setValues({
            ...values,
            [key]: value
        });
    };

    useEffect((): void => {
        if (!currentTemplateOtherConfig) return;
        if (Array.isArray(currentTemplateOtherConfig.configs) || Array.isArray(currentTemplateOtherConfig?.group))
            setValues(currentTemplateOtherConfig.values);
    }, []);

    useEffect((): void => {
        dispatch(setCurrentTemplateOtherConfigValues({
            ...values
        }));
        PostMessage.send({
            type: 'SET_OTHER_CONFIG',
            message: values
        });
    }, [values]);

    const getTemplate = (item: IConfigTypes, key: number) => {
        return (
            <Fragment key={key}>
                <Grid.Col span={colspan}>
                    <div className={'text-config-item-label'}>{item.label}</div>
                </Grid.Col>
                <Grid.Col justify={'flex-end'} span={colspan}>
                    <YExtendTemplate show={item.type === 'switch'}>
                        <Switch
                            defaultChecked={item.value as boolean}
                            onChange={(e: boolean): void => {
                                setValue(item.key, e);
                            }}
                        />
                    </YExtendTemplate>
                    <YExtendTemplate show={item.type === 'select'}>
                        <Select
                            defaultValue={item.value as string}
                            onChange={(e: React.ReactText | string): void => {
                                setValue(item.key, e);
                            }}
                        >
                            {
                                Array.isArray(item.options) ? item.options.map((i): React.JSX.Element => {
                                    return <SelectOption key={i.value} value={i.value}>{i.label}</SelectOption>;
                                }) : <></>
                            }
                        </Select>
                    </YExtendTemplate>
                    <YExtendTemplate show={item.type === 'input'}>
                        <Input
                            trimValueOnBlur={true}
                            defaultValue={item.value as string}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                setValue(item.key, e.target.value as string);
                            }}
                        />
                    </YExtendTemplate>
                    <YExtendTemplate show={item.type === 'input-number'}>
                        <NumberInput
                            defaultValue={item.value as number}
                            onChange={(e: number | null): void => {
                                setValue(item.key, e ?? 0 as number);
                            }}
                        />
                    </YExtendTemplate>
                    <YExtendTemplate show={item.type === 'radio'}>
                        <Radio.Group
                            type={"button"}
                            autoWidth={true}
                            defaultValue={item.value as string}
                            data={
                                Array.isArray(item.options) ?
                                    item.options.map(i => {
                                        return {
                                            id: i.value,
                                            title: i.label
                                        };
                                    }) : []
                            }
                            onChange={(e: React.ReactText | string): void => {
                                setValue(item.key, e);
                            }}
                        />
                    </YExtendTemplate>
                    <YExtendTemplate show={item.type === 'color'}>
                        <ColorPicker
                            value={item.value as string}
                            onChange={(e: string): void => {
                                setValue(item.key, e);
                            }}
                        />
                    </YExtendTemplate>
                </Grid.Col>
            </Fragment>
        );
    };

    if (currentTemplateOtherConfig)
        return (
            <div className="text-config app_none_user_select">
                {currentTemplateOtherConfig.configs && currentTemplateOtherConfig.configs.length > 0 ?
                    <>
                        <div className="text-config-title app_flex_box">
                            {currentTemplateOtherConfig.label || '其他配置'}
                        </div>
                        <div className="text-config-item app_flex_box">
                            <Grid.Row gutter={true} justify="space-between" style={{width: '100%'}}>
                                {
                                    currentTemplateOtherConfig.configs.map((config: IConfigTypes, index: number) => {
                                        return <Fragment key={index}>
                                            {
                                                getTemplate(config, index)
                                            }
                                        </Fragment>;
                                    })
                                }
                            </Grid.Row>
                        </div>
                    </>
                    :
                    currentTemplateOtherConfig.group?.map((groupItem: TTemplateOtherConfigGroupItem, groupIndex: number) => {
                        return <Fragment key={groupIndex}>
                            <div className="text-config-title app_flex_box">{groupItem.label}</div>
                            <div className="text-config-item app_flex_box">
                                <Grid.Row gutter={true} justify="space-between" style={{width: '100%'}}>
                                    {
                                        groupItem.configs.map((config: IConfigTypes, configIndex: number) => {
                                                return <Fragment key={configIndex}>
                                                    {
                                                        getTemplate(config, configIndex)
                                                    }
                                                </Fragment>;
                                            }
                                        )
                                    }
                                </Grid.Row>
                            </div>
                        </Fragment>;
                    })
                }
            </div>
        );
    return <></>;
};

export default TemplateOtherConfig;
