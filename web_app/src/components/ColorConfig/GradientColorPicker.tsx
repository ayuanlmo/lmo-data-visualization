import React, {useEffect, useState} from "react";
import {Grid} from "@hi-ui/hiui";
import ColorPicker from "../ColorPicker";
import {ReactState} from "../../types/ReactTypes";

export interface IGradientColorPickerProps {
    value: [string, string];
    readonly onChange?: (value: [string, string]) => void;
}

const GradientColorPicker = (props: IGradientColorPickerProps): React.JSX.Element => {
    const {
        value,
        onChange
    }: IGradientColorPickerProps = props;
    const colorPickerStyle: React.CSSProperties = {
        width: '100%',
        height: '3.125rem'
    };
    const [color1, setColor1]: ReactState<string> = useState<string>('');
    const [color2, setColor2]: ReactState<string> = useState<string>('');

    const colorSwap = (): void => {
        const temp: string = color1;

        setColor1(color2);
        setColor2(temp);
    };

    useEffect((): void => {
        onChange && onChange([color1, color2]);
    }, [color1, color2]);

    useEffect((): void => {
        setColor1(value[0]);
        setColor2(value[1]);
        onChange && onChange(value);
    }, []);

    return (
        <div
            className={'app_flex_box app_position_relative'}
            style={{
                width: '100%',
                justifyContent: 'space-between'
            }}>
            <Grid.Row
                gutter={8}
                justify={'space-between'}
                style={{
                    width: '100%'
                }}>
                <Grid.Col span={9}>
                    <ColorPicker
                        value={color1}
                        style={colorPickerStyle}
                        onChange={(e: string): void => {
                            setColor1(e);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={2}>
                    <div
                        className={'app_cursor_pointer c-gradient-color-picker'}
                        onClick={colorSwap}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 10" fill="none">
                            <path
                                d="M11.4686 6.31244V6.74994C11.4686 6.86597 11.4225 6.97725 11.3405 7.0593C11.2584 7.14135 11.1471 7.18744 11.0311 7.18744H2.47929L3.76422 8.94575C3.8326 9.03946 3.86096 9.15648 3.84308 9.2711C3.82519 9.38571 3.76252 9.48853 3.66885 9.55694L3.31579 9.81507C3.2694 9.84901 3.21678 9.87349 3.16093 9.88709C3.10508 9.90069 3.0471 9.90315 2.9903 9.89434C2.9335 9.88552 2.87899 9.8656 2.8299 9.8357C2.7808 9.80581 2.73807 9.76654 2.70416 9.72013L0.657973 6.91838C0.352598 6.50013 0.629535 5.91825 1.13135 5.87713L1.18735 5.87494H11.0311C11.1471 5.87494 11.2584 5.92104 11.3405 6.00308C11.4225 6.08513 11.4686 6.19641 11.4686 6.31244ZM0.529785 3.94819V3.51069C0.529785 3.39466 0.575879 3.28338 0.657926 3.20133C0.739973 3.11929 0.851253 3.07319 0.967285 3.07319H9.5191L8.2346 1.31488C8.16618 1.22123 8.13774 1.10424 8.15554 0.989634C8.17335 0.875026 8.23593 0.772176 8.32954 0.703693L8.68303 0.445568C8.77669 0.377147 8.89367 0.348712 9.00828 0.366514C9.12289 0.384317 9.22574 0.4469 9.29422 0.540506L11.3413 3.34226C11.6467 3.76051 11.3693 4.34238 10.8679 4.38351L10.811 4.38569H0.967285C0.851253 4.38569 0.739973 4.3396 0.657926 4.25755C0.575879 4.1755 0.529785 4.06423 0.529785 3.94819Z"
                                fill="white"/>
                        </svg>
                    </div>
                </Grid.Col>
                <Grid.Col span={9}>
                    <ColorPicker
                        value={color2}
                        style={colorPickerStyle}
                        onChange={(e: string): void => {
                            setColor2(e);
                        }}
                    />
                </Grid.Col>
            </Grid.Row>
        </div>
    );
};

export default GradientColorPicker;