import { Injectable } from '@angular/core';
import { WebSocketBroker } from './web-socket.broker';
import { Subscription } from 'stompjs';

@Injectable()
export class WebSocketChannel {
    private channel: string;

    constructor(private readonly webSocketBroker: WebSocketBroker) { }

    setChannel(channel: string) {
        this.channel = channel;
    }

    subscribe(callback: Function): Subscription {
        return this.webSocketBroker.stompClient.subscribe(`${this.channel}`, (message) => callback(message) );
    }

    subscribeToPath(path: string, callback: Function): Subscription {
        return this.webSocketBroker.stompClient.subscribe(`${this.channel}/${path}`, (message) => callback(message) );
    }

    send(data: string, headers?: any) {
        this.webSocketBroker.stompClient.send(`${this.channel}`, headers || {}, data);
    }

    sendToPath(path: string, data: string, headers?: any) {
        this.webSocketBroker.stompClient.send(`${this.channel}/${path}`, headers || {}, data);
    }

    unsubscribe() {
        return this.webSocketBroker.stompClient.unsubscribe(`${this.channel}`);
    }

}