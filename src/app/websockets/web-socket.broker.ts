import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable()
export class WebSocketBroker implements OnDestroy {
    private url: string = environment.url + "/v1/socket/";
    private ws: WebSocket;
    private token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWRVc2VyIjoiMTIzNDU2IiwibmFtZSI6Ikphc29uIETDrWF6IEcuIiwiaWF0IjoxNTE2MjM5MDIyfQ.TDGewo40Dfdc0MCBKmxaxTrz78OdTlP9z7GnmSz6F7Q';
    stompClient: Stomp.Client;

    constructor() {
        this.ws = new SockJS(this.url);
        this.connect(() => {});
    }

    connect(callback: Function) {
        this.stompClient = Stomp.over(this.ws);
        // this.stompClient.connect({ token: this.token }, (frame) => { });
        this.stompClient.connect({}, (frame) => {});
        // this.stompClient.connect({}, (frame) => callback(frame));
    }

    private disconnect() {
        this.stompClient.disconnect(() => { });
    }

    ngOnDestroy() {
        this.disconnect();
    }
}