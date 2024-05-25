import React from "react";
import TemplateList from "../components/TemplateList";
import Header from "../components/Header";

const AppHome = (): React.JSX.Element => {
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
