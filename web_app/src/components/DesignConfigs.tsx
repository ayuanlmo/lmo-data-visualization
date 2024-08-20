import React, {useEffect, useRef, useState} from "react";
import TextConfig from "./TextConfig";
import {Hooks, useTemplateMessageListener} from "../bin/Hooks";
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
import GlobalComponent from "./GlobalComponent";
import TemplateOtherConfig from "./TemplateOtherConfig";
import {useTranslation} from "react-i18next";
import useEventListener = Hooks.useEventListener;

export type TOptionType = 'style' | 'config' | 'data';

const DesignConfigs = (): React.JSX.Element => {
    const dispatch: Dispatch = useDispatch();
    const [optionType, setOptionType]: ReactState<TOptionType> = useState<TOptionType>('style');
    const [currentTextConfig, setCurrentTextConfig]: ReactState<null | ITemplateSelectTextElement> = useState<null | ITemplateSelectTextElement>(null);
    const editDataTableRef: React.RefObject<IEditDataTable> = useRef<IEditDataTable>(null);
    const designConfigsElRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const [designConfigsElStyle, setDesignConfigsElStyle]: ReactState<React.CSSProperties> = useState<React.CSSProperties>({});
    const {t} = useTranslation();

    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_ELEMENT', (e: ITemplateSelectTextElement): void => {
        setCurrentTextConfig(e);
    });
    useTemplateMessageListener('TEMPLATE_FULL_CONFIG', (e: ITemplateSelectTextElement): void => {
        dispatch(setCurrentTemplateConfig(e));
    });
    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_CLOSE', (): void => {
        setCurrentTextConfig(null);
    });
    useEventListener('resize', (): void => {
        setDesignConfigsElStyle({});
    });
    useEffect((): void => {
        if (!('width' in designConfigsElStyle))
            changeElSize();
    }, [designConfigsElStyle]);
    useEffect((): void => {
        changeElSize();
    }, []);

    const changeElSize = (): void => {
        if (designConfigsElRef.current) {
            const {offsetWidth, offsetHeight} = designConfigsElRef.current;

            setDesignConfigsElStyle({
                width: `${offsetWidth}px`,
                height: `${offsetHeight}px`,
                overflowY: 'scroll'
            });
        }
    };

    const getClassName = (type: TOptionType): string => {
        if (type === optionType)
            return 'design-configs-top-options-item active app_cursor_pointer';

        return 'design-configs-top-options-item app_cursor_pointer';
    };

    return (
        <div className={'design-configs'} ref={designConfigsElRef} style={designConfigsElStyle}>
            <div className={'design-configs-top-options app_flex_box app_none_user_select'}>
                <Grid.Row
                    gutter={12}
                    style={{
                        width: '100%'
                    }}
                >
                    <Grid.Col span={8}>
                        <div className={getClassName('style')} onClick={(): void => {
                            setOptionType('style');
                        }}>
                            {t('chartStyle')}
                        </div>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <div className={getClassName('config')} onClick={(): void => {
                            setOptionType('config');
                        }}>
                            {t('synthesisConfig')}
                        </div>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <div className={getClassName('data')} onClick={(): void => {
                            editDataTableRef.current?.open();
                        }}>
                            {t('editData')}
                        </div>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'design-configs-container'}>
                <div>
                    <YExtendTemplate show={currentTextConfig !== null && optionType === 'style'}>
                        <TextConfig config={currentTextConfig}/>
                    </YExtendTemplate>
                    <GlobalComponent.TDisplayTemplate show={optionType === 'style'}>
                        <ColorConfig/>
                    </GlobalComponent.TDisplayTemplate>
                    <GlobalComponent.TDisplayTemplate show={optionType === 'style'}>
                        <TemplateOtherConfig/>
                    </GlobalComponent.TDisplayTemplate>
                    <GlobalComponent.TDisplayTemplate show={optionType === 'config'}>
                        <SyntheticConfig/>
                    </GlobalComponent.TDisplayTemplate>
                    <EditDataTable ref={editDataTableRef}/>
                </div>
            </div>
        </div>
    );
};

export default DesignConfigs;
