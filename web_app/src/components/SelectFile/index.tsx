import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {Form, FormItem, Grid, Input, Modal, Pagination, Search, TabPane, Tabs} from "@hi-ui/hiui";
import {SearchOutlined} from "@hi-ui/icons";
import ImageList, {IImageItem, IImageListRef} from "./ImageList";
import {ReactState} from "../../types/ReactTypes";
import FileCategoryTree from "./FileCategoryTree";
import UploadFile from "./UploadFile";
import AudioList, {IAudioListRef} from "./AudioList";
import YExtendTemplate from "../YExtendTemplate";
import Request from "../../lib/Request";
import Notification from "../../lib/Notification";
import {useTranslation} from "react-i18next";

export interface ISelectFile extends IImageItem {
    cover?: string;
}

export interface ISelectFileProps {
    onSelect?: (data: ISelectFile) => void;
    type?: TFileType;
    isUse?: boolean;
    audio?: boolean;
    image?: boolean;
}

export interface ISelectFileRef {
    open: () => void;
}

export interface IQuery {
    name: string;
    pageIndex: number;
    pageSize: number;
    categoryId: string;
    type: TFileType;
}

export interface ICategory {
    id: string;
    name: string;
    title?: string;
    parentId: null | string;
    children: Array<ICategory>;
}

export type TFileType = 'image' | 'audio';

