import React, {useState} from "react";
import {Grid} from "@hi-ui/hiui";
import ColorPicker from "../ColorPicker";
import {ReactState} from "../../types/ReactTypes";

export interface ISingleColorPickerProps {
    value?: string;
    readonly onChange?: (value: string) => void;
}

const SingleColorPicker = (props: ISingleColorPickerProps): React.JSX.Element => {
    const {
        value,
        onChange
    }: ISingleColorPickerProps = props;

    const [color, setColor]: ReactState<string> = useState<string>(value ?? '');

    return (
        <Grid.Row
            gutter
            style={{
                width: '100%',
                height: '3.125rem'
            }}
        >
            <Grid.Col
                span={24}
                style={{
                    width: '100%'
                }}
            >
                <ColorPicker
                    onChange={(e: string): void => {
                        setColor(e);
                        onChange && onChange(e);
                    }}
                    value={color}
                    style={{
                        width: '100%',
                        height: '3.125rem'
                    }}
                />
            </Grid.Col>
        </Grid.Row>
    );
};

export default SingleColorPicker;
