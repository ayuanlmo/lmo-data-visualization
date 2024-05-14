import Tree, {EditableTreeProps, useTreeAction} from "@hi-ui/tree";
import React, {useEffect, useState} from "react";
import {FlattedTreeNodeData} from "@hi-ui/tree/lib/types/types";
import Request from "../../lib/Request";
import {ReactState} from "../../types/ReactTypes";
import Notification from "../../lib/Notification";
import {Button, Input, Modal, PopConfirm, TreeSelect} from "@hi-ui/hiui";
import {ICategory} from "./index";
import YExtendTemplate from "../YExtendTemplate";

interface ITreeActionProps {
    onSelectTree: (data: null | React.ReactText | string) => void;
    type?: 'TreeAction' | 'TreeSelect';
    value?: string;
}

const FileCategoryTree = (props: ITreeActionProps): React.JSX.Element => {
    const {
        onSelectTree,
        type = "TreeAction",
        value = ""
    }: ITreeActionProps = props;
    const TreeAction: React.ForwardRefExoticComponent<EditableTreeProps & React.RefAttributes<HTMLUListElement | null>> = useTreeAction(Tree);
    const [inputValue, setInputValue]: ReactState<string> = useState<string>('');
    const [categoryTree, setCategoryTree] = useState([]);
    const [activeIds, setActiveIds]: ReactState<Array<string>> = useState<Array<string>>([]);
    const [selectValue, setSelectValue]: ReactState<string | React.ReactText> = useState<string | React.ReactText>(value || '');

    const getFileCategory = (): void => {
        Request.getFileCategory().then((res) => {
            res.data.tree.map((i: ICategory) => {
                return convertNameToTitle(i);
            });
            setActiveIds(res.data.ids);
            setCategoryTree(res.data.tree);
        });
    };
    const convertNameToTitle = (node: ICategory): ICategory => {
        if (!node.hasOwnProperty('title'))
            node.title = node.name;
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach((i: ICategory): void => {
                convertNameToTitle(i);
            });
        }

        return node;
    };
    const add = (data: FlattedTreeNodeData): void => {
        const params: {
            name: string;
            parentId: string;
            id?: string;
        } = {
            name: data.title as string,
            parentId: data.parent?.id as string
        };

        if (!`${data.id}`.includes('.'))
            params.id = data.id as string;

        Request.addFileCategory(params).then((): void => {
            onRefresh();
            Notification.message('新增成功 ', 'success');
        });
    };
    const onRefresh = (): void => {
        getFileCategory();
    };

    useEffect((): void => {
        getFileCategory();
    }, []);

    return (
        <>
            <YExtendTemplate show={type === 'TreeAction'}>
                <TreeAction
                    showLine
                    expandOnSelect={false}
                    data={categoryTree}
                    editPlaceholder="请填写菜单"
                    expandedIds={activeIds}
                    menuOptions={[
                        {
                            type: "addChildNode",
                            title: "新建子分类"
                        },
                        {
                            type: "editNode",
                            title: "编辑当前分类"
                        },
                        {
                            title: "删除当前分类",
                            onClick(node, action) {
                                action.closeMenu();
                                Modal.confirm({
                                    title: "提示",
                                    type: "warning",
                                    content: "您确定删除吗？",
                                    onConfirm: (): void => {
                                        Request.deleteFileCategory({
                                            id: node.id
                                        }).then((): void => {
                                            action.deleteNode();
                                            Notification.message('删除成功', 'success');
                                        }).catch((): void => {
                                            Notification.message('删除失败,可能存在子分类而无法删除', 'error');
                                        });
                                    }
                                });
                            }
                        }
                    ]}
                    onSave={(data: FlattedTreeNodeData): void => {
                        add(data);
                    }}
                    onSelect={(e) => {
                        onSelectTree(e);
                    }}
                />
                <PopConfirm
                    title={'新增分类'}
                    placement={'right'}
                    onConfirm={(): void => {
                        if (inputValue === '' || inputValue.length > 16)
                            return Notification.message('分类名称不能为空或者超过16个字符', 'error');
                        Request.addFileCategory({
                            id: '', name: inputValue
                        }).then((): void => {
                            setInputValue('');
                            Notification.message('新增成功 ', 'success');
                            onRefresh();
                        });
                    }}
                    content={
                        <Input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                setInputValue(e.target.value);
                            }}
                        />
                    }
                >
                    <div
                        style={{
                            width: '88%',
                            margin: 'auto'
                        }}
                    >
                        <Button
                            type="primary"
                            size={'sm'}
                            style={{
                                width: '100%'
                            }}
                        >新增</Button>
                    </div>
                </PopConfirm>
            </YExtendTemplate>
            <YExtendTemplate show={type == 'TreeSelect'}>
                <TreeSelect
                    clearable
                    value={selectValue}
                    defaultExpandAll={true}
                    onChange={(e: React.ReactText | string): void => {
                        onSelectTree(e);
                        setSelectValue(e);
                    }}
                    data={categoryTree}
                />
            </YExtendTemplate>
        </>
    );
};

export default FileCategoryTree;
