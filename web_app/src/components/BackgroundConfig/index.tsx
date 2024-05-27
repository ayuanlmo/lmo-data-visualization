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

const BackgroundConfig = (): React.JSX.Element => {
    const backgroundConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.background);
    const dispatch: Dispatch = useDispatch();

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
                    <Grid.Col span={8}>
                        <div className={'color-config-item-label app_flex_box'}>背景配置</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={16}>
                        <Grid.Row gutter={true} justify={"space-between"}>
                            <Grid.Col span={6}>
                                <ResetButton onClick={(): void => {
                                    dispatch(setCurrentTemplateBackground({
                                        ...backgroundConfig,
                                        type: ''
                                    }));
                                }}/>
                            </Grid.Col>
                            <Grid.Col span={18}>
                                <Select onSelect={(e: ReactText): void => {
                                    dispatch(setCurrentTemplateBackground({
                                        ...backgroundConfig,
                                        type: e
                                    }));
                                }}>
                                    <SelectOption value={'theme'}>颜色渐变</SelectOption>
                                    <SelectOption value={'image'}>图片</SelectOption>
                                    <SelectOption value={'color'}>纯色</SelectOption>
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
                            color: cssCode
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
                                image: path
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
                                        color: value
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