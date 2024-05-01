import React, {useEffect, useRef} from "react";

export interface ITHTMLTemplateProps {
    content: string;
}

const THTMLTemplate = (props: ITHTMLTemplateProps): React.JSX.Element => {
    const {content}: ITHTMLTemplateProps = props;
    const mainElRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useEffect((): void => {
        if (mainElRef.current)
            mainElRef.current.innerHTML = content;
    }, [props]);

    return (
        <React.Fragment>
            <main ref={mainElRef}/>
        </React.Fragment>
    );
};

export default THTMLTemplate;