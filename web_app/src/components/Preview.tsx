import React, {useEffect, useRef, useState} from "react";
import {useEventListener} from "../bin/Hooks";
import Loading from "@hi-ui/loading";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import Notification from "../lib/Notification";
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {ReactState} from "../types/ReactTypes";
import postMessage from "../lib/PostMessage";

interface ICurrentTemplate {
    cover: string;
    createTime: string;
    description: string;
    id: string;
    name: string;
    path: string;
    type: number;
}

const TemplatePreview = (): React.JSX.Element => {
    const templatePreviewRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const iframeRef: React.RefObject<HTMLIFrameElement> = useRef<HTMLIFrameElement>(null);
    const [iframeStyle, setIframeStyle]: ReactState<object> = useState<object>({});
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(true);
    const currentTemplate: ICurrentTemplate = useSelector((state: RootState) => state.app.currentTemplate);
    const currentTemplateVideoConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.video);
    const navigate: NavigateFunction = useNavigate();

    const calculateAspectRatio = (width: number): [number, number] => {
        return [width, width / 16 * 9];
    };
    const initHeight = (): void => {
        const [, height] = calculateAspectRatio(templatePreviewRef.current?.offsetWidth || 0);

        templatePreviewRef.current && (templatePreviewRef.current.style.height = `${height}px`);
    };
    const initPlayerSize = (): void => {
        if (!iframeRef.current || !templatePreviewRef.current) return;

        let scale: number = 0;
        const width: number = templatePreviewRef.current.offsetWidth;
        const height: number = templatePreviewRef.current.offsetHeight;
        const clarity = getClarity(currentTemplateVideoConfig.clarity);
        const baseWidth: number = clarity.width;
        const baseHeight: number = clarity.height;
        const widthRatio: number = width / baseWidth;
        const heightRatio: number = height / baseHeight;

        scale = Math.min(widthRatio, heightRatio);

        iframeRef.current.contentWindow?.document?.body?.setAttribute('style', ` width: ${baseWidth}px; height:${baseHeight}px;`);

        setIframeStyle({
            transform: `scale(${scale})`,
            width: `${baseWidth}px`,
            height: `${baseHeight}px`
        });
    };

    const getClarity = (clarity: string) => {
        switch (clarity) {
            case '1080P':
                return {
                    width: 1920,
                    height: 1080
                };
            case '2K':
                return {
                    width: 2560,
                    height: 1440
                };
            case '4K':
                return {
                    width: 4096,
                    height: 2160
                };
            default:
                return {
                    width: 1920,
                    height: 1080
                };
        }
    };

    const toTemplateList = (): void => {
        Notification.openNotification('错误', '模板加载失败，它貌似并不存在', 'error');
        setTimeout((): void => {
            navigate('/', {
                replace: true
            });
        }, 1000);
    };

    useEffect((): void => {
        initHeight();
        initPlayerSize();
        postMessage.send({
            type: 'VIDEO_CONFIG_CHANGE',
            message: {...currentTemplateVideoConfig}
        });
    }, [templatePreviewRef, currentTemplateVideoConfig]);

    useEventListener('resize', (): void => {
        initHeight();
        initPlayerSize();
    });
    return (
        <Loading content={'初始化模板...'} visible={loading}>
            <div ref={templatePreviewRef} className={'template-preview'}>
                <iframe
                    onError={(): void => {
                        toTemplateList();
                    }}
                    onLoad={(): void => {
                        const iframeHtml: string = iframeRef.current?.contentWindow?.document?.body.innerHTML || '';

                        if (iframeHtml === '' || iframeHtml.includes('Not found.'))
                            toTemplateList();
                        setLoading(false);
                    }} style={iframeStyle} ref={iframeRef} src={`/api${currentTemplate.path}`}/>
            </div>
        </Loading>
    );
};

export default TemplatePreview;
