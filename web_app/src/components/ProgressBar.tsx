import React from "react";
import Grid from "@hi-ui/grid";

const ProgressBar = (): React.JSX.Element => {
    // const colspanIcon = {lg: 2, xl: 2, md: 2, sm: 2, xs: 2};
    const colspanTime = {lg: 4, xl: 3, md: 4, sm: 5, xs: 6};
    const colspanSlider = {lg: 16, xl: 20, md: 18, sm: 16, xs: 14};

    return (
        <div className={'progress-bar app_none_user_select'}>
            <div className={'progress-bar-content'}>
                <Grid.Row justify={'space-between'}>
                    <Grid.Col span={1}>
                        <div className={'progress-bar-play-icon app_cursor_pointer'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"
                                 fill="none">
                                <circle cx="17" cy="17" r="17" fill="#0688E5"/>
                                <path
                                    d="M22.9063 17.1562L14.6562 10.5625C14.375 10.3437 13.9375 10.5312 13.9375 10.9062L13.9375 24.0937C13.9375 24.4687 14.375 24.6562 14.6563 24.4375L22.9063 17.8437C23.125 17.6562 23.125 17.3437 22.9063 17.1562Z"
                                    fill="#F8F9FB"/>
                            </svg>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={colspanSlider}>
                        <div className={'progress-bar-slider'}>
                            <div className={'progress-bar-slider-track'}></div>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={colspanTime}>
                        <div className={'progress-bar-time'}>00:01/00:10</div>
                    </Grid.Col>
                </Grid.Row>
            </div>
        </div>
    );
};

export default ProgressBar;
