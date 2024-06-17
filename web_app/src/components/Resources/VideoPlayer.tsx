import React, {useImperativeHandle, useState} from "react";
import {Loading, Modal} from "@hi-ui/hiui";
import {ReactState} from "../../types/ReactTypes";
import YExtendTemplate from "../YExtendTemplate";
import {useTranslation} from "react-i18next";

export interface IVideoPlayerRef {
    play: (path: string) => void;
}

const VideoPlayer: React.ForwardRefExoticComponent<React.RefAttributes<IVideoPlayerRef>> = React.forwardRef((_props: React.RefAttributes<IVideoPlayerRef>, ref: React.ForwardedRef<IVideoPlayerRef>): React.JSX.Element => {
    const [visible, setVisible]: ReactState<boolean> = useState<boolean>(false);
    const [videoPath, setVideoPath]: ReactState<string> = useState<string>('');
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(true);
    const {t} = useTranslation();

    const play = (path: string): void => {
        setVisible(true);
        setLoading(true);
        setVideoPath(path);
    };

    useImperativeHandle(ref, (): IVideoPlayerRef => ({
        play
    }));

    return (
        <Modal
            visible={visible}
            title={t('preview')}
            width={'686px'}
            footer={false}
            onClose={(): void => {
                setVisible(false);
            }}
            onCancel={(): void => {
                setVisible(false);
            }}
        >
            <Loading visible={loading}>
                <YExtendTemplate show={visible}>
                    <video
                        controls
                        width={'640'}
                        src={`/api${videoPath}`}
                        data-lmo-t-url={videoPath}
                        style={{
                            borderRadius: '6px'
                        }}
                        onContextMenu={(e: React.MouseEvent<HTMLVideoElement, MouseEvent>): void => {
                            e.preventDefault();
                        }}
                        onCanPlay={(): void => {
                            setTimeout((): void => {
                                setLoading(false);
                            }, 500);
                        }}
                    />
                </YExtendTemplate>
            </Loading>
        </Modal>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;