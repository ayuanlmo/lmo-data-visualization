import React, {useState} from "react";
import {Button, Loading, Popover, Space} from "@hi-ui/hiui";
import {ReactState} from "../../types/ReactTypes";
import {IImageItem} from "./ImageList";
import {useTranslation} from "react-i18next";
import YExtendTemplate from "../YExtendTemplate";

interface ILoadingImageProps {
    src: string;
    alt?: string;
    className?: string;
    item: IImageItem;
    onUpdate?: (name: string, id: string) => void;
    readonly onEdit?: (item: IImageItem) => void;
    readonly onDelete?: (item: IImageItem) => void;
    readonly onUse?: (item: IImageItem) => void;
    readonly onPreview?: (item: IImageItem) => void;
    isUse?: boolean;
}

const LoadingImage = (props: ILoadingImageProps): React.JSX.Element => {
    const {
        src,
        alt,
        className,
        onEdit,
        onDelete,
        onUse,
        onPreview,
        isUse
    }: ILoadingImageProps = props;
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(true);
    const stopPropagation = (e: React.MouseEvent<HTMLElement | HTMLDivElement | SVGSVGElement> | React.MouseEvent<Element, MouseEvent>): void => e.stopPropagation();
    const {t} = useTranslation();

    return (
        <Loading visible={loading}>
            <>
                <Popover
                    trigger={'hover'}
                    placement={'right'}
                    matchWidth={true}
                    arrow={true}
                    content={
                        <>
                            <Space
                                size={12}
                                align={'center'}
                            >
                                <Button
                                    size="sm"
                                    type="primary"
                                    onClick={(e: React.MouseEvent<Element, MouseEvent>): void => {
                                        stopPropagation(e);
                                        onPreview && onPreview(props.item);
                                    }}
                                >
                                    {t('preview')}
                                </Button>
                                <YExtendTemplate show={isUse}>
                                    <Button
                                        size="sm"
                                        type="primary"
                                        onClick={(e: React.MouseEvent<Element, MouseEvent>): void => {
                                            stopPropagation(e);
                                            onUse && onUse(props.item);
                                        }}
                                    >
                                        {t('use')}
                                    </Button>
                                </YExtendTemplate>
                                <YExtendTemplate show={!isUse}>
                                    <Button
                                        size="sm"
                                        type="primary"
                                        onClick={(e: React.MouseEvent<Element, MouseEvent>): void => {
                                            stopPropagation(e);
                                            onEdit && onEdit(props.item);
                                        }}
                                    >
                                        {t('edit')}
                                    </Button>
                                    <Button
                                        size="sm"
                                        type="danger"
                                        onClick={(e: React.MouseEvent<Element, MouseEvent>): void => {
                                            stopPropagation(e);
                                            onDelete && onDelete(props.item);
                                        }}
                                    >
                                        {t('delete')}
                                    </Button>
                                </YExtendTemplate>
                            </Space>
                        </>
                    }
                >
                    <img
                        src={src}
                        alt={alt}
                        className={className}
                        onLoad={(): void => setLoading(false)}
                    />
                </Popover>
            </>
        </Loading>
    );
};

export default LoadingImage;
