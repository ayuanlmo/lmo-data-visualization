import React, {useEffect, useState} from "react";
import Request from "../../lib/Request";
import YExtendTemplate from "../YExtendTemplate";
import EmptyState from "@hi-ui/empty-state";
import LoadingImage from "./LoadingImage";

export interface IImageItem {
    id: string;
    name: string;
    path: string;
    createTime: string;
    type: string;
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
    const [images, setImages]:
        [Array<IImageItem>, React.Dispatch<React.SetStateAction<Array<IImageItem>>>]
        = useState<Array<IImageItem>>([]);

    useEffect((): void => {
        Request.getFileList({...props.query}).then((res): void => {
            setImages(res.data.rows);
            props.onRequest({
                total: res.data.total
            });
        });
    }, [props]);
    return (
        <>
            <YExtendTemplate show={images.length > 0}>
                <div className={'c-image-waterfall'}>
                    {images.map((image: IImageItem): React.JSX.Element =>
                        <div
                            className={'c-image-waterfall-item'}
                            key={image.id}
                            onClick={(): void => {
                                onSelect && onSelect(image);
                            }}
                        >
                            <LoadingImage
                                className={'app_cursor_pointer'}
                                src={'/api' + image.path}
                                alt={image.name}
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