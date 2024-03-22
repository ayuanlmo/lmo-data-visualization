import "./AppHome.scss";
import React from "react";
import AppConfig from "../config/AppConfig";
import {Button} from "@hi-ui/hiui";
import TemplateList from "../components/TemplateList";

const AppHome = (): React.JSX.Element => {
    return (
        <div className={'data-visualization dark-mode app_none_user_select'}>
            <div className={'data-visualization-header dark-mode'}>
                <div className={'data-visualization-header-app-name app_cursor_pointer header-item'}>
                    {AppConfig.appName}
                </div>
                <div className={'data-visualization-header-option header-item'}>
                    <Button type="secondary">日志</Button>
                    <Button type="primary">资源库</Button>
                </div>
            </div>
            <div className={'data-visualization-templates'}>
                <TemplateList/>
            </div>
        </div>
    );
};

export default AppHome;
