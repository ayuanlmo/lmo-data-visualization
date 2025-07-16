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
import {NavigateFunction, useNavigate} from "react-router-dom";
import TemplateLayers from "../components/TemplateLayers";

const AppDesign = (): React.JSX.Element => {
    const dispatch: Dispatch = useDispatch();
    const currentTemplate = useSelector((state: RootState) => state.app.currentTemplate);
    const taskRef: React.RefObject<ICreateTaskRef> = useRef<ICreateTaskRef>(null);
    const navigate: NavigateFunction = useNavigate();

    useEffect((): void => {
        if (currentTemplate.id === '') {
            try {
                const currentTemplate = JSON.parse(Storage.get('current_template') ?? '');

                if (Object.keys(currentTemplate).length > 0)
                    dispatch(setCurrentTemplate(currentTemplate));
                else
                    navigate('/');
            } catch (e) {
                navigate('/');
            }
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
            <div className={'app_position_relative'} style={{
                height: 'calc(100vh - 13.24rem);',
                padding: '1.25rem'
            }}>

                <Grid.Row style={{
                    height: '98%'
                }} justify={'space-between'}>
                    <Grid.Col
                        style={{
                            width: '100%'
                        }}
                        span={{lg: 4, xl: 3, md: 4, sm: 24, xs: 24}}
                    >
                        <TemplateLayers/>
                    </Grid.Col>
                    <Grid.Col span={{lg: 12, xl: 16, md: 12, sm: 24, xs: 24}}>
                        <TemplatePreview/>
                        <ProgressBar/>
                        <AudioPreview/>
                    </Grid.Col>
                    <Grid.Col span={{lg: 8, xl: 4, md: 8, sm: 24, xs: 24}}>
                        <DesignConfigs/>
                    </Grid.Col>
                </Grid.Row>
            </div>
        </div>
    );
};

export default AppDesign;
