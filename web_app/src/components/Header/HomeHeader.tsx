import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import AppConfig from "../../config/AppConfig";
import GlobalComponent from "../GlobalComponent";
import {Button, Grid} from "@hi-ui/hiui";
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
            <Grid.Row style={{
                width: '100%'
            }} justify={'space-between'}>
                <Grid.Col span={
                    {lg: 8, xl: 8, md: 12, sm: 12, xs: 12}
                }>
                    <React.Fragment>
                        <div className={'data-visualization-header-app-name'}>
                            <span
                                className={'app_cursor_pointer'}
                                onClick={(): void => {
                                    aboutRef.current?.open?.();
                                }}
                            >
                                {AppConfig.appName}
                            </span>
                        </div>
                        <About ref={aboutRef}/>
                    </React.Fragment>
                </Grid.Col>
                <Grid.Col span={
                    {lg: 12, xl: 8, md: 12, sm: 12, xs: 12}
                }>
                    <div
                        className={'data-visualization-header-option'}
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
                </Grid.Col>
            </Grid.Row>
        </div>
    );
};

export default HomeHeader;
