import React, {useEffect, useState} from "react";
import {Select, SelectOption} from "@hi-ui/hiui";
import MyStorage from "../../../lib/Storage";
import {useTranslation} from "react-i18next";

// const langs = ['zh-CN', 'h-TW', 'ja', 'ko'];

const SwitchLang = (): React.JSX.Element => {
    const currentLang = MyStorage.get('lang') ?? 'zh-CN';
    const [lang, setLang] = useState(currentLang);
    const {i18n} = useTranslation();
    const params = new URLSearchParams(location.search.substring(1));

    useEffect((): void => {
        setLang(params.get('lang') ?? currentLang);
        MyStorage.set('lang', currentLang);
    }, []);

    useEffect((): void => {
        i18n.changeLanguage(lang);
    }, [lang]);

    return (
        <Select
            size={'sm'}
            style={{
                width: '6.5rem',
                marginLeft: '.8rem'
            }}
            value={lang}
            onChange={(e: React.ReactText | string): void => {
                setLang(e as string);
                MyStorage.set('lang', e);
            }}
            clearable={false}
        >
            <SelectOption value={'zh-CN'}>简体中文</SelectOption>
            <SelectOption value={'zh-TW'}>繁體中文</SelectOption>
            <SelectOption value={'en'}>English</SelectOption>
            <SelectOption value={'jp'}>日本語</SelectOption>
            <SelectOption value={'ko'}>한국어</SelectOption>
            <SelectOption value={'ru-RU'}>Россия</SelectOption>
        </Select>
    );
};

export default SwitchLang;
