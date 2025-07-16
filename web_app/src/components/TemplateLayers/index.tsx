import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import {ITemplateSelectTextElement} from "../../types/TemplateMessage";
import TemplateLayersItem from "./TemplateLayersItem";
import {Loading} from "@hi-ui/hiui";
import {useTranslation} from "react-i18next";

type TextLayerKeys = "mainTitle" | "subTitle" | "fromSource";

const TemplateLayers: React.FC = () => {
    const {t} = useTranslation();
    const data = useSelector((state: RootState) => state.app.currentTemplateConfig.config.text) as Record<TextLayerKeys, ITemplateSelectTextElement>;
    const keys: TextLayerKeys[] = ["mainTitle", "subTitle", "fromSource"];
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (keys.every(key => data[key]))
            setIsLoading(false);
    }, [data, keys]);

    return (
        <div className="template-layers">
            <div className="template-layers-title app_none_user_select">{t('layers.label')}</div>
            <Loading visible={isLoading}>
                {isLoading ? null : keys.map(key =>
                    <TemplateLayersItem
                        key={key}
                        data={data[key]}
                        _key={key}
                    />
                )}
            </Loading>
        </div>
    );
};

export default TemplateLayers;
