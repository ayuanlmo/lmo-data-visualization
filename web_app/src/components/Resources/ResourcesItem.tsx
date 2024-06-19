import React, {useEffect, useState} from "react";
import {Dropdown, EllipsisTooltip, Loading} from "@hi-ui/hiui";
import {DeleteOutlined, DownloadOutlined} from "@hi-ui/icons";
import {useTranslation} from "react-i18next";
import YExtendTemplate from "../YExtendTemplate";
import {ReactState} from "../../types/ReactTypes";
import Utils from "../../utils";

export interface IResourcesItem {
    id: string;
    name: string;
    filePath: string;
    createTime: string;
    gifPath: string;
    videoCover: string;
}

export interface IResourcesItemProps {
    data: IResourcesItem;
    onPlay?: (item: IResourcesItem) => void;
    onDownload?: (item: IResourcesItem, type: 'video' | 'gif') => void;
    onDelete?: (id: string) => void;
}

const ResourcesItem = (props: IResourcesItemProps): React.JSX.Element => {
    const {data, onDownload, onPlay, onDelete} = props;
    const {t} = useTranslation();
    const [isHover, setIsHover]: ReactState<boolean> = useState<boolean>(false);
    const [isLoading, setIsLoading]: ReactState<boolean> = useState<boolean>(true);
    const downloadTypes = [
        {
            id: 0,
            title: t('video')
        },
        {
            id: 1,
            title: "GIF"
        }
    ];

    useEffect((): void => {
        if (isHover && !isLoading)
            setIsLoading(true);
    }, [isHover]);

    return (
        <div className={'c-resources-item app_position_relative'}>
            <YExtendTemplate show={isHover}>
                <div
                    className={'c-resources-item-cover-box c-resources-item-mask app_position_absolute app_none_user_select app_cursor_pointer'}
                    onMouseLeave={(): void => {
                        setIsHover(false);
                    }}
                >
                    <div className={'c-resources-item-option app_flex_box app_position_relative'}>
                        <Dropdown
                            data={downloadTypes}
                            onClick={(e: React.ReactText): void => {
                                onDownload && onDownload(data, e === 0 ? 'video' : 'gif');
                            }}
                        >
                            <div
                                style={{
                                    background: '#237FFA'
                                }}
                                className={'c-resources-item-option-item template-item-mask-option-item-danger app_cursor_pointer'}>
                                <DownloadOutlined className={'app_position_relative'}/>
                            </div>
                        </Dropdown>
                        <div
                            style={{
                                background: '#BE1919'
                            }}
                            className={'c-resources-item-option-item template-item-mask-option-item-danger app_cursor_pointer'}>
                            <DeleteOutlined
                                className={'app_position_relative'}
                                onClick={(): void => {
                                    onDelete && onDelete(data.id);
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className={'c-resources-item-play-box app_position_absolute app_cursor_pointer'}
                        onClick={(): void => {
                            onPlay && onPlay(data);
                        }}
                    >
                        <div className={'c-resources-item-play-box-content app_position_relative'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16"
                                 fill="none">
                                <path
                                    d="M9.82036 7.60885L0.786997 0.106C0.479041 -0.14291 -6.96303e-07 0.0704403 -6.77651e-07 0.497143L-2.17308e-08 15.5029C-3.07907e-09 15.9296 0.479042 16.1429 0.786997 15.894L9.82036 8.39114C10.0599 8.17779 10.0599 7.82221 9.82036 7.60885Z"
                                    fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </YExtendTemplate>
            <div
                className={'c-resources-item-cover-box app_cursor_pointer'}
                onMouseEnter={(): void => {
                    setIsHover(true);
                }}
            >
                <Loading visible={isLoading}>
                    <img
                        src={isHover ? `/api${data.gifPath}` : `/api${data.videoCover}`}
                        alt={data.name ?? ''}
                        onLoad={
                            (): void => {
                                setIsLoading(false);
                            }
                        }
                    />
                </Loading>
            </div>
            <div className={'c-resources-item-info'}>
                <div className={'c-resources-item-info-content'}>
                    <EllipsisTooltip className={'c-resources-item-info-title'}>
                        {data.name}
                    </EllipsisTooltip>
                    <div className={'c-resources-item-info-time'}>
                        {Utils.formatDate(Number(data.createTime))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourcesItem;
