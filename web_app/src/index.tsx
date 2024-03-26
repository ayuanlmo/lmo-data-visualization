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

((): void => {
    const AppHome: React.LazyExoticComponent<() => React.JSX.Element> = lazy(() => import("./pages/AppHome"));
    const AppDesign: React.LazyExoticComponent<() => React.JSX.Element> = lazy(() => import("./pages/AppDesign"));
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
                    </Routes>
                </BrowserRouter>
            </StrictMode>
        </Provider>
    );
})();

reportWebVitals();
