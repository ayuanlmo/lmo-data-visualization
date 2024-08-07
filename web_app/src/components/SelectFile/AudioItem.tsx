import {Button, Card, EllipsisTooltip, Tag} from "@hi-ui/hiui";
import React, {useEffect, useState} from "react";
import {ReactState} from "../../types/ReactTypes";
import {IImageItem} from "./ImageList";
import {useTranslation} from "react-i18next";
import YExtendTemplate from "../YExtendTemplate";

export interface IAudioItemProps {
    readonly onPlay?: (item: IAudioItem) => void;
    readonly onPause?: () => void;
    playing: boolean;
    readonly item: IAudioItem;
    id: string;
    currentSchedule: number;
    readonly progressChange?: (cp: number) => void;
    readonly onEdit?: (item: IImageItem) => void;
    readonly onDelete?: (item: IImageItem) => void;
    readonly onUse?: (item: IImageItem) => void;
    isUse: boolean;
}

export interface IAudioItem extends IImageItem {
    cover: string | null;
}

const AudioItem = (props: IAudioItemProps): React.JSX.Element => {
    const {
        onPlay,
        onPause,
        playing = false,
        item,
        id,
        currentSchedule,
        progressChange,
        onEdit,
        onDelete,
        onUse,
        isUse
    }: IAudioItemProps = props;
    const elRef: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);
    const [currentProgress, setCurrentProgress]: ReactState<number> = useState<number>(0);
    const {t} = useTranslation();

    const mousedownHandler = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        if (id !== item.id)
            return;

        const mx: number = elRef.current?.getBoundingClientRect().left ?? 0;
        const rw: number = elRef.current?.offsetWidth ?? 0;
        const bodyMousemove = (evt: MouseEvent): void => {
            const value: number = Number((Math.min(1, Math.max(0, (evt.clientX - mx) / rw)) * 100).toFixed(0));
            
            evt.preventDefault();
            evt.stopPropagation();
            setCurrentProgress(value);
            progressChange && progressChange(value);
        };
        const bodyMouseup = (e: MouseEvent): void => {
            e.preventDefault();
            e.stopPropagation();
            document.removeEventListener("mousemove", bodyMousemove);
            document.removeEventListener("mouseup", bodyMouseup);
        };

        document.addEventListener('mousemove', bodyMousemove);
        document.addEventListener("mouseup", bodyMouseup);
    };

    useEffect((): void => {
        if (currentSchedule === 0)
            setCurrentProgress(0);
        if (playing && id === item.id)
            setCurrentProgress(currentSchedule);
    }, [currentSchedule]);

    useEffect((): () => void => {
        if (playing && id === item.id)
            elRef.current?.addEventListener('mousedown', mousedownHandler);

        return (): void => {
            elRef.current?.removeEventListener('mousedown', mousedownHandler);
        };
    }, [playing, id]);

    return (
        <Card
            title={
                <div className={'app_flex_box'}>
                    <div>
                        <EllipsisTooltip className={'c-audio-item-name'}>
                            {item.name}
                        </EllipsisTooltip>
                    </div>
                    <Tag
                        size={'sm'}
                        type="primary"
                        appearance="solid"
                        style={{
                            marginLeft: '1rem'
                        }}
                    >
                        {item.type}
                    </Tag>
                </div>
            }
            size={'sm'}
            extra={
                <>
                    <Button
                        size={'sm'}
                        type={'primary'}
                        onClick={(): void => {
                            if (playing && id === item.id)
                                onPause && onPause();
                            else
                                onPlay && onPlay(item);
                        }}
                    >
                        {
                            playing && id === item.id ? t('pause') : t('play')
                        }
                    </Button>
                    <YExtendTemplate show={isUse}>
                        <Button
                            size={'sm'}
                            type={'secondary'}
                            onClick={(): void => {
                                onUse && onUse(item);
                            }}
                        >
                            {t('use')}
                        </Button>
                    </YExtendTemplate>
                    <YExtendTemplate show={!isUse}>
                        <Button
                            size="sm"
                            type="default"
                            onClick={(): void => {
                                onEdit && onEdit(item);
                            }}
                        >
                            {t('edit')}
                        </Button>
                        <Button
                            size="sm"
                            type="danger"
                            onClick={(): void => {
                                onDelete && onDelete(item);
                            }}
                        >
                            {t('delete')}
                        </Button>
                    </YExtendTemplate>
                </>
            }
        >
            <div
                className={'c-audio-list-item app_position_relative'}
                style={{
                    backgroundImage: `url("${'/api' + item.cover}")`
                }}
                ref={elRef}
            >
                <div
                    className={'c-audio-list-item-time-line app_position_absolute app_cursor_pointer`'}
                    style={{
                        left: currentProgress + '%'
                    }}
                />
            </div>
        </Card>
    );
};

export default AudioItem;
