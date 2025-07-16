import React from "react";
import {Display, Hide, TextIcon} from "./svg";
import {ITemplateSelectTextElement} from "../../types/TemplateMessage";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setCurrentTemplateTextConfigItem} from "../../lib/Store/AppStore";
import PostMessage from "../../lib/PostMessage";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

interface ITemplateLayersItemProps {
    data: ITemplateSelectTextElement;
    _key: string;
}

const TemplateLayersItem: React.FC<ITemplateLayersItemProps> = React.memo(({data, _key}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch<Dispatch>();

    const handleToggleDisplay = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const updatedData: ITemplateSelectTextElement = {
            ...data,
            display: !data.display ?? true
        };

        PostMessage.send({
            type: 'SET_TEXT_CONFIG',
            message: {
                ...updatedData,
                key: _key
            }
        });

        dispatch(setCurrentTemplateTextConfigItem({
            [_key]: updatedData
        }));
    };

    return (
        <div
            className="template-layers-item app_cursor_pointer"
            onClick={() => {
                PostMessage.send({
                    type: 'SELECT_TEXT',
                    message: {
                        key: _key
                    }
                });
            }}
        >
            <div className="template-layers-item-container">
                <div className="app_none_user_select template-layers-item-content app_flex_box">
                    <div className="app_flex_box">
                        <div className="template-layers-item-icon">
                            <TextIcon/>
                        </div>
                        <div className="template-layers-item-name">
                            {
                                t(`layers.text.${_key}`)
                            }
                        </div>
                    </div>
                    <div
                        onClick={handleToggleDisplay}
                        className="template-layers-item-options"
                    >
                        {data.display ? <Display/> : <Hide/>}
                    </div>
                </div>
            </div>
        </div>
    );
});

TemplateLayersItem.propTypes = {
    data: PropTypes.object.isRequired as PropTypes.Validator<ITemplateSelectTextElement>,
    _key: PropTypes.string.isRequired
};

TemplateLayersItem.displayName = 'TemplateLayersItem';

export default TemplateLayersItem;
