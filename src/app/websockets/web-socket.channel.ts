import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketBroker } from './web-socket.broker';
import { Subscription, Message } from 'stompjs';

@Injectable()
export class WebSocketChannel implements OnDestroy {
    private channel: string;
    private subscription$: Subscription;

    constructor(private readonly webSocketBroker: WebSocketBroker) { }

    private checkConnection(callback: Function) {
        if (!this.webSocketBroker.stompClient.connected) {
            this.webSocketBroker.connect(callback);
        } else {
            callback();
        }
    }

    setChannel(channel: string) {
        this.channel = channel;
    }

    subscribe(callback: Function) {
        let subscribeCallback = () => { this.subscription$ = this.webSocketBroker.stompClient.subscribe(`${this.channel}`, (message) => callback(message)); };
        this.checkConnection(subscribeCallback);
    }

    subscribeToPath(path: string, callback: Function) {
        let subscribeCallback = () => { this.subscription$ = this.webSocketBroker.stompClient.subscribe(`${this.channel}/${path}`, 
        (message: Message) => { 
            callback(message) 
        })};
        this.checkConnection(subscribeCallback);
    }

    send(data: string, headers?: any) {
        let sendCallback = () => { this.webSocketBroker.stompClient.send(`${this.channel}`, headers || {}, data); };
        this.checkConnection(sendCallback);
    }

    sendToPath(path: string, data: string, headers?: any) {
        let sendCallBack = () => { this.webSocketBroker.stompClient.send(`${this.channel}/${path}`, headers || {}, data); };
        this.checkConnection(sendCallBack);
    }

    unsubscribe() {
        let unsubscribeCallback = () => {
            this.subscription$ = undefined;
            this.webSocketBroker.stompClient.unsubscribe(`${this.channel}`);
        };
        this.checkConnection(unsubscribeCallback);
    }

    unsubscribeToPath(path: string) {
        let unsubscribeCallback = () => {
            this.webSocketBroker.stompClient.unsubscribe(`${this.channel}/${path}`);
        };
        this.checkConnection(unsubscribeCallback);
    }

    ngOnDestroy() {
        this.subscription$ && this.subscription$.unsubscribe();
    }

}