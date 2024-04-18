import "./style/AppDesign.scss";
import "./style/AppDesign-Dack.scss";
import "./style/AppDesign-Light.scss";
import React from "react";
import DesignHeader from "../components/DesignHeader";
import Grid from "@hi-ui/grid";
import TemplatePreview from "../components/Preview";
import ProgressBar from "../components/ProgressBar";
import DesignConfigs from "../components/DesignConfigs";
import YExtendTemplate from "../components/YExtendTemplate";
import {ColProps, RowProps} from "@hi-ui/hiui";


const AppDesign = (): React.JSX.Element => {
    const {Row, Col}: {
        Row: React.ForwardRefExoticComponent<RowProps & React.RefAttributes<HTMLDivElement | null>>;
        Col: React.ForwardRefExoticComponent<ColProps & React.RefAttributes<HTMLDivElement | null>>
    } = Grid;

    return (
        <div className={'data-visualization-design'}>
            <DesignHeader/>

            <div className={'app_position_relative'}>
                <div style={{
                    padding: "1.5rem"
                }}>
                    <Row style={{
                        height: '98%'
                    }} justify={'space-between'}>
                        <YExtendTemplate show={true}>
                            <Col span={{lg: 16, xl: 18, md: 24, sm: 24, xs: 24}}>
                                <TemplatePreview/>
                                <ProgressBar/>
                            </Col>
                            <Col span={{lg: 7, xl: 5.5, md: 24, sm: 24, xs: 24}}>
                                <DesignConfigs/>
                            </Col>
                        </YExtendTemplate>
                    </Row>
                </div>

            </div>
        </div>
    );
};

export default AppDesign;
