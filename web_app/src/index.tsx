import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Store from "./lib/Store/";
import AppHome from "./pages/AppHome";
import "./style/Global.css";
import "./style/index.scss";
import "./style/animate.min.css";
import "./style/hi.css";

((): void => {
    const __RootApp: ReactDOM.Root = ReactDOM.createRoot(
        document.getElementById('__lmo_app') as HTMLDivElement
    );

    __RootApp.render(
        <Provider store={Store}>
            <React.StrictMode>
                <BrowserRouter>
                    <Routes>
                        <Route index path="/" element={<AppHome/>}/>
                    </Routes>
                </BrowserRouter>
            </React.StrictMode>
        </Provider>
    );
})();

reportWebVitals();
