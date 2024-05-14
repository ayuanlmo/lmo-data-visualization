import React, {useState} from "react";
import {Button, Form, FormItem, Input, Loading, Modal, Popover, Space} from "@hi-ui/hiui";
import {DeleteFilled, EditFilled} from "@hi-ui/icons";
import {ReactState} from "../../types/ReactTypes";
import {IImageItem} from "./ImageList";
import Request from "../../lib/Request";
import Notification from "../../lib/Notification";
import FileCategoryTree from "./FileCategoryTree";

interface ILoadingImageProps {
    src: string;
    alt?: string;
    className?: string;
    item: IImageItem;
    onUpdate?: (name: string, id: string) => void;
    onDelete?: () => void;
}

const LoadingImage = (props: ILoadingImageProps): React.JSX.Element => {
    const {src, alt, className, onUpdate, onDelete}: ILoadingImageProps = props;
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(true);
    const [editModalVisible, setEditModalVisible]: ReactState<boolean> = useState<boolean>(false);
    const [editConfirmLoading, setEditConfirmLoading]: ReactState<boolean> = React.useState<boolean>(false);
    const [imageInfo, setImageInfo]: ReactState<IImageItem | null> = useState<IImageItem | null>(null);
    const [inputValue, setInputValue]: ReactState<string> = useState<string>('');
    const [selectedCategory, setSelectedCategory]: ReactState<React.ReactText | null> = useState<React.ReactText | null>(null);

    const stopPropagation = (e: React.MouseEvent<HTMLElement | HTMLDivElement | SVGSVGElement> | React.MouseEvent<Element, MouseEvent>): void => e.stopPropagation();

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
                                    icon={
                                        <EditFilled/>
                                    }
                                    onClick={(e: React.MouseEvent<Element, MouseEvent>): void => {
                                        stopPropagation(e);
                                        setEditModalVisible(true);
                                        setImageInfo(props.item);
                                    }}
                                >
                                    修改
                                </Button>
                                <Button
                                    size="sm"
                                    type="danger"
                                    icon={
                                        <DeleteFilled/>
                                    }
                                    onClick={(e: React.MouseEvent<Element, MouseEvent>): void => {
                                        stopPropagation(e);
                                        Modal.confirm({
                                            title: '您确定删除吗？',
                                            onConfirm: (): void => {
                                                Request.deleteFile({
                                                    id: props.item.id
                                                }).then((): void => {
                                                    onDelete && onDelete();
                                                    Notification.message('删除成功', 'success');
                                                });
                                            }
                                        });
                                    }}
                                >
                                    删除
                                </Button>
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
            <Modal
                title={'修改'}
                visible={editModalVisible}
                confirmLoading={editConfirmLoading}
                onClose={(): void => {
                    setEditModalVisible(false);
                }}
                onCancel={(): void => {
                    setEditModalVisible(false);
                }}
                onConfirm={(): void => {
                    setEditConfirmLoading(true);
                    Request.editFileInfo({
                        name: inputValue === '',
                        id: imageInfo?.id,
                        categoryId: selectedCategory
                    }).then((): void => {
                        onUpdate && onUpdate(inputValue, imageInfo?.id ?? '');

                        setTimeout((): void => {
                            setEditModalVisible(false);
                            setEditConfirmLoading(false);
                            Notification.message('修改成功', 'success');
                        }, 500);
                    });
                }}
            >
                <Form labelPlacement="top" initialValues={{}}>
                    <FormItem label={'分类'}>
                        <FileCategoryTree
                            type={'TreeSelect'}
                            value={props.item.categoryId}
                            onSelectTree={(e: React.ReactText | null): void => {
                                setSelectedCategory(e);
                            }}
                        />
                    </FormItem>
                    <FormItem label={'名称'}>
                        <Input
                            defaultValue={imageInfo?.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                setInputValue(e.target.value);
                            }}
                        />
                    </FormItem>
                </Form>
            </Modal>
        </Loading>
    );
};

export default LoadingImage;
