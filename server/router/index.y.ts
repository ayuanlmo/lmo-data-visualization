import {Router} from "express";
import Api from './Api.y';
import DefaultY from "./Default.y";

const _Router = Router();

_Router.use('/api', Api);
_Router.use('/', DefaultY);
_Router.use('*', DefaultY);

export default _Router;
