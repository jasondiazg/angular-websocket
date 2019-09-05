import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { WebSocketChannel } from '../websockets/web-socket.channel';
import { Subscription } from 'stompjs';

@Injectable()
export class SocketService {

  private simOperationsList = new BehaviorSubject<any>(null);
  private url: string = environment.url;
  private idSim: string;

  constructor(private http: HttpClient, private readonly webSocketChannel: WebSocketChannel) {
    this.webSocketChannel.setChannel('sim-operations')
  }

  openChannel(idSim: string) {
    this.idSim = idSim;
    this.webSocketChannel.subscribeToPath(this.idSim, (message) => this.get().subscribe(simOperations => this.simOperationsList.next(simOperations)));
  }

  sendMessageUsingSocket(message: string) {
    this.webSocketChannel.sendToPath("status", message);
  }

  get simOperations() {
    return this.simOperationsList.asObservable();
  }

  get() {
    return this.http.get(`${this.url}/v1/sim-operations/${this.idSim}`)
      .pipe(
        map((data: any) => { return data; }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}