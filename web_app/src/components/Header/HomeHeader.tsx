import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import AppConfig from "../../config/AppConfig";
import GlobalComponent from "../GlobalComponent";
import {Button} from "@hi-ui/hiui";
import SelectFile, {ISelectFileRef} from "../SelectFile";
import SwitchLang from "../GlobalComponent/components/SwitchLang";
import YExtendTemplate from "../YExtendTemplate";
import Resources, {IResourcesRef} from "../Resources";
import About, {IAboutRef} from "../About";

const HomeHeader = (): React.JSX.Element => {
    const selectFileRef: React.MutableRefObject<null | ISelectFileRef> = useRef<null | ISelectFileRef>(null);
    const resourcesRef: React.MutableRefObject<null | IResourcesRef> = useRef<null | IResourcesRef>(null);
    const aboutRef: React.MutableRefObject<null | IAboutRef> = useRef<null | IAboutRef>(null);
    const {t} = useTranslation();

    return (
        <div className={'data-visualization-header'}>
            <div
                className={'data-visualization-header-app-name app_cursor_pointer header-item'}
                onClick={(): void => {
                    aboutRef.current?.open?.();
                }}
            >
                {AppConfig.appName}
            </div>
            <About ref={aboutRef}/>
            <div
                className={'data-visualization-header-option header-item'}
                style={{
                    marginTop: '1.3rem'
                }}
            >
                <GlobalComponent.SwitchTheme style={{
                    marginTop: '0'
                }}/>
                <YExtendTemplate show={false}>
                    <Button size={'sm'} type="secondary">{t('log')}</Button>
                </YExtendTemplate>
                <Button
                    size={'sm'}
                    type="primary"
                    onClick={(): void => {
                        resourcesRef.current?.open();
                    }}
                >
                    {t('resLib')}
                </Button>
                <Button
                    size={'sm'}
                    type="default"
                    onClick={(): void => {
                        selectFileRef.current?.open();
                    }}
                >{t('materialLib')}</Button>
                <SwitchLang/>
                <Resources ref={resourcesRef}/>
                <SelectFile isUse={false} ref={selectFileRef}/>
            </div>
        </div>
    );
};

export default HomeHeader;