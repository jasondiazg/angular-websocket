import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketBroker } from './web-socket.broker';
import { Subscription } from 'stompjs';

@Injectable()
export class WebSocketChannel implements OnDestroy {
    private channel: string;
    private subscription$: Subscription;

    constructor(private readonly webSocketBroker: WebSocketBroker) { }

    setChannel(channel: string) {
        this.channel = channel;
    }

    subscribe(callback: Function): Subscription {
        this.subscription$ = this.webSocketBroker.stompClient.subscribe(`${this.channel}`, (message) => callback(message));
        return this.subscription$;
    }

    subscribeToPath(path: string, callback: Function): Subscription {
        this.subscription$ = this.webSocketBroker.stompClient.subscribe(`${this.channel}/${path}`, (message) => callback(message));
        return this.subscription$;
    }

    send(data: string, headers?: any) {
        this.webSocketBroker.stompClient.send(`${this.channel}`, headers || {}, data);
    }

    sendToPath(path: string, data: string, headers?: any) {
        this.webSocketBroker.stompClient.send(`${this.channel}/${path}`, headers || {}, data);
    }

    unsubscribe() {
        this.subscription$ = undefined;
        return this.webSocketBroker.stompClient.unsubscribe(`${this.channel}`);
    }

    ngOnDestroy() {
        this.subscription$ && this.subscription$.unsubscribe();
    }

}