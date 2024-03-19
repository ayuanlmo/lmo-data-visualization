import React, {useState} from "react";
import TextConfig from "./TextConfig";
import {useTemplateMessageListener} from "../bin/Hooks";
import {ITemplateSelectTextElement} from "../types/TemplateMessage";
import YExtendTemplate from "./YExtendTemplate";

function DesignConfigs(): React.JSX.Element {
    const [currentTextConfig, setCurrentTextConfig] = useState<null | ITemplateSelectTextElement>(null);

    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_ELEMENT', (e: ITemplateSelectTextElement): void => {
        setCurrentTextConfig(e);
    });
    useTemplateMessageListener('TEMPLATE_SELECT_TEXT_CLOSE', (): void => {
        setCurrentTextConfig(null);
    });

    return (
        <div className={'design-configs dark-mode'}>
            <div className={'design-configs-top-options dark-mode'}>

            </div>
            <div className={'design-configs-container'}>
                <YExtendTemplate show={currentTextConfig !== null}>
                    <TextConfig config={currentTextConfig}/>
                </YExtendTemplate>
            </div>
        </div>
    );
}

export default DesignConfigs;
