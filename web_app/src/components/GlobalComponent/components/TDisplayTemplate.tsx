import React, {useState} from "react";
import {ReactState} from "../../../types/ReactTypes";

type TChildren = React.JSX.Element | React.JSX.Element[] | string[] | string | number | number[];

interface TDisplayTemplateProps {
    show: boolean;
    children: TChildren;
    style?: React.CSSProperties | undefined;
}

const TDisplayTemplate = (props: TDisplayTemplateProps): React.JSX.Element => {
    const {show, children, style = {}} = props;
    const [catchTemplate]: ReactState<TChildren> = useState<TChildren>(children);

    return (
        <main
            style={{
                display: show ? 'block' : 'none',
                ...style
            }}>
            {catchTemplate}
        </main>
    );
};

export default TDisplayTemplate;