import React, {useEffect, useId, useState} from "react";
import {Button, Card, Descriptions, Modal, Space, Tag} from "@hi-ui/hiui";
import Request from "../lib/Request";
import {useTranslation} from "react-i18next";
import * as Icons from "@hi-ui/icons";

export interface IServerInfo {
    main: {
        memory: {
            rss: number;
            heapTotal: number;
            heapUsed: number;
            external: number;
            arrayBuffers: number;
        };
        upTime: {
            days: number;
            hours: number;
            minutes: number;
            seconds: number;
        };
        synthesisServicesConnectStatus: boolean;
    };
    rtVersion: {
        node: string;
        v8: string;
    }
}

const ServerInfo = (): React.JSX.Element => {
    const [serverInfo, setServerInfo] = useState<IServerInfo | null>(null);
    const [visible, setVisible] = useState(false);
    const {t} = useTranslation();
    const key: string = useId();

    useEffect(() => {
        if (!visible) return;
        Request.getServerInfo().then(({data}) => setServerInfo(data as IServerInfo));
    }, [visible]);

    const renderTag = (isConnected: boolean): React.JSX.Element =>
        <Tag size={'sm'} type={isConnected ? 'success' : 'danger'} appearance="solid">
            {t(isConnected ? 'connected' : 'notConnected')}
        </Tag>;

    const open = (): void => setVisible(!visible);

    return (
        <div className={'welcome-page-right-button app_position_absolute app_cursor_pointer'}>
            <Icons.GlobalOutlined onClick={(): void => open()}/>
            <Modal
                title={t('serverInfo')}
                visible={visible}
                key={key}
                height={'618px'}
                onClose={
                    (): void => open()
                }
                footer={[
                    <Button
                        type={'primary'}
                        key={key}
                        onClick={
                            (): void => open()
                        }
                    >
                        {t('close')}
                    </Button>
                ]}
            >
                {serverInfo &&
                    <Space>
                        <Card title={t('memory')}>
                            <Descriptions placement="vertical" column={2}>
                                <Descriptions.Item
                                    label={t('appUseMemory')}>{serverInfo.main.memory.rss} M</Descriptions.Item>
                                <Descriptions.Item
                                    label={t('heapTotal')}>{serverInfo.main.memory.heapTotal} M</Descriptions.Item>
                                <Descriptions.Item
                                    label={t('heapUsed')}>{serverInfo.main.memory.heapUsed} M</Descriptions.Item>
                                <Descriptions.Item
                                    label={t('arrayBuffers')}>{serverInfo.main.memory.arrayBuffers} M</Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Card title={t('version')}>
                            <Descriptions placement="vertical" column={1}>
                                <Descriptions.Item
                                    label="NodeJS">{`${serverInfo.rtVersion.node} / ${serverInfo.rtVersion.v8}`}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Card title={t('status')}>
                            <Descriptions placement="vertical">
                                <Descriptions.Item label={t('synthesisServicesConnectStatus')}>
                                    {renderTag(serverInfo.main.synthesisServicesConnectStatus)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Space>
                }
            </Modal>
        </div>
    );
};

export default ServerInfo;
