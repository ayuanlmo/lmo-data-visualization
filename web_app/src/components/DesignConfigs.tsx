import React, {useState} from "react";
import TextConfig from "./TextConfig";
import {useTemplateMessageListener} from "../bin/Hooks";
import {ITemplateSelectTextElement} from "../types/TemplateMessage";
import YExtendTemplate from "./YExtendTemplate";
import ColorConfig from "./ColorConfig";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {setCurrentTemplateConfig} from "../lib/Store/AppStore";

const DesignConfigs = (): React.JSX.Element => {
    const dispatch: Dispatch = useDispatch();
    const [currentTextConfig, setCurrentTextConfig]:
        [null | ITemplateSelectTextElement, React.Dispatch<React.SetStateAction<ITemplateSelectTextElement | null>>]
        = useState<null | ITemplateSelectTextElement>(null);

    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_ELEMENT', (e: ITemplateSelectTextElement): void => {
        setCurrentTextConfig(e);
    });
    useTemplateMessageListener('TEMPLATE_FULL_CONFIG', (e: ITemplateSelectTextElement): void => {
        dispatch(setCurrentTemplateConfig(e));
    });
    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_CLOSE', (): void => {
        setCurrentTextConfig(null);
    });

    return (
        <div className={'design-configs'}>
            <div className={'design-configs-top-options'}>

            </div>
            <div className={'design-configs-container'}>
                <YExtendTemplate show={currentTextConfig !== null}>
                    <TextConfig config={currentTextConfig}/>
                </YExtendTemplate>
                <ColorConfig/>
            </div>
        </div>
    );
};

export default DesignConfigs;
