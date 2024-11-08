import React, {useEffect, useRef} from "react";
import Grid from "@hi-ui/grid";
import TemplatePreview from "../components/Preview";
import ProgressBar from "../components/ProgressBar";
import DesignConfigs from "../components/DesignConfigs";
import Header from "../components/Header";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import Storage from "../lib/Storage";
import {setCurrentTemplate} from "../lib/Store/AppStore";
import Task, {ICreateTaskRef} from "../components/Task";
import AudioPreview from "../components/AudioPreview";

const AppDesign = (): React.JSX.Element => {
    const dispatch: Dispatch = useDispatch();
    const currentTemplate = useSelector((state: RootState) => state.app.currentTemplate);
    const taskRef: React.RefObject<ICreateTaskRef> = useRef<ICreateTaskRef>(null);

    useEffect((): void => {
        if (currentTemplate.id === '') {
            const currentTemplate = JSON.parse(Storage.get('current_template') ?? '');

            if (Object.keys(currentTemplate).length > 0)
                dispatch(setCurrentTemplate(currentTemplate));
        }
    }, []);
    return (
        <div className={'data-visualization-design'}>
            <Header.Design
                onSynthesis={(): void => {
                    taskRef.current?.open('synthesis');
                }}
                onSave={(): void => {
                    taskRef.current?.open('savaAsTemplate');
                }}
            />
            <Task ref={taskRef}/>
            <div className={'app_position_relative'}>
                <div style={{
                    padding: "1.5rem"
                }}>
                    <Grid.Row style={{
                        height: '98%'
                    }} justify={'space-between'}>
                        <Grid.Col span={{lg: 12, xl: 16, md: 24, sm: 24, xs: 24}}>
                            <TemplatePreview/>
                            <ProgressBar/>
                            <AudioPreview/>
                        </Grid.Col>
                        <Grid.Col span={{lg: 10, xl: 6, md: 24, sm: 24, xs: 24}}>
                            <DesignConfigs/>
                        </Grid.Col>
                    </Grid.Row>
                </div>

            </div>
        </div>
    );
};

export default AppDesign;
