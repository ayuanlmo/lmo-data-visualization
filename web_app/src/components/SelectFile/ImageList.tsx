import React, {useEffect, useImperativeHandle, useState} from "react";
import YExtendTemplate from "../YExtendTemplate";
import {EmptyState, Preview} from "@hi-ui/hiui";
import LoadingImage from "./LoadingImage";
import {ReactState} from "../../types/ReactTypes";
import {TFileType} from "./index";
import Request from "../../lib/Request";

export interface IImageItem {
    id: string;
    name: string;
    path: string;
    createTime: string;
    type: string;
    categoryId: string;
}

export interface IImageListProps {
    readonly fileType: TFileType;
    query: object;
    setPageTotal: React.Dispatch<React.SetStateAction<number>>;
    readonly onEdit?: (item: IImageItem) => void;
    readonly onDelete?: (item: IImageItem) => void;
    readonly onUse?: (item: IImageItem) => void;
}

export interface IImageListRef {
    getFileList: () => void;
}

const ImageList = React.forwardRef((props: IImageListProps, ref: React.ForwardedRef<IImageListRef>) => {
    const {
        fileType,
        query,
        setPageTotal,
        onEdit,
        onDelete,
        onUse
    }: IImageListProps = props;
    const [previewVisible, setPreviewVisible]: ReactState<boolean> = useState<boolean>(false);
    const [previewInfo, setPreviewInfo]: ReactState<IImageItem> = useState<IImageItem>({
        createTime: "",
        id: "",
        path: "",
        type: "",
        name: "",
        categoryId: ""
    });

    const [fileList, setFileList]: ReactState<Array<IImageItem>> = useState<Array<IImageItem>>([]);

    const getFileList = (): void => {
        if (fileType === 'image')
            Request.getFileList({...query}).then((res): void => {
                setFileList(res.data.rows);
                setPageTotal(res.data.total);
            });
    };

    useImperativeHandle(ref, (): IImageListRef => ({
        getFileList
    }));

    useEffect((): void => {
        getFileList();
    }, [query]);
    return (
        <>
            <YExtendTemplate show={fileList.length > 0 && fileType === 'image'}>
                <div className={'c-image-waterfall'}>
                    <Preview
                        title={previewInfo.name}
                        visible={previewVisible}
                        src={'/api' + previewInfo.path}
                        onClose={(): void => {
                            setPreviewVisible(false);
                        }}
                    />
                    {fileList.map((image: IImageItem): React.JSX.Element =>
                        <div
                            key={image.id}
                            className={'c-image-waterfall-item app_position_relative'}
                            onClick={(): void => {
                                setPreviewInfo(image);
                                setPreviewVisible(true);
                            }}
                        >
                            <LoadingImage
                                className={'app_cursor_pointer'}
                                src={'/api' + image.path}
                                alt={image.name}
                                item={image}
                                onEdit={(data: IImageItem): void => {
                                    onEdit && onEdit(data);
                                }}
                                onDelete={(data: IImageItem): void => {
                                    onDelete && onDelete(data);
                                }}
                                onUse={(data: IImageItem): void => {
                                    onUse && onUse(data);
                                }}
                                onPreview={(data: IImageItem): void => {
                                    setPreviewInfo(data);
                                    setPreviewVisible(true);
                                }}
                            />
                        </div>
                    )}
                </div>
            </YExtendTemplate>
            <YExtendTemplate show={fileList.length === 0}>
                <EmptyState/>
            </YExtendTemplate>
        </>
    );
});

ImageList.displayName = 'ImageList';

export default ImageList;
