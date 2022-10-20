import Router from "./router/index.y";
import {Net} from "./lib/net/Net.y";

((): void => {
    const Express = require('express');
    const App = Express();
    // const WsApp: any = require('express-ws')(App);

    App.use(Router);


    Net.START_SERVER(App);
})();
