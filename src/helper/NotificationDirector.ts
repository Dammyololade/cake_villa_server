import * as firebaseAdmin from "firebase-admin";

export class NotificationDirector {

    public static TEST_TOPIC: string = "test";
    public static USER_TOPIC: string = "Cake";
    public static ADMIN_TOPIC: string = "Cake Home";

    public tokenId: string;
    public topic: string;
    public title: string;
    public body: string;
   
    public setNotification(title: string, body: string): NotificationDirector {
        this.title = title;
        this.body = body;
        return this;
    }

     public setToken(tokenId: string): NotificationDirector {
        this.tokenId = tokenId;
        return this;
    }

    public setTopic(topicName: string): NotificationDirector {
        this.topic = topicName;
        return this;
    }

    public send(): Promise<string> {
        const messageParams = {
            notification: {
                title: this.title,
                body: this.body,
            },
             token: this.tokenId,
        };
        return firebaseAdmin.messaging().send(messageParams);
    }

    public async sendToTopic() {
        const messageParams = {
            notification: {
                title: this.title,
                body: this.body,
            },
            
        };
        await firebaseAdmin.messaging().sendToTopic(this.topic, messageParams);
    }

    }

export enum NotificationType {
    device_only = "device",
    topic_only = "topic",
    device_topic = "device_topic",
}
