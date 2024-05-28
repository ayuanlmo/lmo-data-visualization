import {Form, FormItem, Grid, Input, Modal, Pagination, Search, TabPane, Tabs} from "@hi-ui/hiui";
import React, {useImperativeHandle, useRef, useState} from "react";
import ImageList, {IImageItem, IImageListRef} from "./ImageList";
import {ReactState} from "../../types/ReactTypes";
import FileCategoryTree from "./FileCategoryTree";
import UploadFile from "./UploadFile";
import AudioList, {IAudioListRef} from "./AudioList";
import YExtendTemplate from "../YExtendTemplate";
import Request from "../../lib/Request";
import Notification from "../../lib/Notification";

export interface ISelectFile extends IImageItem {
    cover?: string;
}

export interface ISelectFileProps {
    onSelect?: (data: ISelectFile) => void;
    type?: TFileType;
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

const SelectFile = React.forwardRef((props: ISelectFileProps, ref: React.ForwardedRef<ISelectFileRef>) => {
    const {
        onSelect,
        type = 'image'
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
            title: '您确定要删除该素材吗?',
            onConfirm: (): void => {
                Request.deleteFile({
                    id: data.id
                }).then((): void => {
                    getList();
                    Notification.message('删除成功', 'success');
                });
            }
        });
    };

    useImperativeHandle(ref, (): ISelectFileRef => ({
        open
    }));

    return (
        <Modal
            footer={null}
            visible={visible}
            title={'素材库'}
            width={'50%'}
            height={'60%'}
            onClose={(): void => open()}
            onCancel={(): void => open()}
        >
            <div className={'c-select-file app_position_relative'}>
                <div className={'c-select-file-search'}>
                    <Grid.Row gutter={true} justify={"space-between"}>
                        <Grid.Col span={{lg: 12, xl: 12, md: 16, sm: 16, xs: 16}}>
                            <Search
                                placeholder={'输入名称搜索...'}
                                onSearch={(data: string): void => {
                                    setQuery({
                                        ...query,
                                        name: data
                                    });
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={8}>
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
                                <TabPane tabId="image" tabTitle="图片"/>
                                <TabPane tabId="audio" tabTitle="音频"/>
                            </Tabs>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <UploadFile/>
                        </Grid.Col>
                    </Grid.Row>
                </div>
                <div style={{
                    height: 'calc(100% - 6.5%)'
                }}>
                    <Grid.Row
                        justify={'space-between'}
                        style={{
                            height: '100%'
                        }}
                    >
                        <Grid.Col span={4}>
                            <div style={{
                                background: 'whitesmoke',
                                height: '100%'
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
                                        title={'修改'}
                                        visible={editModalVisible}
                                        confirmLoading={modalLoading}
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
                                                    Notification.message('修改成功', 'success');
                                                }, 500);
                                            });
                                        }}
                                    >
                                        <Form labelPlacement="top" initialValues={{}}>
                                            <FormItem label={'分类'}>
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
                                            <FormItem label={'名称'}>
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
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </YExtendTemplate>
                            </div>
                            <div className={'c-select-file-pagination'}>
                                <Pagination
                                    pageSize={query.pageSize}
                                    total={pageTotal}
                                    showTotal
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
