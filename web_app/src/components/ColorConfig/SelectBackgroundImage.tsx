import React, {useEffect, useRef, useState} from "react";
import SelectFile from "../SelectFile";
import YExtendTemplate from "../YExtendTemplate";
import {useSelector} from "react-redux";
import {RootState} from "../../lib/Store";
import {ReactState} from "../../types/ReactTypes";

export interface ISelectBackgroundImageProps {
    onSelect: (path: string) => void;
}

const SelectBackgroundImage = (props: ISelectBackgroundImageProps): React.JSX.Element => {
    const sf = useRef({
        open: (): void => {
        }
    });
    const backgroundConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.background);
    const [path, setPath]: ReactState<string> = useState('');

    const open = (): void => {
        sf.current.open && sf.current.open();
    };

    useEffect((): void => {
        setPath(backgroundConfig.image);
    }, []);
    useEffect((): void => {
        if (backgroundConfig.image === '')
            setPath('');
    }, [backgroundConfig]);

    return (
        <div onClick={open} className={'select-bg-image app_cursor_pointer app_position_relative'}>
            <YExtendTemplate show={path === ''}>
                <div>请选择图片</div>
            </YExtendTemplate>
            <YExtendTemplate show={path !== ''}>
                <div
                    className={'app_flex_box'}
                    style={{
                        justifyContent: 'center'
                    }}>
                    <img
                        className={'app_position_absolute'}
                        src={'api/' + path}
                        alt={path}
                    />
                </div>
            </YExtendTemplate>
            <SelectFile
                onSelect={
                    ({path}): void => {
                        setPath(path);
                        props.onSelect(path);
                        open();
                    }
                }
                ref={sf}/>
        </div>
    );
};

export default SelectBackgroundImage;