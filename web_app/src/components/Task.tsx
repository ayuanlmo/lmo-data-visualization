import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Form, FormHelpers, FormItem, Input, Modal, Switch} from '@hi-ui/hiui';
import {RootState} from "../lib/Store";
import {ReactState} from "../types/ReactTypes";
import YExtendTemplate from "./YExtendTemplate";
import Hooks from "../bin/Hooks";
import PostMessage from "../lib/PostMessage";
import Request from "../lib/Request";
import {useTranslation} from "react-i18next";
import Notification from "../lib/Notification";
import useTemplateMessageListener = Hooks.useTemplateMessageListener;

export interface ICreateTaskRef {
    open: () => void;
}

type TTask = React.ForwardRefExoticComponent<React.RefAttributes<ICreateTaskRef>>;

const Task: TTask = React.forwardRef((_props: React.RefAttributes<ICreateTaskRef>, ref: React.ForwardedRef<ICreateTaskRef>) => {
    const currentTemplateConfig = useSelector((state: RootState) => state.app.currentTemplateConfig);
    const currentTemplate = useSelector((state: RootState) => state.app.currentTemplate);
    const [visible, setVisible]: ReactState<boolean> = useState<boolean>(false);
    const formRef: React.RefObject<FormHelpers> = useRef<FormHelpers>(null);
    const [fromValue, setFromValue] = useState({
        id: '',
        taskName: '',
        customTemplateName: '',
        customTemplateDesc: '',
        currentTemplateConfig,
        saveAsCustomTemplate: false
    });
    const {t} = useTranslation();

    const open = (): void => setVisible(!visible);

    const createTask = (): void => {
        formRef.current?.validate().then(async (): Promise<void> => {
            let image: string = '';

            if (fromValue.currentTemplateConfig.config.background.image !== '') {
                try {
                    image = await fetch(`/api${fromValue.currentTemplateConfig.config.background.image}`)
                        .then((data: Response) => data.blob())
                        .then((img: Blob) => {
                            return new Promise((resolve, reject): void => {
                                const fr: FileReader = new FileReader();

                                fr.onloadend = (): void => resolve(fr.result as string ?? '');
                                fr.onerror = () => reject('');
                                fr.readAsDataURL(img);
                            });
                        });
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            }

            const requestData = {
                ...fromValue,
                currentTemplateConfig: {
                    ...fromValue.currentTemplateConfig,
                    config: {
                        ...fromValue.currentTemplateConfig.config,
                        video: {
                            ...fromValue.currentTemplateConfig.config.video,
                            duration: fromValue.currentTemplateConfig.config.video.duration < 100 ?
                                fromValue.currentTemplateConfig.config.video.duration * 1000 :
                                fromValue.currentTemplateConfig.config.video.duration
                        },
                        background: {
                            ...fromValue.currentTemplateConfig.config.background,
                            image
                        }
                    }
                }
            };

            Request.createTask({
                ...requestData
            }).then((): void => {
                Notification.message(t('createTaskSuccess'), 'success');
                setVisible(false);
            });
        });
    };

    useTemplateMessageListener('GET_CONFIG', (data: any): void => {
        setFromValue({
            ...fromValue,
            currentTemplateConfig: {
                ...currentTemplateConfig,
                data: data.data ?? [],
                config: {
                    ...currentTemplateConfig.config,
                    text: data.config.text
                }
            }
        });
    });

    useTemplateMessageListener('GET_TEMPLATE_DATA', (data): void => {
        setFromValue({
            ...fromValue,
            currentTemplateConfig: {
                ...currentTemplateConfig,
                data: data as any
            }
        });
    });

    useImperativeHandle(ref, (): ICreateTaskRef => ({
        open
    }));

    useEffect((): void => {
        if (visible) {
            PostMessage.send({
                type: 'GET_TEMPLATE_DATA',
                message: {}
            });
            PostMessage.send({
                type: 'GET_CONFIG',
                message: {}
            });
        }
    }, [visible]);

    useEffect((): void => {
        setFromValue({
            ...fromValue,
            id: currentTemplate.id,
            currentTemplateConfig
        });
    }, [currentTemplate, currentTemplateConfig]);

    return (
        <React.Fragment>
            <Modal
                title={t('createTask')}
                visible={visible}
                confirmText={t('confirm')}
                cancelText={t('cancel')}
                onCancel={(): void => setVisible(false)}
                onConfirm={(): void => {
                    createTask();
                }}
            >
                <Form
                    innerRef={formRef}
                    initialValues={fromValue}
                    labelPlacement="top"
                >
                    <FormItem
                        label={t('taskName')}
                        valueType={'string'}
                    >
                        <Input
                            value={fromValue.taskName}
                            placeholder={t('pleaseInput')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                const {target: {value}} = e;

                                setFromValue({
                                    ...fromValue,
                                    taskName: value
                                });
                            }}
                        />
                    </FormItem>
                    <YExtendTemplate show={fromValue.saveAsCustomTemplate}>
                        <FormItem
                            required
                            valueType={'string'}
                            label={t('customTemplateName')}
                        >
                            <Input
                                value={fromValue.customTemplateName}
                                placeholder={t('pleaseInput')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    const {target: {value}} = e;

                                    setFromValue({
                                        ...fromValue,
                                        customTemplateName: value
                                    });
                                }}
                            />
                        </FormItem>
                        <FormItem
                            required
                            valueType={'string'}
                            label={t('customTemplateDesc')}
                        >
                            <Input
                                value={fromValue.customTemplateDesc}
                                placeholder={t('pleaseInput')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    const {target: {value}} = e;

                                    setFromValue({
                                        ...fromValue,
                                        customTemplateDesc: value
                                    });
                                }}
                            />
                        </FormItem>
                    </YExtendTemplate>
                    <YExtendTemplate show={false}>
                        <FormItem label={t('saveAsCustomTemplate')}>
                            <Switch
                                checked={fromValue.saveAsCustomTemplate}
                                onChange={(e: boolean): void => {
                                    setFromValue({
                                        ...fromValue,
                                        saveAsCustomTemplate: e
                                    });
                                }}
                            />
                        </FormItem>
                    </YExtendTemplate>
                </Form>
            </Modal>
        </React.Fragment>
    );
});

Task.displayName = 'Task';

export default Task;
