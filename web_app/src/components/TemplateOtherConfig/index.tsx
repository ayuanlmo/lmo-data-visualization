import {Grid, GridResponsiveSize, Input, NumberInput, Radio, Select, SelectOption, Switch} from "@hi-ui/hiui";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import YExtendTemplate from "../YExtendTemplate";
import {ReactState} from "../../types/ReactTypes";
import PostMessage from "../../lib/PostMessage";
import {Dispatch} from "@reduxjs/toolkit";
import {setCurrentTemplateOtherConfigValues} from "../../lib/Store/AppStore";

interface IConfigTypes {
    label: string;
    value: number | string | boolean;
    key: string;
    type: 'switch' | 'input' | 'input-number' | 'select' | 'radio';
    options: {
        label: string;
        value: string;
    }[];
}

interface ITemplateOtherConfig {
    configs: IConfigTypes[];
    label?: string;
    values: {
        [key: string]: number | string | boolean;
    }
}

const TemplateOtherConfig = (): React.JSX.Element => {
    const colspan: GridResponsiveSize<number> = {lg: 12, xl: 12, md: 12, sm: 12, xs: 12};
    const currentTemplateOtherConfig: ITemplateOtherConfig | null = useSelector((state: RootState) => state.app.currentTemplateConfig.otherConfig) as ITemplateOtherConfig | null;
    const [values, setValues]: ReactState<object> = useState({});
    const dispatch: Dispatch = useDispatch();

    useEffect((): void => {
        if (currentTemplateOtherConfig && Array.isArray(currentTemplateOtherConfig.configs))
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
            <React.Fragment key={key}>
                <Grid.Col span={colspan}>
                    <div className={'text-config-item-label'}>{item.label}</div>
                </Grid.Col>
                <Grid.Col justify={'flex-end'} span={colspan}>
                    <YExtendTemplate show={item.type === 'switch'}>
                        <Switch
                            defaultChecked={item.value as boolean}
                            onChange={(e: boolean): void => {
                                setValues({
                                    ...values,
                                    [item.key]: e
                                });
                            }}
                        />
                    </YExtendTemplate>
                    <YExtendTemplate show={item.type === 'select'}>
                        <Select
                            defaultValue={item.value as string}
                            onChange={(e: React.ReactText | string): void => {
                                setValues({
                                    ...values,
                                    [item.key]: e
                                });
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
                                setValues({
                                    ...values,
                                    [item.key]: e.target.value
                                });
                            }}
                        />
                    </YExtendTemplate>
                    <YExtendTemplate show={item.type === 'input-number'}>
                        <NumberInput
                            defaultValue={item.value as number}
                            onChange={(e: number | null): void => {
                                setValues({
                                    ...values,
                                    [item.key]: e ?? 0
                                });
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
                                setValues({
                                    ...values,
                                    [item.key]: e
                                });
                            }}
                        />
                    </YExtendTemplate>
                </Grid.Col>
            </React.Fragment>
        );
    };

    if (currentTemplateOtherConfig)
        return (
            <div className={'text-config app_none_user_select'}>
                <div className={'text-config-title app_flex_box'}>{currentTemplateOtherConfig.label || '其他配置'}</div>
                <div className={'text-config-item app_flex_box'}>
                    <Grid.Row gutter={true} justify={"space-between"}>
                        {
                            Array.isArray(currentTemplateOtherConfig.configs) ?
                                currentTemplateOtherConfig.configs.map((i: IConfigTypes, k: number) => {
                                    return getTemplate(i, k);
                                }) : <></>
                        }
                    </Grid.Row>
                </div>
            </div>
        );
    return <></>;
};

export default TemplateOtherConfig;