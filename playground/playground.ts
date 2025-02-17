export interface Notification {
    send(message: string): void;
}

export class EmailNotification implements Notification {
    send(message: string): void {
        console.log(message + ' via email');
    }
}

export class SmsNotification implements Notification {
    send(message: string): void {
        console.log(message + ' via sms');
    }
}

export class NotificationFactory {
    static create(type: string): Notification {
        switch (type) {
            case 'email':
                return new EmailNotification();
            case 'sms':
                return new SmsNotification();
            default:
                throw new Error('Invalid notification type');
        }
    }
}

export class NotificationService {
    private notification: Notification;

    constructor(type: string) {
        this.notification = NotificationFactory.create(type);
    }

    notify(message: string): void {
        this.notification.send(message);
    }
}

export class Playground {
    main(): void {
        const notificationService = new NotificationService('email');
        notificationService.notify('Hello, world!');
    }
}
