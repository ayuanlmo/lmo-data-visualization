import * as React from "react";

type YExtendTemplateElementType = React.JSX.Element;
type YExtendTemplateChildrenElementType = YExtendTemplateElementType | Array<YExtendTemplateElementType>;

export interface YExtendTemplateProps {
    children: YExtendTemplateElementType
    show?: boolean;
}

function YExtendTemplate(props: YExtendTemplateProps): YExtendTemplateChildrenElementType {
    const {
        children,
        show = true
    } = props;

    if (Array.isArray(children) && show)
        return children.map((i: React.JSX.Element) => i);

    return show ? children : <></>;
}

export default YExtendTemplate;
