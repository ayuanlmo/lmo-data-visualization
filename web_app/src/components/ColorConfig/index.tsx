import React, {useEffect, useState} from "react";
import {Grid, Select} from "@hi-ui/hiui";
import ResetButton from "../ResetButton";
import SelectTheme from "./SelectTheme";
import BackgroundConfig from "../BackgroundConfig";
import {useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import {ReactState} from "../../types/ReactTypes";

interface IThemeConfigItem {
    title: string;
    id: string;
    disabled: boolean;
}

function ColorConfig(): React.JSX.Element {
    const configTheme: {
        configs: Array<string>;
        type: string;
        value: Array<string>;
    } = useSelector((state: RootState) => state.app.currentTemplateConfig.config.theme);
    const [themeConfigs, setThemeConfigs]: ReactState<Array<IThemeConfigItem>> = useState<Array<IThemeConfigItem>>([]);
    const [themeType, setThemeType]: ReactState<string> = useState<string>('');

    useEffect((): void => {
        setThemeConfigs([
            {title: "主题色", id: 'Theme', disabled: !configTheme.configs.includes('Theme')},
            {title: "渐变色", id: 'Gradient', disabled: !configTheme.configs.includes('Gradient')},
            {title: "单色", id: 'Single', disabled: !configTheme.configs.includes('Single')}
        ]);
        setThemeType(configTheme.type);
    }, [configTheme]);

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
                                <Select
                                    data={themeConfigs}
                                    defaultValue={themeType}
                                    value={themeType}
                                />
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