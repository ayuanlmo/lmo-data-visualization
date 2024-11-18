import React, {useEffect} from "react";
import TemplateList from "../components/TemplateList";
import Header from "../components/Header";
import Storage from "../lib/Storage";
import {NavigateFunction, useNavigate} from "react-router-dom";

const AppHome = (): React.JSX.Element => {
    const navigate: NavigateFunction = useNavigate();

    useEffect((): void => {
        if (!location.pathname.includes('welcome') && Storage.get('open_welcome_page') === null)
            navigate('/welcome');
    }, []);

    return (
        <div className={'data-visualization app_none_user_select'}>
            <Header.Home/>
            <div className={'data-visualization-templates'}>
                <TemplateList/>
            </div>
        </div>
    );
};

export default AppHome;
