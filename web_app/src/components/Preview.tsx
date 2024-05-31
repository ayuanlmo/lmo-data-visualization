import React, {useEffect, useRef, useState} from "react";
import {useEventListener} from "../bin/Hooks";
import Loading from "@hi-ui/loading";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import Notification from "../lib/Notification";
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {ReactState} from "../types/ReactTypes";

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
    const navigate: NavigateFunction = useNavigate();

    const calculateAspectRatio = (width: number): [number, number] => {
        return [width, width / 16 * 9];
    };
    const initHeight = (): void => {
        const [, height] = calculateAspectRatio(templatePreviewRef.current?.offsetWidth || 0);

        templatePreviewRef.current && (templatePreviewRef.current.style.height = `${height}px`);
    };
    const initPlayerSize = (): void => {
        if (!iframeRef.current) return;
        if (!templatePreviewRef.current) return;

        const width: number = templatePreviewRef.current?.offsetWidth;
        const height: number = templatePreviewRef.current?.offsetHeight;
        let scale: number = 0;

        if (width / 1920 > width / 1080)
            scale = height / 1080;
        else
            scale = width / 1920;

        setIframeStyle({
            transform: `scale( ${scale} )`,
            width: `1920px`,
            height: `1080px`
        });
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
    }, [templatePreviewRef]);

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
