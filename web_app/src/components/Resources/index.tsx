import React, {useEffect, useImperativeHandle, useState} from "react";
import {EmptyState, Grid, Modal, Pagination, Search} from "@hi-ui/hiui";
import {SearchOutlined} from "@hi-ui/icons";
import Request from "../../lib/Request";
import {ReactState} from "../../types/ReactTypes";
import VideoPlayer, {IVideoPlayerRef} from "./VideoPlayer";
import {useTranslation} from "react-i18next";
import ResourcesItem, {IResourcesItem} from "./ResourcesItem";
import Utils from "../../utils";
import Notification from "../../lib/Notification";

export interface IResourcesRef {
    open: () => void;
}

interface IQuery {
    pageIndex: number;
    pageSize: number;
    name: string;
}

const Resources: React.ForwardRefExoticComponent<React.RefAttributes<IResourcesRef>> = React.forwardRef((_props: React.RefAttributes<IResourcesRef>, ref: React.ForwardedRef<IResourcesRef>): React.JSX.Element => {
    const [list, setList]: ReactState<Array<IResourcesItem>> = useState<Array<IResourcesItem>>([]);
    const [visible, setVisible]: ReactState<boolean> = useState<boolean>(false);
    const playerRef: React.RefObject<IVideoPlayerRef> = React.useRef<IVideoPlayerRef>(null);
    const [pageTotal, setPageTotal]: ReactState<number> = useState<number>(0);
    const [query, setQuery]: ReactState<IQuery> = useState<IQuery>({
        name: '',
        pageIndex: 0,
        pageSize: 10
    });
    const {t} = useTranslation();

    const open = (): void => {
        setVisible(!visible);
    };

    const getList = (): void => {
        Request.resourcesList({...query}).then(res => {
            setList(res.data.rows);
            setPageTotal(res.data.total);
        });
    };

    const downloadFile = (item: IResourcesItem, type: 'video' | 'gif'): void => {
        Utils.downloadFile({
            download: item.name,
            href: `/api` + (type === 'video' ? `${item.filePath}` : `${item.gifPath}`)
        }).then((a: HTMLAnchorElement): void => {
            a.click();
        });
    };

    useEffect((): void => {
        if (visible)
            getList();
    }, [query, visible]);

    useImperativeHandle(ref, (): IResourcesRef => ({
        open
    }));

    return (
        <Modal
            title={t('resLib')}
            visible={visible}
            width={'1200px'}
            height={'642px'}
            footer={false}
            onClose={(): void => {
                setVisible(false);
            }}
            onCancel={(): void => {
                setVisible(false);
            }}
        >
            <div className={'c-select-file-search'}>
                <Grid.Row
                    gutter={true}
                    justify={'flex-start'}
                >
                    <Grid.Col span={12}>
                        <Search
                            placeholder={t('enterNameToStartQuery')}
                            prepend={
                                <SearchOutlined/>
                            }
                            append={null}
                            onSearch={(data: string): void => {
                                if (data === '' && query.name === '')
                                    return;
                                setQuery({
                                    ...query,
                                    name: data
                                });
                            }}
                        />
                    </Grid.Col>
                </Grid.Row>
            </div>
            <VideoPlayer ref={playerRef}/>
            <div
                className={'app_position_relative'}
                style={{
                    width: '100%',
                    marginTop: '1.88rem',
                    marginBottom: '1.88rem',
                    height: '400px',
                    overflowY: 'scroll',
                    overflowX: 'hidden'
                }}
            >
                {
                    list.length === 0
                        ?
                        <EmptyState title={t('noData')}/>
                        :
                        <Grid.Row gutter={true}>
                            {
                                list.map((i: IResourcesItem) => {
                                    return (
                                        <Grid.Col
                                            key={i.id}
                                            span={6}
                                        >
                                            <ResourcesItem
                                                data={i}
                                                onDownload={(item: IResourcesItem, type: 'video' | 'gif'): void => {
                                                    downloadFile(item, type);
                                                }}
                                                onPlay={(): void => {
                                                    playerRef.current?.play(`${i.filePath}`);
                                                }}
                                                onDelete={(id: string): void => {
                                                    Modal.confirm({
                                                        title: t('deleteConfirm'),
                                                        cancelText: t('cancel'),
                                                        confirmText: t('confirm'),
                                                        onConfirm: (): void => {
                                                            Request.deleteResources(id).then((): void => {
                                                                getList();
                                                                Notification.message(t('deleteSuccess'), 'success');
                                                            });
                                                        }
                                                    });
                                                }}
                                            />
                                        </Grid.Col>
                                    );
                                })
                            }
                        </Grid.Row>
                }
            </div>
            <div className={'c-select-file-pagination'}>
                <Pagination
                    pageSize={query.pageSize}
                    total={pageTotal}
                    onChange={(...args) => {
                        setQuery({
                            ...query,
                            pageIndex: args[0]
                        });
                    }}
                />
            </div>
        </Modal>
    );
});

Resources.displayName = 'Resources';

export default Resources;
