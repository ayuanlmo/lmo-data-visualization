import {TDesignAppMessageType} from "../../types/TemplateMessage";

namespace PostMessage {
    export const send = (message: {
        type: TDesignAppMessageType,
        message: object
    }): void => {
        const _: HTMLIFrameElement = document.querySelector('iframe') as HTMLIFrameElement;

        _.contentWindow?.postMessage(message, location.origin);
    };
}

export default PostMessage;
