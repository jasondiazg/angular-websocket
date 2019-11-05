import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketChannel } from '../websockets/web-socket.channel';
import { Subscription, Message } from 'stompjs';
import { SubscriptionMessage } from '../components/sim-operations/sim-operations.component';

@Injectable()
export class WebSocketTestService {

    private simOperationsList = new BehaviorSubject<any>(null);
    private subscriptions: { userId: string, simId: string }[] = [];

    constructor(private readonly webSocketChannel: WebSocketChannel) {
        this.webSocketChannel.setChannel('sim-operations');
    }

    get simOperations() {
        return this.simOperationsList.asObservable();
    }

    subscribeToChannel(userId: string, simId: string) {
        this.subscriptions.push({userId, simId });
        this.webSocketChannel.subscribeToPath(`${userId}/${simId}`, (message: Message) => this.simOperationsList.next(this.genericData(message)))
    }

    sendMessageUsingSocket(message: SubscriptionMessage) {
        this.subscriptions.forEach(
            subscription => {
                if (subscription.userId == message.userId && subscription.simId == message.simId) {
                    this.webSocketChannel.sendToPath(`status/listen`, JSON.stringify(message));
                }
            }
        );
    }

    checkSubscription(userId: string, simId: string) {
        let availableSubscription = false;
        this.subscriptions.forEach(
            subscription => {
                if (subscription.userId == userId && subscription.simId == simId) {
                    availableSubscription = true;
                }
            }
        );
        return availableSubscription;
    }

    unsubscribeToChannel(userId: string, simId: string) {
        this.subscriptions.forEach(
            subscription => {
                if (subscription.userId == userId && subscription.simId == simId) {
                    this.webSocketChannel.unsubscribeToPath(`${userId}/${simId}`);
                }
            }
        );
    }

    private genericData(message: any) {
        return `New message from the backend: ${JSON.parse(message.body).content}`;
    }
}