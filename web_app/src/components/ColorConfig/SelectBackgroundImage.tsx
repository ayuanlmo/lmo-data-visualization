import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Preview} from "@hi-ui/hiui";
import SelectFile, {TFileType} from "../SelectFile";
import YExtendTemplate from "../YExtendTemplate";
import {RootState} from "../../lib/Store";
import {ReactState} from "../../types/ReactTypes";
import {useTranslation} from "react-i18next";

export interface ISelectBackgroundImageProps {
    readonly onSelect: (path: string) => void;
    type?: TFileType;
}

const SelectBackgroundImage = (props: ISelectBackgroundImageProps): React.JSX.Element => {
    const {
        type = 'image',
        onSelect
    }: ISelectBackgroundImageProps = props;
    const sf = useRef({
        open: (): void => {
        }
    });
    const backgroundConfig = useSelector((state: RootState) => state.app.currentTemplateConfig.config.background);
    const [path, setPath]: ReactState<string> = useState<string>('');
    const [isHover, setIsHover]: ReactState<boolean> = useState<boolean>(false);
    const [openPreview, setOpenPreview]: ReactState<boolean> = useState<boolean>(false);
    const {t} = useTranslation();

    const open = (): void => {
        sf.current.open && sf.current.open();
    };

    const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsHover(true);
    };

    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsHover(false);
    };

    useEffect((): void => {
        onSelect(path);
    }, [path]);

    useEffect((): void => {
        setPath(backgroundConfig.image);
    }, []);

    useEffect((): void => {
        if (backgroundConfig.image === '')
            setPath('');
    }, [backgroundConfig]);

    return (
        <React.Fragment>
            <YExtendTemplate show={type === 'image'}>
                <Preview
                    visible={openPreview}
                    src={'/api/' + path}
                    onClose={(): void => {
                        setOpenPreview(false);
                    }}
                />
            </YExtendTemplate>
            <div
                onClick={open}
                className={'select-bg-image app_cursor_pointer app_position_relative'}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <YExtendTemplate show={path === ''}>
                    <div>{t('pleaseSelect')}</div>
                </YExtendTemplate>
                <YExtendTemplate show={path !== ''}>
                    <YExtendTemplate show={isHover}>
                        <div
                            className={'select-bg-image-on app_position_absolute animated fadeIn'}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            onClick={(e: React.MouseEvent<HTMLDivElement>): void => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <YExtendTemplate show={type === 'image'}>
                                <Button
                                    size={'sm'}
                                    type="primary"
                                    shape="round"
                                    onClick={(): void => {
                                        setOpenPreview(true);
                                    }}
                                >{t('preview')}</Button>
                            </YExtendTemplate>
                            <Button
                                size={'sm'}
                                type="primary"
                                shape="round"
                                onClick={(): void => {
                                    open();
                                    setIsHover(false);
                                }}
                            >{t('replace')}</Button>
                            <Button
                                size={'sm'}
                                type="danger"
                                shape="round"
                                onClick={(): void => {
                                    setPath('');
                                }}
                            >{t('delete')}</Button>
                        </div>
                    </YExtendTemplate>
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
                        ({path, cover}): void => {
                            if (typeof type === 'string' && type === 'audio' && cover)
                                setPath(cover);
                            else
                                setPath(path);

                            open();
                        }
                    }
                    ref={sf}/>
            </div>
        </React.Fragment>
    );
};

export default SelectBackgroundImage;