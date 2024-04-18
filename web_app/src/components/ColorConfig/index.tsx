import React from "react";
import {Grid, Select} from "@hi-ui/hiui";
import ResetButton from "../ResetButton";
import SelectTheme from "./SelectTheme";
import BackgroundConfig from "../BackgroundConfig";

function ColorConfig(): React.JSX.Element {
    return (
        <div className={'color-config app_none_user_select'}>
            <div className={'color-config-item'}>
                <Grid.Row style={{
                    width: '100%'
                }} gutter={true} justify={"space-between"}>
                    <Grid.Col span={8}>
                        <div className={'color-config-item-label app_flex_box'}>主题配置</div>
                    </Grid.Col>
                    <Grid.Col justify={'flex-end'} span={16}>
                        <Grid.Row gutter={true} justify={"space-between"}>
                            <Grid.Col span={6}>
                                <ResetButton/>
                            </Grid.Col>
                            <Grid.Col span={18}>
                                <Select></Select>
                            </Grid.Col>
                        </Grid.Row>
                    </Grid.Col>
                </Grid.Row>
            </div>
            <div className={'text-config-item app_flex_box'}>
                <SelectTheme/>
            </div>
            <div className={'config-line '}></div>
            <BackgroundConfig/>
        </div>
    );
}

export default ColorConfig;