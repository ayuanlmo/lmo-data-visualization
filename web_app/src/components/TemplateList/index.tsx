import "./style.scss";
import React, {useEffect, useRef, useState} from "react";
import Request from "../../lib/Request";
import Notification from "../../lib/Notification";
import TemplateItem, {ITemplate} from "./TemplateItem";
import YExtendTemplate from "../YExtendTemplate";
import {Button, EmptyState, Grid, Input, Select, SelectMergedItem} from "@hi-ui/hiui";
import {SearchOutlined} from "@hi-ui/icons";
import {ReactState} from "../../types/ReactTypes";
import {useTranslation} from "react-i18next";

interface QueryParams {
    name: string;
    pageIndex: number;
    pageSize: number;
    type: string;
}

const TemplateList = (): React.JSX.Element => {
    const {t} = useTranslation();
    const [templates, setTemplates]: ReactState<Array<ITemplate>> = useState<Array<ITemplate>>([]);
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(false);
    const [uploading, setUploading]: ReactState<boolean> = useState<boolean>(false);
    const fileInputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [queryParams, setQueryParams]: ReactState<QueryParams> = useState({
        name: '',
        pageIndex: 0,
        pageSize: 50,
        type: ''
    });
    const templateType: SelectMergedItem[] = [
        {title: t('all'), id: "", disabled: false},
        {title: t('defaultTemplate'), id: "1", disabled: false},
        {title: t('customizeTemplate'), id: "0", disabled: false}
    ];

    const getTemplate = (): void => {
        setLoading(true);
        Request.getTemplate(queryParams).then(({data}): void => {
            setTemplates(data?.rows ?? []);
        }).finally((): void => {
            setTimeout((): void => {
                setLoading(false);
            }, 100);
        });
    };

    // 选中 .zip 后直接上传：后端校验必备文件并落库，成功即刷新列表。
    // 每次选择后清空 input.value，保证连选同一文件也能再次触发 change。
    const onTemplateFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file: File | undefined = e.target.files?.[0];

        e.target.value = '';

        if (!file) return;

        const formData: FormData = new FormData();
        formData.append('file', file);

        setUploading(true);
        Request.uploadTemplate(formData).then((): void => {
            Notification.message(`[${file.name}] ${t('uploadSuccess')}`, 'success');
            getTemplate();
        }).catch((): void => {
            Notification.openNotification(t('sysNotify'), t('uploadFailTip'), 'error');
        }).finally((): void => {
            setUploading(false);
        });
    };

    useEffect((): void => {
        getTemplate();
    }, []);

    return (
        <div className={'template-list'}>
            <input
                ref={fileInputRef}
                type={'file'}
                accept={'.zip'}
                style={{display: 'none'}}
                onChange={onTemplateFileChange}
            />
            <div className={'template-list-query'}>
                <Grid.Row gutter={true} justify={"flex-end"}>
                    <Grid.Col
                        span={{lg: 6, xl: 4, md: 12, sm: 12, xs: 12}}
                    >
                        <div className={'template-list-query-select'}>
                            <Select
                                placeholder={t('pleaseSelect')}
                                onChange={(e: React.ReactText): void => {
                                    setQueryParams({
                                        ...queryParams,
                                        type: `${e}`
                                    });
                                }}
                                style={{minWidth: "6rem"}}
                                data={templateType}
                                clearable={false}
                            />
                        </div>
                    </Grid.Col>
                    <Grid.Col span={{lg: 6, xl: 4, md: 12, sm: 12, xs: 12}}>
                        <Input
                            clearable
                            placeholder={t('enterNameToStartQuery')}
                            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                                setQueryParams({
                                    ...queryParams,
                                    name: (e.target as HTMLInputElement).value
                                });
                            }}
                            append={
                                <Button
                                    loading={loading}
                                    icon={
                                        <SearchOutlined/>
                                    }
                                    onClick={(): void => {
                                        getTemplate();
                                    }}
                                    type={'primary'}
                                />
                            }
                        />
                    </Grid.Col>
                    <Grid.Col span={{lg: 6, xl: 4, md: 12, sm: 12, xs: 12}}>
                        <Button
                            type={'primary'}
                            loading={uploading}
                            onClick={(): void => {
                                fileInputRef.current?.click();
                            }}
                        >
                            {t('upload')}
                        </Button>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <YExtendTemplate show={templates.length > 0}>
                <Grid.Row gutter>
                    {
                        templates.map((i: ITemplate) => <TemplateItem onRefresh={(): void => {
                            getTemplate();
                        }} key={i.id} data={i}/>)
                    }
                </Grid.Row>
            </YExtendTemplate>
            <YExtendTemplate show={templates.length === 0}>
                <EmptyState title={t('noData')}/>
            </YExtendTemplate>
        </div>
    );
};

export default TemplateList;
