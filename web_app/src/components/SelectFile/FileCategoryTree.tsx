import Tree, {EditableTreeProps, useTreeAction} from "@hi-ui/tree";
import React, {useEffect, useState} from "react";
import {FlattedTreeNodeData} from "@hi-ui/tree/lib/types/types";
import Request from "../../lib/Request";
import {ReactState} from "../../types/ReactTypes";
import Notification from "../../lib/Notification";
import {Button, Input, Modal, PopConfirm, TreeSelect} from "@hi-ui/hiui";
import {ICategory} from "./index";
import YExtendTemplate from "../YExtendTemplate";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();

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
            Notification.message(t('addSuccess'), 'success');
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
                    editPlaceholder={t('pleaseInput')}
                    expandedIds={activeIds}
                    menuOptions={[
                        {
                            type: "addChildNode",
                            title: t('addSubCategories')
                        },
                        {
                            type: "editNode",
                            title: t('editCategories')
                        },
                        {
                            title: t('deleteCategories'),
                            onClick(node, action): void {
                                action.closeMenu();
                                Modal.confirm({
                                    title: t('tip'),
                                    type: "warning",
                                    content: t('deleteConfirm'),
                                    onConfirm: (): void => {
                                        Request.deleteFileCategory(node.id as string).then((): void => {
                                            action.deleteNode();
                                            Notification.message(t('deleteSuccess'), 'success');
                                        }).catch((): void => {
                                            Notification.message(t('deleteCategoriesError'), 'error');
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
                    cancelText={t('cancel')}
                    confirmText={t('confirm')}
                    onConfirm={(): void => {
                        if (inputValue === '' || inputValue.length > 16)
                            return Notification.message(t('addCategoriesMaxLength'), 'error');
                        Request.addFileCategory({
                            id: '', name: inputValue
                        }).then((): void => {
                            setInputValue('');
                            Notification.message(t('addSuccess'), 'success');
                            onRefresh();
                        });
                    }}
                    content={
                        <Input
                            placeholder={t('pleaseInput')}
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
                        >{t('add')}</Button>
                    </div>
                </PopConfirm>
            </YExtendTemplate>
            <YExtendTemplate show={type == 'TreeSelect'}>
                <TreeSelect
                    clearable
                    placeholder={t('pleaseInput')}
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
