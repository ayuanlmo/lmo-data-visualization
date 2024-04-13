import React, {ReactText, useEffect} from "react";
import Grid from "@hi-ui/grid";
import {Select, SelectOption} from "@hi-ui/hiui";
import ResetButton from "../ResetButton";
import SelectBackground from "../ColorConfig/SelectBackground";
import SelectBackgroundImage from "../ColorConfig/SelectBackgroundImage";
import YExtendTemplate from "../YExtendTemplate";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import {setCurrentTemplateBackground} from '../../lib/Store/AppStore';
import postMessage from "../../lib/PostMessage";
import ColorPicker from "../ColorPicker";

const BackgroundConfig = (): React.JSX.Element => {
    const {Col, Row} = Grid;
    const backgroundConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.background);
    const dispatch = useDispatch();

    useEffect((): void => {
        postMessage.send({
            type: 'SET_BACKGROUND_IMAGE',
            message: backgroundConfig
        });
    }, [backgroundConfig]);

    return (
        <b>
            <div className={'color-config-item'}>
                <Row style={{
                    width: '100%'
                }} gutter={true} justify={"space-between"}>
                    <Col span={8}>
                        <div className={'color-config-item-label app_flex_box'}>背景配置</div>
                    </Col>
                    <Col justify={'flex-end'} span={16}>
                        <Row gutter={true} justify={"space-between"}>
                            <Col span={6}>
                                <ResetButton onClick={(): void => {
                                    dispatch(setCurrentTemplateBackground({
                                        ...backgroundConfig,
                                        type: ''
                                    }));
                                }}/>
                            </Col>
                            <Col span={18}>
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
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <YExtendTemplate show={backgroundConfig.type === 'theme'}>
                    <SelectBackground onSelect={(cssCode: string): void => {
                        dispatch(setCurrentTemplateBackground({
                            ...backgroundConfig,
                            color: cssCode
                        }));
                    }}/>
                </YExtendTemplate>
                <Row style={{
                    width: '100%',
                    display: backgroundConfig.type === 'image' ? 'block' : 'none'
                }}>
                    <Col span={24}>
                        <SelectBackgroundImage onSelect={(path: string): void => {
                            dispatch(setCurrentTemplateBackground({
                                ...backgroundConfig,
                                image: path
                            }));
                        }}/>
                    </Col>
                </Row>
                <YExtendTemplate show={backgroundConfig.type === 'color'}>
                    <Row style={{
                        width: '100%'
                    }}>
                        <Col span={24}>
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
                        </Col>
                    </Row>
                </YExtendTemplate>
            </div>
        </b>
    );
};

export default BackgroundConfig;