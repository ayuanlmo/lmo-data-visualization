import Api from './Api.y';
import Default from "./Default.y";
import {Router} from "express";

const _Router = Router();

_Router.use('/api', Api);
_Router.use('/', Default);
_Router.use('*', Default);

export default _Router;
