import "./style.scss";
import React, {useEffect, useState} from "react";
import Request from "../../lib/Request";
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

    useEffect((): void => {
        getTemplate();
    }, []);

    return (
        <div className={'template-list'}>
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
                                style={{width: "6rem"}}
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
