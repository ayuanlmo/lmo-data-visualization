import React, {lazy, StrictMode, Suspense} from "react";
import {createRoot, Root} from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Store from "./lib/Store/";
import "./style/Global.css";
import "./style/index.scss";
import "./style/animate.min.css";
import "./style/hi.scss";
import "./pages/style/AppHome.scss";
import "./pages/style/AppHome-Dack.scss";
import "./pages/style/AppHome-Light.scss";
import "./pages/style/AppDesign.scss";
import "./pages/style/AppDesign-Dack.scss";
import "./pages/style/AppDesign-Light.scss";
import "./pages/style/Welcome.scss";
import "./i18n";
import "./lib/Socket";

((): void => {
    const AppHome: React.LazyExoticComponent<() => React.JSX.Element> = lazy(() => import("./pages/AppHome"));
    const AppDesign: React.LazyExoticComponent<() => React.JSX.Element> = lazy(() => import("./pages/AppDesign"));
    const Welcome: React.LazyExoticComponent<() => React.JSX.Element> = lazy(() => import("./pages/Welcome"));
    const RootDom: HTMLDivElement = document.getElementById('__lmo_app') as HTMLDivElement;
    const __RootApp: Root = createRoot(RootDom);

    document.body.classList.add('dark-mode');

    __RootApp.render(
        <Provider store={Store}>
            <StrictMode>
                <BrowserRouter>
                    <Routes>
                        <Route index path="/" element={<Suspense><AppHome/></Suspense>}/>
                        <Route index path="/design" element={<Suspense><AppDesign/></Suspense>}/>
                        <Route index path="/welcome" element={<Suspense><Welcome/></Suspense>}/>
                    </Routes>
                </BrowserRouter>
            </StrictMode>
        </Provider>
    );
})();

reportWebVitals();

((_GLOBAL: Window): void => {
    'use strict';

    const getId = (): string => (new Date().getTime() / Math.random()).toFixed(0).toString() + Math.random().toString(36).substring(2, 5).toString();

    _GLOBAL.__LMO_APP_CONFIG = {
        __PLAYER_EL_ID: `__lmo_dv_app_player_${getId()}`,
        __PREVIEWER_EL_ID: `__lmo_dv_app_preview_${getId()}`
    } as const;

    Object.freeze(_GLOBAL.__LMO_APP_CONFIG);

    ((): void => {
        const audio: HTMLAudioElement = 'Audio' in _GLOBAL ? new Audio() : document.createElement('audio');

        audio.id = _GLOBAL.__LMO_APP_CONFIG.__PLAYER_EL_ID;
        document.body.append(audio);
    })();

})(this ?? window);