const SelectFile: React.ForwardRefExoticComponent<ISelectFileProps & React.RefAttributes<ISelectFileRef>> = React.forwardRef((props: ISelectFileProps, ref: React.ForwardedRef<ISelectFileRef>) => {
    const {
        onSelect,
        type = 'image',
        isUse = true,
        audio = true,
        image = true
    }: ISelectFileProps = props;
    const [query, setQuery]: ReactState<IQuery> = useState({
        name: '',
        pageIndex: 0,
        pageSize: 10,
        categoryId: '',
        type: type
    });
    const [pageTotal, setPageTotal]: ReactState<number> = useState<number>(0);
    const [visible, setVisible]: ReactState<boolean> = useState<boolean>(false);
    const [fileType, setFileType]: ReactState<TFileType> = useState(type);
    const [editItem, setEditItem]: ReactState<IImageItem | null> = useState<IImageItem | null>(null);
    const [modalLoading, setModalLoading]: ReactState<boolean> = useState<boolean>(false);
    const [editModalVisible, setEditModalVisible]: ReactState<boolean> = useState<boolean>(false);
    const imageListRef: React.RefObject<IImageListRef> = useRef<IImageListRef>(null);
    const audioListRef: React.RefObject<IAudioListRef> = useRef<IAudioListRef>(null);
    const {t} = useTranslation();

    const open = (): void => setVisible(!visible);

    const onEdit = (data: IImageItem): void => {
        setEditItem(data);
        setEditModalVisible(true);
    };
    const getList = (): void => {
        if (fileType == 'image')
            imageListRef.current?.getFileList();
        else
            audioListRef.current?.getFileList();
    };
    const onUse = (data: IImageItem): void => {
        onSelect && onSelect(data);
    };
    const onDelete = (data: IImageItem): void => {
        Modal.confirm({
            title: t('deleteConfirm'),
            cancelText: t('cancel'),
            confirmText: t('confirm'),
            onConfirm: (): void => {
                Request.deleteFile({
                    id: data.id
                }).then((): void => {
                    getList();
                    Notification.message(t('deleteSuccess'), 'success');
                });
            }
        });
    };

    useEffect(() => {
        if (visible)
            getList();
    }, [visible]);

    useImperativeHandle(ref, (): ISelectFileRef => ({
        open
    }));

    return (
        <Modal
            footer={null}
            visible={visible}
            title={t('materialLib')}
            width={'1200px'}
            height={'642px'}
            cancelText={t('cancel')}
            confirmText={t('confirm')}
            onClose={(): void => open()}
            onCancel={(): void => open()}
        >
            <div className={'c-select-file app_position_relative'}>
                <div className={'c-select-file-search'}>
                    <Grid.Row gutter={true} justify={"space-between"}>
                        <Grid.Col span={8}>
                            <YExtendTemplate show={visible}>
                                <Tabs
                                    activeId={fileType}
                                    style={{
                                        marginTop: '-8px'
                                    }}
                                    onChange={(e: React.ReactText | TFileType): void => {
                                        setFileType(e as TFileType);
                                        setQuery({
                                            ...query,
                                            type: e as TFileType
                                        });
                                    }}
                                >
                                    <TabPane
                                        disabled={!image}
                                        tabId="image"
                                        tabTitle={t('image')}
                                    />
                                    <TabPane
                                        disabled={!audio}
                                        tabId="audio"
                                        tabTitle={t('audio')}
                                    />
                                </Tabs>
                            </YExtendTemplate>
                        </Grid.Col>
                        <Grid.Col span={{lg: 12, xl: 12, md: 12, sm: 10, xs: 16}}>
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
                        <Grid.Col span={4}>
                            <UploadFile onRefresh={getList}/>
                        </Grid.Col>
                    </Grid.Row>
                </div>
                <div style={{
                    marginTop: '1rem',
                    overflowX: 'hidden'
                }}>
                    <Grid.Row
                        justify={'space-between'}
                        style={{
                            height: '100%'
                        }}
                    >
                        <Grid.Col span={4}>
                            <div
                                className={'category-tree-box'}
                                style={{
                                    background: 'whitesmoke',
                                    height: '460px',
                                    overflowY: 'scroll'
                                }}>
                                <FileCategoryTree
                                    onSelectTree={(e: string | null | React.ReactText): void => {
                                        setQuery({
                                            ...query,
                                            categoryId: `${e ?? ''}`
                                        });
                                    }}
                                />
                            </div>
                        </Grid.Col>
                        <Grid.Col span={20}>
                            <div className={'c-select-file-content animated fadeIn'}>
                                <YExtendTemplate show={editModalVisible}>
                                    <Modal
                                        title={t('edit')}
                                        visible={editModalVisible}
                                        confirmLoading={modalLoading}
                                        cancelText={t('cancel')}
                                        confirmText={t('confirm')}
                                        onCancel={(): void => {
                                            setEditModalVisible(false);
                                        }}
                                        onConfirm={(): void => {
                                            setModalLoading(true);
                                            Request.editFileInfo(editItem?.id as string, {
                                                name: editItem?.name,
                                                categoryId: editItem?.categoryId
                                            }).then((): void => {
                                                setTimeout((): void => {
                                                    setModalLoading(false);
                                                    setEditModalVisible(false);
                                                    getList();
                                                    Notification.message(t('editSuccess'), 'success');
                                                }, 500);
                                            });
                                        }}
                                    >
                                        <Form labelPlacement="top" initialValues={{}}>
                                            <FormItem label={t('categories')}>
                                                <FileCategoryTree
                                                    type={'TreeSelect'}
                                                    value={editItem?.categoryId}
                                                    onSelectTree={(e: React.ReactText | null): void => {
                                                        setEditItem({
                                                            ...editItem as IImageItem,
                                                            categoryId: e as string
                                                        });
                                                    }}
                                                />
                                            </FormItem>
                                            <FormItem label={t('name')}>
                                                <Input
                                                    defaultValue={editItem?.name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                        setEditItem({
                                                            ...editItem as IImageItem,
                                                            name: e.target.value
                                                        });
                                                    }}
                                                />
                                            </FormItem>
                                        </Form>
                                    </Modal>
                                </YExtendTemplate>
                                <YExtendTemplate show={fileType === 'image'}>
                                    <ImageList
                                        onUse={onUse}
                                        onEdit={onEdit}
                                        setPageTotal={setPageTotal}
                                        fileType={fileType}
                                        ref={imageListRef}
                                        query={query}
                                        isUse={isUse}
                                        onDelete={onDelete}
                                    />
                                </YExtendTemplate>
                                <YExtendTemplate show={fileType === 'audio'}>
                                    <AudioList
                                        onUse={onUse}
                                        modalVisible={visible}
                                        setPageTotal={setPageTotal}
                                        fileType={fileType}
                                        ref={audioListRef}
                                        query={query}
                                        isUse={isUse}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </YExtendTemplate>
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
                        </Grid.Col>
                    </Grid.Row>
                </div>
            </div>
        </Modal>
    );
});

SelectFile.displayName = 'SelectFile';

export default SelectFile;
