import React, {useImperativeHandle, useState} from "react";
import {useTranslation} from "react-i18next";
import {Modal, TextArea} from "@hi-ui/hiui";
import {ReactState} from "../../../types/ReactTypes";
import Content from "./content";

export interface IOpenSourceComponentLicenseRef {
    open: () => void;
}

const OpenSourceComponentLicense: React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<IOpenSourceComponentLicenseRef>> = React.forwardRef((_props, ref: React.ForwardedRef<IOpenSourceComponentLicenseRef>) => {
    const [visible, setVisible]: ReactState<boolean> = useState(false);
    const {t} = useTranslation();

    const open = (): void => {
        setVisible(!visible);
    };

    useImperativeHandle(ref, (): IOpenSourceComponentLicenseRef => ({
        open
    }));

    return (
        <Modal
            visible={visible}
            footer={null}
            height={700}
            width={700}
            title={t('openSourceComponentLicense')}
            onClose={(): void => {
                open();
            }}
            onCancel={(): void => {
                open();
            }}
        >
            <div>
                <TextArea
                    disabled={true}
                    autoSize={true}
                    defaultValue={Content}
                />
            </div>
        </Modal>
    );
});

OpenSourceComponentLicense.displayName = 'OpenSourceComponentLicense';

export default OpenSourceComponentLicense;