import React, {useRef, useState} from "react";
import {Button, Form, FormHelpers, FormItem, Input, Modal, Upload} from "@hi-ui/hiui";
import {ReactState} from "../../types/ReactTypes";
import FileCategoryTree from "./FileCategoryTree";
import Request from "../../lib/Request";
import Notification from "../../lib/Notification";
import {useTranslation} from "react-i18next";

export interface IUploadFileProps {
    buttonText?: string;
    modalTitle?: string;
    onRefresh?: () => void;
}

export interface IUploadFrom {
    name: string;
    media: File;
}

const UploadFile = (props: IUploadFileProps): React.JSX.Element => {
    const {t} = useTranslation();
    const {
        buttonText = t('upload'),
        modalTitle = t('upload'),
        onRefresh
    }: IUploadFileProps = props;
    const [upLoadModalVisible, setUpLoadModalVisible]: ReactState<boolean> = useState<boolean>(false);
    const uploadFromRef: React.RefObject<FormHelpers<IUploadFrom>> = useRef<FormHelpers>(null);
    const [selectFiles, setSelectFiles]: ReactState<Array<File>> = useState<Array<File>>([]);
    const [selectedCategory, setSelectedCategory]: ReactState<React.ReactText | null> = useState<React.ReactText | null>(null);
    const [fileNameValues, setFileNameValues]: ReactState<Array<{
        name: string;
        defaultName: string;
    }>> = useState<Array<{
        name: string;
        defaultName: string;
    }>>([]);

    const upLoad = async (): Promise<void> => {
        let index: number = 0;

        for (const file of selectFiles) {
            await Request.uploadFile({
                media: file,
                name: fileNameValues[index].name,
                categoryId: selectedCategory
            }).then((): void => {
                setTimeout((): void => {
                    setSelectFiles(selectFiles.filter((item, index) => index !== index));
                    setFileNameValues(fileNameValues.filter((item, index) => index !== index));
                    Notification.message(`[${file.name}] ${t('uploadSuccess')}`, 'success');
                }, 200);
            });
            index += 1;
        }
        onRefresh && onRefresh();
    };

    return (
        <>
            <Button
                type={'primary'}
                onClick={(): void => {
                    setUpLoadModalVisible(!upLoadModalVisible);
                }}
            >
                {buttonText}
            </Button>
            <Modal
                unmountOnClose
                title={modalTitle}
                visible={upLoadModalVisible}
                cancelText={t('cancel')}
                confirmText={t('confirm')}
                onClose={(): void => {
                    setUpLoadModalVisible(!upLoadModalVisible);
                }}
                onCancel={(): void => {
                    setUpLoadModalVisible(!upLoadModalVisible);
                }}
                onConfirm={(): void => {
                    upLoad();
                }}
            >
                <Form innerRef={uploadFromRef} labelPlacement="top" initialValues={{name: '', media: null}}>
                    <FormItem label={t('categories')}>
                        <FileCategoryTree
                            type={'TreeSelect'}
                            onSelectTree={(e: React.ReactText | null): void => {
                                setSelectedCategory(e);
                            }}
                        />
                    </FormItem>
                    {
                        fileNameValues.map((i, k): React.JSX.Element => {
                            return (
                                <FormItem key={k} label={i.defaultName}>
                                    <Input
                                        defaultValue={i.defaultName}
                                        placeholder={t('pleaseInputFileName')}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            const data = [...fileNameValues];

                                            data[k].name = e.target.value;
                                            setFileNameValues(data);
                                        }}
                                    />
                                </FormItem>
                            );
                        })
                    }
                    <FormItem required={true} label={t('file')} field="media" valueType="integer">
                        <Upload
                            type="drag"
                            data={[]}
                            content={t('dropUpload')}
                            multiple={true}
                            accept=".png,.jpg,.jpeg,.svg"
                            customUpload={(file: FileList | null): void => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                const files = Array.from(file);
                                const data = [...fileNameValues];

                                setSelectFiles(files);
                                Array.from(files).forEach((i: File): void => {
                                    data.push({
                                        name: i.name,
                                        defaultName: i.name
                                    });
                                });
                                setFileNameValues(data);
                            }}
                        />
                    </FormItem>
                </Form>
            </Modal>
        </>
    );
};

export default UploadFile;
