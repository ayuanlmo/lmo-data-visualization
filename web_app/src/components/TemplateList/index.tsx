import "./style.scss";
import React from "react";
import Grid from "@hi-ui/grid"

function TemplateList(): React.JSX.Element {
    const {Row, Col} = Grid;
    const colSpan = {lg: 6, xl: 4, md: 6, sm: 12, xs: 24} as const;

    return (
        <div className={'template-list'}>
            <Row gutter>
                <Col span={colSpan}>
                    <div className={'template-item'}>

                    </div>
                </Col>
                <Col span={colSpan}>
                    <div className={'template-item'}></div>
                </Col>
                <Col span={colSpan}>
                    <div className={'template-item'}></div>
                </Col>
                <Col span={colSpan}>
                    <div className={'template-item'}></div>
                </Col>
                <Col span={colSpan}>
                    <div className={'template-item'}></div>
                </Col>
                <Col span={colSpan}>
                    <div className={'template-item'}></div>
                </Col>
                <Col span={colSpan}>
                    <div className={'template-item'}></div>
                </Col>

            </Row>

        </div>
    )
}

export default TemplateList;