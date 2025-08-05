import React, {useEffect, useMemo, useRef} from "react";
import Utils from "../../utils";

export interface IColorPickerProps {
    value: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
}

const ColorPicker = (props: IColorPickerProps): React.JSX.Element => {
    const {value, onChange}: IColorPickerProps = props;
    const ref: React.RefObject<HTMLInputElement> = useRef(null);

    const throttledOnChange = useMemo(() => {
        if (!onChange) return;

        return Utils.throttle(
            (val: string) => {
                requestAnimationFrame((): void => {
                    onChange(val);
                });
            }, 50
        );
    }, [onChange]);

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
                    throttledOnChange?.(e.target.value);
                }}
            />
        </>
    );
};

export default ColorPicker;
