import React, {useEffect, useImperativeHandle, useState} from "react";
import AudioItem, {IAudioItem} from "./AudioItem";
import AudioPlayer from "../../lib/AudioPlayer";
import {ReactState} from "../../types/ReactTypes";
import Request from "../../lib/Request";
import {TFileType} from "./index";
import {EmptyState, Loading, Scrollbar, Space} from "@hi-ui/hiui";
import YExtendTemplate from "../YExtendTemplate";
import {IImageItem} from "./ImageList";
import {useTranslation} from "react-i18next";

export interface IAudioListProps {
    query: object;
    readonly fileType: TFileType;
    setPageTotal: React.Dispatch<React.SetStateAction<number>>;
    modalVisible: boolean;
    isUse: boolean;
    readonly onEdit?: (item: IImageItem) => void;
    readonly onDelete?: (item: IImageItem) => void;
    readonly onUse?: (item: IImageItem) => void;
}

export interface IAudioListRef {
    getFileList: () => void;
}

const player: AudioPlayer = new AudioPlayer('');
const playerRef: HTMLAudioElement = player.getRef();

const AudioList = React.forwardRef((props: IAudioListProps, ref: React.ForwardedRef<IAudioListRef>) => {
    const {
        query,
        fileType,
        setPageTotal,
        modalVisible,
        onEdit,
        onDelete,
        onUse,
        isUse
    }: IAudioListProps = props;
    const [isPlaying, setIsPlaying]: ReactState<boolean> = useState<boolean>(false);
    const [fileList, setFileList]: ReactState<Array<IAudioItem>> = useState<Array<IAudioItem>>([]);
    const [playerId, setPlayerId]: ReactState<string> = useState<string>('');
    const [currentSchedule, setCurrentSchedule]: ReactState<number> = useState<number>(0);
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(true);
    const {t} = useTranslation();

    const getFileList = (): void => {
        if (fileType === 'audio') {
            setLoading(true);
            Request.getFileList({...query}).then((res): void => {
                setFileList(res.data.rows);
                setPageTotal(res.data.total);
            }).finally((): void => {
                setLoading(false);
            });
        }
    };
    const playerPlayingHandler = (): void => {
        setIsPlaying(true);
    };
    const playerEndedHandler = (): void => {
        setIsPlaying(false);
        setCurrentSchedule(0);
    };
    const playerPauseHandler = (): void => {
        setIsPlaying(false);
    };
    const playerTimeupdateHandler = (): void => {
        const percent: number = Number((playerRef.currentTime / playerRef.duration * 100).toFixed(0));

        if (!isNaN(percent))
            setCurrentSchedule(percent);
    };

    useImperativeHandle(ref, (): IAudioListRef => ({
        getFileList
    }));

    useEffect((): () => void => {
        player.addEventListener('playing', playerPlayingHandler);
        player.addEventListener('ended', playerEndedHandler);
        player.addEventListener('pause', playerPauseHandler);
        player.addEventListener('timeupdate', playerTimeupdateHandler);

        return (): void => {
            player.removeEventListener('playing', playerPlayingHandler);
            player.removeEventListener('ended', playerEndedHandler);
            player.removeEventListener('pause', playerPauseHandler);
            player.removeEventListener('timeupdate', playerTimeupdateHandler);
        };
    }, []);

    useEffect((): void => {
        if (isPlaying)
            player.pause();
    }, [modalVisible]);

    useEffect((): void => {
        getFileList();
    }, [query]);

    return (
        <div className={'c-audio-list'}>
            <Scrollbar>
                <Loading visible={loading}>
                    <Space direction={'column'} size={8}>
                        {
                            fileList.map((i: IAudioItem): React.JSX.Element => {
                                return (
                                    <AudioItem
                                        item={i}
                                        key={i.id}
                                        id={playerId}
                                        playing={isPlaying}
                                        isUse={isUse}
                                        onEdit={(data: IImageItem): void => {
                                            onEdit && onEdit(data);
                                        }}
                                        onDelete={(data: IImageItem): void => {
                                            onDelete && onDelete(data);
                                        }}
                                        onUse={onUse}
                                        progressChange={(cp: number): void => {
                                            if (isPlaying) {
                                                setCurrentSchedule(cp);
                                                playerRef.currentTime = playerRef.duration * cp / 100;
                                            }
                                        }}
                                        currentSchedule={currentSchedule}
                                        onPlay={async (item: IAudioItem): Promise<void> => {
                                            if (item.id === playerId)
                                                await player.continue();
                                            else {
                                                await player.pause();
                                                await player.setSrc(`${location.origin}/api${item.path}`);
                                                player.play();
                                            }
                                            setIsPlaying(true);
                                            setPlayerId(item.id);
                                        }}
                                        onPause={async (): Promise<void> => {
                                            await player.pause();
                                            setIsPlaying(false);
                                        }}
                                    />
                                );
                            })
                        }
                    </Space>
                </Loading>
            </Scrollbar>
            <YExtendTemplate show={fileList.length === 0}>
                <EmptyState title={t('noData')}/>
            </YExtendTemplate>
        </div>
    );
});

AudioList.displayName = 'AudioList';

// const AudioList = (props: IAudioListProps): React.JSX.Element => {
//
// };

export default AudioList;
