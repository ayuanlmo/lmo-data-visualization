import React, {useEffect, useState} from "react";
import {Grid, Loading} from "@hi-ui/hiui";
import Request from "../../lib/Request";
import {ReactState} from "../../types/ReactTypes";
import PostMessage from "../../lib/PostMessage";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import {Dispatch} from "@reduxjs/toolkit";
import {setCurrentTemplateThemeConfig} from "../../lib/Store/AppStore";

export interface ISelectThemeProps {
    span?: number;
}

interface IColorType {
    id: string;
    type: string;
    value: string;
}

function SelectTheme(props: ISelectThemeProps): React.JSX.Element {
    const {span = 12}: ISelectThemeProps = props;
    const [colors, setColors]: ReactState<Array<IColorType>> = useState<Array<IColorType>>([]);
    const [loading, setLoading]: ReactState<boolean> = useState<boolean>(true);
    const dispatch: Dispatch = useDispatch();
    const currentTemplateConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.theme);
    const [currentThemeId, setCurrentThemeId]: ReactState<string> = useState<string>('');

    useEffect((): void => {
        Request.getColors({type: 'theme'})
            .then((res): void => setColors(res.data.rows))
            .finally((): void => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Loading visible={loading}>
                <Grid.Row style={{
                    width: '100%',
                    maxHeight: '13rem',
                    overflow: 'scroll'
                }} gutter={true} justify={"space-between"}>
                    {
                        colors.map((i: IColorType): React.JSX.Element => {
                            return (
                                <Grid.Col span={span} key={i.id}>
                                    <div className={'c-select-theme app_flex_box app_cursor_pointer'}
                                         onClick={(): void => {
                                             if (currentThemeId === i.id) return;
                                             setCurrentThemeId(i.id);
                                             dispatch(setCurrentTemplateThemeConfig({
                                                 ...currentTemplateConfig,
                                                 value: JSON.parse(i.value)
                                             }));
                                             PostMessage.send({
                                                 type: 'SET_THEME_COLOR',
                                                 message: JSON.parse(i.value)
                                             });
                                         }}>
                                        {
                                            JSON.parse(i.value).map((j: string, k: number): React.JSX.Element => {
                                                return (
                                                    <div key={k} style={{background: `${j}`}}/>
                                                );
                                            })
                                        }
                                    </div>
                                </Grid.Col>
                            );
                        })
                    }
                </Grid.Row>
            </Loading>
        </>
    );
}

export default SelectTheme;