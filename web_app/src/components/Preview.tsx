import React, {useEffect, useRef} from "react";
import {useEventListener} from "../bin/Hooks";

function TemplatePreview(): React.JSX.Element {
    const templatePreviewRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const calculateAspectRatio = (width: number): [number, number] => {
        return [width, width / 16 * 9];
    };
    const initHeight = (): void => {
        const [, height] = calculateAspectRatio(templatePreviewRef.current?.offsetWidth || 0);

        templatePreviewRef.current && (templatePreviewRef.current.style.height = `${height}px`);
    };

    useEffect((): void => {
        initHeight();
    }, [templatePreviewRef]);

    useEventListener('resize', (): void => {
        initHeight();
    });
    return (
        <div ref={templatePreviewRef} className={'template-preview'}></div>
    );
}

export default TemplatePreview;