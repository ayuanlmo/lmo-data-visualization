import React, {useState} from "react";
import {Input, Loading, Modal, Popover, Space} from "@hi-ui/hiui";
import {EditOutlined} from "@hi-ui/icons";
import {ReactState} from "../../types/ReactTypes";
import {IImageItem} from "./ImageList";

interface ILoadingImageProps {
    src: string;
    alt?: string;
    className?: string;
    item: IImageItem;
}

const LoadingImage = (props: ILoadingImageProps): React.JSX.Element => {
    const {src, alt, className}: ILoadingImageProps = props;
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(true);
    const [editModalVisible, setEditModalVisible]: ReactState<boolean> = useState<boolean>(false);
    const [imageInfo, setImageInfo]: ReactState<IImageItem | null> = useState<IImageItem | null>(null);

    const stopPropagation = (e: React.MouseEvent<HTMLElement | HTMLDivElement | SVGSVGElement>): void => {
        e.stopPropagation();
    };

    return (
        <Loading visible={loading}>
            <>
                <Popover
                    title={'操作'}
                    trigger={'hover'}
                    placement={'right'}
                    content={
                        <>
                            <Space size={12} align={'center'}>
                                <EditOutlined
                                    size={24}
                                    onClick={(e: React.MouseEvent<SVGSVGElement>): void => {
                                        stopPropagation(e);
                                        setEditModalVisible(true);
                                        setImageInfo(props.item);
                                    }}
                                />
                                <EditOutlined size={24}/>
                                <EditOutlined size={24}/>
                            </Space>
                        </>
                    }
                >
                    <img
                        className={className}
                        onLoad={(): void => setLoading(false)}
                        src={src} alt={alt}
                    />
                </Popover>
            </>
            <Modal
                title={'修改名称'}
                visible={editModalVisible}
                onClose={(): void => {
                    setEditModalVisible(false);
                }}
            >
                <Input
                    defaultValue={imageInfo?.name}
                />
            </Modal>
        </Loading>
    );
};

export default LoadingImage;
