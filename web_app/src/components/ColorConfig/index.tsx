import React, {useEffect, useState} from "react";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {Grid, Select} from "@hi-ui/hiui";
import SelectTheme from "./SelectTheme";
import BackgroundConfig from "../BackgroundConfig";
import {RootState} from "../../lib/Store";
import {ReactState} from "../../types/ReactTypes";
import YExtendTemplate from "../YExtendTemplate";
import GradientColorPicker from "./GradientColorPicker";
import SingleColorPicker from "./SingleColorPicker";
import {setCurrentTemplateThemeConfig} from "../../lib/Store/AppStore";
import PostMessage from "../../lib/PostMessage";
import {useTranslation} from "react-i18next";

interface IThemeConfigItem {
    title: string;
    id: string;
    disabled: boolean;
}

function ColorConfig(): React.JSX.Element {
    const configTheme: {
        configs: Array<string>;
        type: string;
        value: Array<string>;
    } = useSelector((state: RootState) => state.app.currentTemplateConfig.config.theme);
    const [themeConfigs, setThemeConfigs]: ReactState<Array<IThemeConfigItem>> = useState<Array<IThemeConfigItem>>([]);
    const [themeType, setThemeType]: ReactState<string> = useState<string>('');
    const currentTemplateConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.theme);
    const dispatch: Dispatch = useDispatch();
    const {t} = useTranslation();

    const setStore = (data: object = {}): void => {
        dispatch(setCurrentTemplateThemeConfig({
            ...currentTemplateConfig,
            ...data
        }));
    };
    const getDefaultColor = (): Array<string> => {
        const {type, value} = currentTemplateConfig;

        if (type === 'Gradient' && value.length > 1)
            return [value[0], value[value.length - 1]];

        if (type === 'Single')
            return [value[0]];

        return value;
    };
    const sendMessage = (): void => {
        PostMessage.send({
            type: 'SET_THEME_COLOR',
            message: {
                type: themeType,
                value: currentTemplateConfig.value
            }
        });
    };

    useEffect((): void => {
        sendMessage();
    }, [currentTemplateConfig]);

    useEffect((): void => {
        setThemeConfigs([
            {title: t('themeColor'), id: 'Theme', disabled: !configTheme.configs.includes('Theme')},
            {title: t('gradientColor'), id: 'Gradient', disabled: !configTheme.configs.includes('Gradient')},
            {title: t('singleColor'), id: 'Single', disabled: !configTheme.configs.includes('Single')}
        ]);

        setThemeType(configTheme.type);
    }, [configTheme]);

    return (
        <div className={'color-config app_none_user_select'}>
            <div className={'color-config-item'}>
                <Grid.Row style={{
                    width: '100%'
                }} gutter={true} justify={"space-between"}>
                    <Grid.Col span={12}>
                        <div className={'color-config-item-label app_flex_box'}>{t('themeConfig')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={12}>
                        <Grid.Row gutter={true} justify={"space-between"}>
                            <Grid.Col span={24}>
                                <Select
                                    data={themeConfigs}
                                    defaultValue={themeType}
                                    value={themeType}
                                    onChange={(e: React.ReactText | string): void => {
                                        setStore({
                                            type: e as string,
                                            value: getDefaultColor()
                                        });
                                        setThemeType(e as string);
                                    }}
                                />
                            </Grid.Col>
                        </Grid.Row>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <YExtendTemplate show={themeType === 'Theme'}>
                    <SelectTheme onChange={(data: Array<string>): void => {
                        setStore({
                            value: data
                        });
                    }}/>
                </YExtendTemplate>
                <YExtendTemplate show={themeType === 'Gradient'}>
                    <GradientColorPicker
                        value={currentTemplateConfig.value as unknown as [string, string]}
                        onChange={(e: [string, string]): void => {
                            setStore({
                                value: e
                            });
                        }}
                    />
                </YExtendTemplate>
                <YExtendTemplate show={themeType === 'Single'}>
                    <SingleColorPicker
                        value={currentTemplateConfig.value[0]}
                        onChange={(e: string): void => {
                            setStore({
                                value: [e]
                            });
                        }}
                    />
                </YExtendTemplate>
            </div>
            <div className={'config-line '}></div>
            <BackgroundConfig/>
        </div>
    );
}

export default ColorConfig;