import 'handsontable/dist/handsontable.full.min.css';
import {HotTable} from '@handsontable/react';
import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import Drawer from "@hi-ui/drawer";
import {Button, Space, Switch} from "@hi-ui/hiui";
import utils from "../utils";
import Hooks from "../bin/Hooks";
import {CellChange, ChangeSource} from "handsontable/common";
import PostMessage from "../lib/PostMessage";
import {registerAllModules} from 'handsontable/registry';
import {ReactState} from "../types/ReactTypes";
import {useTranslation} from "react-i18next";
import useTemplateMessageListener = Hooks.useTemplateMessageListener;

registerAllModules();

export interface IEditDataTable {
    open: () => void;
}

const EditDataTable: React.ForwardRefExoticComponent<React.RefAttributes<IEditDataTable>> = React.forwardRef((_props: {}, ref: React.ForwardedRef<IEditDataTable>) => {
    const [visible, setVisible]: ReactState<boolean> = useState<boolean>(false);
    const [data, setData] = useState<Array<Array<string | number>>>([[]]);
    const hotTableRef = useRef(null);
    const [isLiveUpdate, setIsLiveUpdate]: ReactState<boolean> = useState<boolean>(true);
    const [isChangeData, setIsChangeData]: ReactState<boolean> = useState<boolean>(false);
    const {t} = useTranslation();

    useImperativeHandle(ref, (): IEditDataTable => ({
        open
    }));

    useTemplateMessageListener('TEMPLATE_DATA', (e: Array<Array<string | number>>): void => {
        setData(e);
    });

    useEffect((): void => {
        if (isLiveUpdate) return;
        if (!visible && isChangeData) {
            sendData(processData(data));
            setIsChangeData(false);
        }
    }, [visible]);

    const open = (): void => {
        setVisible(!visible);
    };

    const selectLocalFile = (): void => {
        utils.selectFiles(false).then((file): void => {
            if (file.length === 1) {
                const fr: FileReader = new FileReader();

                fr.readAsText(file[0] as any);
                fr.onload = (res: ProgressEvent<FileReader>): void => {
                    try {
                        const _data = JSON.parse(res?.target?.result as string);

                        setData(_data);
                        sendData(_data);
                    } catch (e) {
                        console.log(e);
                    }
                };
            }

        });
    };
    const sendData = (_data: Array<Array<string | number>>): void => PostMessage.send({
        type: 'SET_DATA',
        message: _data
    });
    const processData = (_data: Array<Array<string | number>>): (number | string)[][] => {
        return _data.map((subArr: Array<any>) => {
            return subArr.filter((i: any): boolean => {
                return i;
            });
        }).filter((i: Array<any>): boolean => {
            return i.length > 0;
        });
    };
    // const exportDefaultData = (): void => {
    // };

    return (
        <Drawer
            title={t('editData')}
            width={1000}
            closeOnEsc
            preload
            visible={visible}
            onClose={(): void => {
                open();
            }}
        >
            <div>
                <div style={
                    {
                        marginBottom: '1rem'
                    }
                }>
                    <Space size={16}>
                        <Button type={'primary'} onClick={selectLocalFile}>{t('loadLocalData')}</Button>
                        <Switch
                            checked={isLiveUpdate}
                            onChange={(e: boolean): void => {
                                setIsLiveUpdate(e);
                            }}
                            content={[t('renewedOnTime'), t('renewedOnTime')]}
                        />
                        {/*<Button onClick={exportDefaultData}>导出默认数据</Button>*/}
                    </Space>
                </div>
                <div>
                    <HotTable
                        minRows={50}
                        minCols={100}
                        data={data}
                        ref={hotTableRef}
                        width="auto"
                        height="auto"
                        rowHeaders={true}
                        colHeaders={true}
                        colWidths={50}
                        rowHeights={20}
                        afterChange={(changes: CellChange[] | null, source: ChangeSource): void => {
                            if (source === 'edit') {
                                const hotInstance: any = hotTableRef.current;
                                const _data: (string | number)[][] = hotInstance.__hotInstance.getData();
                                const nd: (string | number)[][] = processData(_data);

                                if (isLiveUpdate)
                                    sendData(nd);
                                setIsChangeData(true);
                            }
                        }}
                        licenseKey="non-commercial-and-evaluation"
                        contextMenu={{
                            items: {
                                'row_above': {name: t('insertRowAbove')},
                                'row_below': {name: t('insertRowBelow')},
                                'col_left': {name: t('insertRowToLeft')},
                                'col_right': {name: t('insertRowToRight')},
                                '----------': {name: '---------'},
                                'remove_row': {name: t('deleteAnEntireLine')},
                                'remove_col': {name: t('deleteAnEntireColumn')},
                                '---------': {name: '---------'},
                                'copy': {name: `${t('copy')} (C)`},
                                'cut': {name: `${t('cut')} (X)`},
                                'paste': {name: `${t('paste')} (V)`},
                                '-----------': {name: '---------'},
                                'undo': {name: `${t('undo')} (Z)`}
                            }
                        }}
                    />
                </div>
            </div>
        </Drawer>
    );
});

EditDataTable.displayName = 'EditDataTable';

export default EditDataTable;
