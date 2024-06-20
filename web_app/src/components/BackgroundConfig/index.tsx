import React, {ReactText, useEffect} from "react";
import {Grid, Select, SelectOption} from "@hi-ui/hiui";
import ResetButton from "../ResetButton";
import SelectBackground from "../ColorConfig/SelectBackground";
import SelectBackgroundImage from "../ColorConfig/SelectBackgroundImage";
import YExtendTemplate from "../YExtendTemplate";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import {setCurrentTemplateBackground} from '../../lib/Store/AppStore';
import postMessage from "../../lib/PostMessage";
import ColorPicker from "../ColorPicker";
import {Dispatch} from "@reduxjs/toolkit";
import GlobalComponent from "../GlobalComponent";
import {useTranslation} from "react-i18next";

const BackgroundConfig = (): React.JSX.Element => {
    const backgroundConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.background);
    const dispatch: Dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect((): void => {
        postMessage.send({
            type: 'SET_BACKGROUND_IMAGE',
            message: backgroundConfig
        });
    }, [backgroundConfig]);

    return (
        <b>
            <div className={'color-config-item'}>
                <Grid.Row style={{
                    width: '100%'
                }} gutter={true} justify={"space-between"}>
                    <Grid.Col span={11}>
                        <div className={'color-config-item-label app_flex_box'}>{t('backgroundConfig')}</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={13}>
                        <Grid.Row gutter={true} justify={"space-between"} style={{
                            width: '100%',
                            justifyContent: 'end'
                        }}>
                            <YExtendTemplate show={false}>
                                <Grid.Col span={12}>
                                    <ResetButton onClick={(): void => {
                                        dispatch(setCurrentTemplateBackground({
                                            ...backgroundConfig,
                                            type: ''
                                        }));
                                    }}/>
                                </Grid.Col>
                            </YExtendTemplate>
                            <Grid.Col
                                span={18}
                                style={{
                                    width: '100%'
                                }}
                            >
                                <Select
                                    placeholder={t('pleaseSelect')}
                                    onSelect={(e: ReactText): void => {
                                        dispatch(setCurrentTemplateBackground({
                                            ...backgroundConfig,
                                            type: e
                                        }));
                                    }}>
                                    <SelectOption value={'theme'}>{t('gradientColor')}</SelectOption>
                                    <SelectOption value={'image'}>{t('image')}</SelectOption>
                                    <SelectOption value={'color'}>{t('singleColor')}</SelectOption>
                                </Select>
                            </Grid.Col>
                        </Grid.Row>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <GlobalComponent.TDisplayTemplate show={backgroundConfig.type === 'theme'} style={{width: '100%'}}>
                    <SelectBackground onSelect={(cssCode: string): void => {
                        dispatch(setCurrentTemplateBackground({
                            ...backgroundConfig,
                            color: cssCode,
                            type: 'theme'
                        }));
                    }}/>
                </GlobalComponent.TDisplayTemplate>
                <Grid.Row style={{
                    width: '100%',
                    display: backgroundConfig.type === 'image' ? 'block' : 'none'
                }}>
                    <Grid.Col span={24}>
                        <SelectBackgroundImage onSelect={(path: string): void => {
                            dispatch(setCurrentTemplateBackground({
                                ...backgroundConfig,
                                image: path,
                                type: 'image'
                            }));
                        }}/>
                    </Grid.Col>
                </Grid.Row>
                <YExtendTemplate show={backgroundConfig.type === 'color'}>
                    <Grid.Row style={{
                        width: '100%'
                    }}>
                        <Grid.Col span={24}>
                            <ColorPicker
                                onChange={(value: string): void => {
                                    dispatch(setCurrentTemplateBackground({
                                        ...backgroundConfig,
                                        color: value,
                                        type: 'color'
                                    }));
                                }}
                                style={{
                                    width: '100%',
                                    height: '3rem'
                                }}
                                value={backgroundConfig.color}
                            />
                        </Grid.Col>
                    </Grid.Row>
                </YExtendTemplate>
            </div>
            <div className={'config-line '}/>
        </b>
    );
};

export default BackgroundConfig;