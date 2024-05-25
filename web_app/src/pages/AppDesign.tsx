import React, {useEffect} from "react";
import Grid from "@hi-ui/grid";
import TemplatePreview from "../components/Preview";
import ProgressBar from "../components/ProgressBar";
import DesignConfigs from "../components/DesignConfigs";
import YExtendTemplate from "../components/YExtendTemplate";
import Header from "../components/Header";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import Storage from "../lib/Storage";
import {setCurrentTemplate} from "../lib/Store/AppStore";

const AppDesign = (): React.JSX.Element => {
    const dispatch: Dispatch = useDispatch();
    const currentTemplate = useSelector((state: RootState) => state.app.currentTemplate);

    useEffect((): void => {
        if (currentTemplate.id === '') {
            const currentTemplate = JSON.parse(Storage.get('current_template') ?? '');

            if (Object.keys(currentTemplate).length > 0)
                dispatch(setCurrentTemplate(currentTemplate));
        }
    }, []);
    return (
        <div className={'data-visualization-design'}>
            <Header.Design/>
            <div className={'app_position_relative'}>
                <div style={{
                    padding: "1.5rem"
                }}>
                    <Grid.Row style={{
                        height: '98%'
                    }} justify={'space-between'}>
                        <YExtendTemplate show={true}>
                            <Grid.Col span={{lg: 16, xl: 18, md: 24, sm: 24, xs: 24}}>
                                <TemplatePreview/>
                                <ProgressBar/>
                            </Grid.Col>
                            <Grid.Col span={{lg: 7, xl: 5.5, md: 24, sm: 24, xs: 24}}>
                                <DesignConfigs/>
                            </Grid.Col>
                        </YExtendTemplate>
                    </Grid.Row>
                </div>

            </div>
        </div>
    );
};

export default AppDesign;
