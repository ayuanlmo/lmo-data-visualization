import {WsType} from "../../interface/SocketController.y";
import {WsAppType} from "../../interface/Core.y";

declare class SocketController {
    private readonly Ws;
    private readonly OnLineUsers;
    private readonly Pool;

    constructor(Ws: WsType, OnLineUsers: number, Pool: WsAppType);

    private Connect;
}

export default SocketController;