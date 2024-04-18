import React, {useEffect, useRef} from "react";

export interface IColorPickerProps {
    value: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
}

const ColorPicker = (props: IColorPickerProps): React.JSX.Element => {
    const {value, onChange}: IColorPickerProps = props;
    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect((): void => {
        if (ref.current)
            ref.current.value = props.value;
    }, [props]);

    return (
        <>
            <input
                ref={ref}
                type="color"
                style={props.style}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    onChange && onChange(e.target.value);
                }}
            />
        </>
    );
};

export default ColorPicker;
