import React, {useRef, useState} from "react";
import TextConfig from "./TextConfig";
import {useTemplateMessageListener} from "../bin/Hooks";
import {ITemplateSelectTextElement} from "../types/TemplateMessage";
import YExtendTemplate from "./YExtendTemplate";
import ColorConfig from "./ColorConfig";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {setCurrentTemplateConfig} from "../lib/Store/AppStore";
import EditDataTable, {IEditDataTable} from "./EditDataTable";
import {Grid} from "@hi-ui/hiui";
import SyntheticConfig from "./SyntheticConfig";
import {ReactState} from "../types/ReactTypes";

export type TOptionType = 'style' | 'config' | 'data';
const DesignConfigs = (): React.JSX.Element => {
    const dispatch: Dispatch = useDispatch();
    const [optionType, setOptionType]: ReactState<TOptionType> = useState<TOptionType>('style');
    const [currentTextConfig, setCurrentTextConfig]: ReactState<null | ITemplateSelectTextElement> = useState<null | ITemplateSelectTextElement>(null);
    const editDataTableRef: React.RefObject<IEditDataTable> = useRef<IEditDataTable>(null);

    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_ELEMENT', (e: ITemplateSelectTextElement): void => {
        setCurrentTextConfig(e);
    });
    useTemplateMessageListener('TEMPLATE_FULL_CONFIG', (e: ITemplateSelectTextElement): void => {
        dispatch(setCurrentTemplateConfig(e));
    });
    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_CLOSE', (): void => {
        setCurrentTextConfig(null);
    });

    const getClassName = (type: TOptionType): string => {
        if (type === optionType)
            return 'design-configs-top-options-item active app_cursor_pointer';

        return 'design-configs-top-options-item app_cursor_pointer';
    };

    return (
        <div className={'design-configs'}>
            <div className={'design-configs-top-options app_flex_box app_none_user_select'}>
                <Grid.Row gutter={30}>
                    <Grid.Col span={8}>
                        <div className={getClassName('style')} onClick={(): void => {
                            setOptionType('style');
                        }}>图表样式
                        </div>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <div className={getClassName('config')} onClick={(): void => {
                            setOptionType('config');
                        }}>合成配置
                        </div>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <div className={getClassName('data')} onClick={(): void => {
                            editDataTableRef.current?.open();
                        }}>编辑数据
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'design-configs-container'}>
                <YExtendTemplate show={optionType === 'style'}>
                    <YExtendTemplate show={currentTextConfig !== null}>
                        <TextConfig config={currentTextConfig}/>
                    </YExtendTemplate>
                    <ColorConfig/>
                </YExtendTemplate>
                <YExtendTemplate show={optionType === 'config'}>
                    <SyntheticConfig/>
                </YExtendTemplate>
                <EditDataTable ref={editDataTableRef}/>
            </div>
        </div>
    );
};

export default DesignConfigs;
