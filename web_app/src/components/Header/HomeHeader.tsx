import React from "react";
import AppConfig from "../../config/AppConfig";
import GlobalComponent from "../GlobalComponent";
import {Button} from "@hi-ui/hiui";

const HomeHeader = (): React.JSX.Element => {
    return (
        <div className={'data-visualization-header'}>
            <div className={'data-visualization-header-app-name app_cursor_pointer header-item'}>
                {AppConfig.appName}
            </div>
            <div className={'data-visualization-header-option header-item'}>
                <GlobalComponent.SwitchTheme/>
                <Button type="secondary">日志</Button>
                <Button type="primary">资源库</Button>
            </div>
        </div>
    );
};

export default HomeHeader;