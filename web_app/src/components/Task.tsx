import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Form, FormHelpers, FormItem, Input, Modal, Switch} from '@hi-ui/hiui';
import {RootState} from "../lib/Store";
import {ReactState} from "../types/ReactTypes";
import YExtendTemplate from "./YExtendTemplate";
import Hooks from "../bin/Hooks";
import PostMessage from "../lib/PostMessage";
import Request from "../lib/Request";
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

    const open = (): void => setVisible(!visible);

    const createTask = (): void => {
        formRef.current?.validate().then((): void => {
            Request.createTask(fromValue).then((): void => {
                setVisible(false);
            });
        });
    };

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
        if (visible)
            PostMessage.send({
                type: 'GET_TEMPLATE_DATA',
                message: {}
            });
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
                title={'创建合成'}
                visible={visible}
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
                        label={'任务名称'}
                        valueType={'string'}
                    >
                        <Input
                            value={fromValue.taskName}
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
                            label={'自定义模板名称'}
                        >
                            <Input
                                value={fromValue.customTemplateName}
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
                            label={'自定义模板介绍'}
                        >
                            <Input
                                value={fromValue.customTemplateDesc}
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
                        <FormItem label={'是否保存为自定义模板'}>
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
