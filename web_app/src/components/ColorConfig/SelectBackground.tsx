import Grid from "@hi-ui/grid";
import React, {useEffect, useState} from "react";
import Request from "../../lib/Request";
import {Loading} from "@hi-ui/hiui";

interface IColorType {
    id: string;
    type: string;
    value: string;
}

export interface ISelectBackgroundProps {
    onSelect?: (cssCode: string) => void;
}

const SelectBackground = (props: ISelectBackgroundProps): React.JSX.Element => {
    const {Col, Row} = Grid;
    const [colors, setColors]: [
        Array<IColorType>,
        React.Dispatch<React.SetStateAction<Array<IColorType>>>
    ] = useState<Array<IColorType>>([]);
    const [loading, setLoading]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useState<boolean>(true);

    const getBackgroundItem = (color: string): React.JSX.Element => {
        const colors: string[] = JSON.parse(color);
        const str: string = `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`;

        return (
            <div onClick={(): void => {
                props.onSelect && props.onSelect(str);
            }} className={'app_cursor_pointer'} style={{
                background: str,
                width: '100%',
                height: '2.125rem',
                borderRadius: '.4rem'
            }}/>
        );
    };

    useEffect((): void => {
        Request.getColors({type: 'background'})
            .then((res): void => setColors(res.data.rows))
            .finally((): void => {
                setLoading(false);
            });
    }, []);

    return (
        <Loading visible={loading}>
            <Row style={{
                width: '100%',
                maxHeight: '13rem',
                overflow: 'scroll'
            }} gutter={true}>
                {
                    colors.map((i: IColorType): React.JSX.Element => {
                        return (
                            <Col key={i.id} span={4}>
                                {
                                    getBackgroundItem(i.value)
                                }
                            </Col>
                        );
                    })
                }
            </Row>
        </Loading>
    );
};

export default SelectBackground;