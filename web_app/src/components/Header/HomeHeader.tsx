import React, {useRef} from "react";
import AppConfig from "../../config/AppConfig";
import GlobalComponent from "../GlobalComponent";
import {Button} from "@hi-ui/hiui";
import SelectFile, {ISelectFileRef} from "../SelectFile";

const HomeHeader = (): React.JSX.Element => {
    const selectFileRef: React.MutableRefObject<null | ISelectFileRef> = useRef<null | ISelectFileRef>(null);

    return (
        <div className={'data-visualization-header'}>
            <div className={'data-visualization-header-app-name app_cursor_pointer header-item'}>
                {AppConfig.appName}
            </div>
            <div className={'data-visualization-header-option header-item'}>
                <GlobalComponent.SwitchTheme/>
                <Button type="secondary">日志</Button>
                <Button type="primary">资源库</Button>
                <Button
                    type="default"
                    onClick={(): void => {
                        selectFileRef.current?.open();
                    }}
                >素材库</Button>
                <SelectFile ref={selectFileRef}/>
            </div>
        </div>
    );
};

export default HomeHeader;