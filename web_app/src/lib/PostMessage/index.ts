namespace PostMessage {
    export const send = (message: {}): void => {
        const _: HTMLIFrameElement = document.querySelector('iframe') as HTMLIFrameElement;

        _.contentWindow?.postMessage(message, location.origin);
    }
}

export default PostMessage;
