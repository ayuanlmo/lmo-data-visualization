import * as React from "react";

type YExtendTemplateElementType = React.JSX.Element;
type YExtendTemplateChildrenElementType = React.JSX.Element;

export interface YExtendTemplateProps {
    children: YExtendTemplateElementType | YExtendTemplateElementType[];
    show?: boolean;
}

const YExtendTemplate = (props: YExtendTemplateProps): YExtendTemplateChildrenElementType => {
    const {
        children,
        show = true
    }: YExtendTemplateProps = props;

    if (!show) return <></>;

    if (Array.isArray(children))
        return <React.Fragment>{children.map(child => child)}</React.Fragment>;

    return children;
};

export default YExtendTemplate;
