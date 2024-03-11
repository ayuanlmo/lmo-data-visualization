import "./AppDesign.scss";
import React from "react";
import DesignHeader from "../components/DesignHeader";
import Grid from "@hi-ui/grid";
import TemplatePreview from "../components/Preview";
import ProgressBar from "../components/ProgressBar";
import DesignConfigs from "../components/DesignConfigs";

function AppDesign(): React.JSX.Element {
    const {Row, Col} = Grid;

    return (
        <div className={'data-visualization-design'}>
            <DesignHeader/>

            <div className={'app_position_relative'} style={{
                width: "calc(100% - (2.5rem * 2))",
                margin: "1.5rem auto"
            }}>
                <Row justify={'space-between'}>
                    <Col span={{lg: 16, xl: 16, md: 24, sm: 24, xs: 24}}>
                        <TemplatePreview/>
                        <ProgressBar/>
                    </Col>
                    <Col span={{lg: 7, xl: 7.5, md: 24, sm: 24, xs: 24}}>
                        <DesignConfigs/>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default AppDesign;