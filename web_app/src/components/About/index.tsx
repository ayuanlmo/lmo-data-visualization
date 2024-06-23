import React, {useImperativeHandle, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Modal, Space} from "@hi-ui/hiui";
import {ReactState} from "../../types/ReactTypes";
import AppConfig from "../../config/AppConfig";
import Github from "./icon/github";
import "./style.scss";
import THTMLTemplate from "../GlobalComponent/components/THTMLTemplate";
import OpenSourceComponentLicense, {IOpenSourceComponentLicenseRef} from "./OpenSourceComponentLicense";

export interface IAboutRef {
    open: () => void;
}

const Index: React.ForwardRefExoticComponent<React.RefAttributes<IAboutRef>> = React.forwardRef((_props: {}, ref: React.ForwardedRef<IAboutRef>) => {
    const [visible, setVisible]: ReactState<boolean> = useState(false);
    const {t} = useTranslation();
    const openSourceComponentLicenseRef = useRef<IOpenSourceComponentLicenseRef>(null);

    const open = (): void => {
        setVisible(!visible);
    };

    useImperativeHandle(ref, (): IAboutRef => ({
        open
    }));

    return (
        <Modal
            title={t('about')}
            visible={visible}
            footer={null}
            width={'800px'}
            height={'600px'}
            onClose={(): void => {
                open();
            }}
            onCancel={(): void => {
                open();
            }}
        >
            <OpenSourceComponentLicense ref={openSourceComponentLicenseRef}/>
            <div className={'lmo-app-about app_none_user_select'}
                 onContextMenu={(e: React.MouseEvent<HTMLDivElement>): void => {
                     e.preventDefault();
                 }}>
                <Space
                    size={12}
                    direction="column"
                >
                    <center className={'app-logo animated fadeInDown'}>
                        <img
                            src="/logo.svg"
                            alt="lmo__app__logo"
                        />
                    </center>
                    <div className={'app-name'}>
                        {AppConfig.appName}
                    </div>
                    <div style={{
                        margin: '1rem'
                    }}>
                        <center>
                            <Button
                                type="secondary"
                                shape="round"
                                onClick={(): void => {
                                    openSourceComponentLicenseRef.current?.open?.();
                                }}
                            >
                                {t('openSourceComponentLicense')}
                            </Button>
                        </center>
                    </div>
                </Space>
                <div style={{
                    marginTop: "6.5rem"
                }}>
                    <Space size={12} direction="column">
                        <div>
                            <center>
                                <div
                                    className={'github-icon app_cursor_pointer'}
                                    onClick={(): void => {
                                        window?.open?.(AppConfig.openSource.github);
                                    }}>
                                    <THTMLTemplate content={Github}/>
                                </div>
                            </center>
                        </div>
                        <div>
                            <a
                                className={'text'}
                                href="https://github.com/ayuanlmo"
                                target="_blank"
                                rel="noreferrer">
                                @ ayuanlmo
                            </a>
                        </div>
                        <div className={'text'}>
                            Designer : @listen_风语
                        </div>
                    </Space>
                </div>
            </div>
        </Modal>
    );
});

Index.displayName = 'Index';

export default Index;

