import {notification} from "@hi-ui/hiui";
import message from "@hi-ui/message";

class Notification {
    public static openNotification(title: string = '通知', content: string, type: 'info' | 'success' | 'error' | 'warning' = 'error'): void {
        notification.closeAll();
        notification.open({
            title: title,
            type: type,
            content: content
        })
    }

    public static message(title: string, type: 'info' | 'success' | 'error' | 'warning'): void {
        message.closeAll();
        message.open({
            title: title,
            type: type
        })
    }
}

export default Notification;
