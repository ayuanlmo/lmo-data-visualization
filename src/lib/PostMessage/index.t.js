export const PostMessage = (message = {}) => {
    parent.postMessage(message, location.origin);
};

const OnMessage = (msg) => {
    if (msg.origin !== location.origin)
        return false;
    console.log('收到消息', msg.data);
    
};

addEventListener('message', OnMessage);
