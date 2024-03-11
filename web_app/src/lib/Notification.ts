import {notification} from "@hi-ui/hiui";

class Notification {
    public static openNotification(title: string = '通知', content: string, type: 'info' | 'success' | 'error' | 'warning' = 'error'): void {
        notification.closeAll();
        notification.open({
            title: title,
            type: type,
            content: content
        })
    }
}

export default Notification;
