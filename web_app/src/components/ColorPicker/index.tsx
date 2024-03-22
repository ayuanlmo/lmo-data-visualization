import React, {useEffect, useRef} from "react";

export interface IColorPickerProps {
    value: string;
    onChange?: (value: string) => void;
}

const ColorPicker = (props: IColorPickerProps): React.JSX.Element => {
    const {
        value,
        onChange
    } = props;
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
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    onChange && onChange(e.target.value);
                }}
            />
        </>
    );
};

export default ColorPicker;
