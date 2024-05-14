import React, {useEffect, useState} from "react";
import Request from "../../lib/Request";
import YExtendTemplate from "../YExtendTemplate";
import {EmptyState, Preview} from "@hi-ui/hiui";
import LoadingImage from "./LoadingImage";
import {ReactState} from "../../types/ReactTypes";

export interface IImageItem {
    id: string;
    name: string;
    path: string;
    createTime: string;
    type: string;
    categoryId: string;
}

export interface IImageListProps {
    query: object;
    onRequest: (data: {
        total: number;
    }) => void;
    onSelect?: (data: IImageItem) => void;
}

const ImageList = (props: IImageListProps): React.JSX.Element => {
    const {onSelect} = props;
    const [images, setImages]: ReactState<Array<IImageItem>> = useState<Array<IImageItem>>([]);
    const [previewVisible, setPreviewVisible]: ReactState<boolean> = useState<boolean>(false);
    const [previewInfo, setPreviewInfo]: ReactState<IImageItem> = useState<IImageItem>({
        createTime: "",
        id: "",
        path: "",
        type: "",
        name: "",
        categoryId: ""
    });

    const getFileList = (): void => {
        Request.getFileList({...props.query}).then((res): void => {
            setImages(res.data.rows);
            props.onRequest({
                total: res.data.total
            });
        });
    };

    useEffect((): void => {
        getFileList();
    }, [props]);

    return (
        <>
            <YExtendTemplate show={images.length > 0}>
                <div className={'c-image-waterfall'}>
                    <Preview
                        title={previewInfo.name}
                        visible={previewVisible}
                        src={'/api' + previewInfo.path}
                        onClose={(): void => {
                            setPreviewVisible(false);
                        }}
                    />
                    {images.map((image: IImageItem): React.JSX.Element =>
                        <div
                            key={image.id}
                            className={'c-image-waterfall-item app_position_relative'}
                            onClick={(): void => {
                                onSelect && onSelect(image);
                                setPreviewInfo(image);
                                setPreviewVisible(true);
                            }}
                        >
                            <LoadingImage
                                className={'app_cursor_pointer'}
                                src={'/api' + image.path}
                                alt={image.name}
                                item={image}
                                onDelete={getFileList}
                                onUpdate={(name: string, id: string): void => {
                                    setImages(images.map((item: IImageItem): IImageItem => {
                                        if (item.id === id)
                                            return {
                                                ...item,
                                                name: name
                                            };
                                        return item;
                                    }));
                                }}
                            />
                        </div>
                    )}
                </div>
            </YExtendTemplate>
            <YExtendTemplate show={images.length === 0}>
                <EmptyState/>
            </YExtendTemplate>
        </>
    );
};

export default ImageList;
