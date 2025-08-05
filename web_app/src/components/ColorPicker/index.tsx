import React, {useMemo, useRef} from "react";
import Utils from "../../utils";

export interface IColorPickerProps {
    value: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
}

const ColorPicker = (props: IColorPickerProps): React.JSX.Element => {
    const {value, onChange} = props;
    const ref: React.RefObject<HTMLInputElement> = useRef(null);
    const normalizedValue: string = useMemo(() => Utils.normalizeColor(value), [value]);

    const throttledOnChange = useMemo(() => {
        if (!onChange) return;

        return Utils.throttle((val: string) => {
            requestAnimationFrame((): void => {
                onChange(Utils.normalizeColor(val));
            });
        }, 50);
    }, [onChange]);

    return (
        <input
            ref={ref}
            type="color"
            style={props.style}
            value={normalizedValue}
            onChange={(e) => {
                throttledOnChange?.(e.target.value);
            }}
        />
    );
};

export default ColorPicker;
