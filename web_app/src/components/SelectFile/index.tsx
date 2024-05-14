import {Grid, Modal, Pagination, Search} from "@hi-ui/hiui";
import React, {useImperativeHandle, useState} from "react";
import ImageList, {IImageItem} from "./ImageList";
import {ReactState} from "../../types/ReactTypes";
import FileCategoryTree from "./FileCategoryTree";
import UploadFile from "./UploadFile";

export interface ISelectFileProps {
    onSelect?: (data: IImageItem) => void;
}

export interface ISelectFileRef {
    open: () => void;
}

interface IQuery {
    name: string;
    pageIndex: number;
    pageSize: number;
    categoryId: string;
}

export interface ICategory {
    id: string;
    name: string;
    title?: string;
    parentId: null | string;
    children: Array<ICategory>;
}

const SelectFile = React.forwardRef((props: ISelectFileProps, ref: React.ForwardedRef<ISelectFileRef>) => {
    const {onSelect} = props;
    const [query, setQuery]: ReactState<IQuery> = useState({
        name: '',
        pageIndex: 0,
        pageSize: 10,
        categoryId: ''
    });
    const [pageTotal, setPageTotal]: ReactState<number> = useState<number>(0);
    const [visible, setVisible]: ReactState<boolean> = useState<boolean>(false);

    const open = (): void => setVisible(!visible);

    useImperativeHandle(ref, () => ({
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
                                <ImageList onSelect={
                                    (data): void => {
                                        onSelect && onSelect(data);
                                    }
                                } query={{...query}} onRequest={({total}): void => {
                                    setPageTotal(total);
                                }}/>
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
