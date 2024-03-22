import "./style.scss";
import React, {useEffect, useState} from "react";
import Grid from "@hi-ui/grid";
import Request from "../../lib/Request";
import TemplateItem, {ITemplate} from "./TemplateItem";
import EmptyState from "@hi-ui/empty-state";
import YExtendTemplate from "../YExtendTemplate";
import {Button, ColProps, Input, RowProps, Select} from "@hi-ui/hiui";
import {SearchOutlined} from "@hi-ui/icons";

interface QueryParams {
    name: string;
    pageIndex: number;
    pageSize: number;
    type: string;
}

function TemplateList(): React.JSX.Element {
    const {Row, Col}:
        {
            Row: React.ForwardRefExoticComponent<RowProps & React.RefAttributes<HTMLDivElement | null>>;
            Col: React.ForwardRefExoticComponent<ColProps & React.RefAttributes<HTMLDivElement | null>>
        } = Grid;
    const [templates, setTemplates]: [
        ITemplate[], React.Dispatch<React.SetStateAction<ITemplate[]>>] = useState<Array<ITemplate>>([]);
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [queryParams, setQueryParams]: [QueryParams, React.Dispatch<React.SetStateAction<QueryParams>>] = useState({
        name: '',
        pageIndex: 0,
        pageSize: 50,
        type: ''
    });
    const [templateType] = React.useState([
        {title: "全部", id: "", disabled: false},
        {title: "预制", id: "0", disabled: false},
        {title: "自定义", id: "1", disabled: false}
    ]);
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
                <Row gutter={true} justify={"flex-end"}>
                    <Col
                        span={{lg: 6, xl: 4, md: 12, sm: 12, xs: 12}}
                    >
                        <div className={'template-list-query-select'}>
                            <Select
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
                    </Col>
                    <Col span={{lg: 6, xl: 4, md: 12, sm: 12, xs: 12}}>
                        <Input
                            clearable
                            placeholder={'输入名称开始查询'}
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
                    </Col>
                </Row>
            </div>
            <YExtendTemplate show={templates.length > 0}>
                <Row gutter>
                    {
                        templates.map((i: ITemplate) => <TemplateItem onRefresh={(): void => {
                            getTemplate();
                        }} key={i.id} data={i}/>)
                    }
                </Row>
            </YExtendTemplate>
            <YExtendTemplate show={templates.length === 0}>
                <EmptyState/>
            </YExtendTemplate>
        </div>
    );
}

export default TemplateList;
