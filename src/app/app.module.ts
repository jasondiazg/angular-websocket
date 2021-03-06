import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { SimOperationsComponent } from './components/sim-operations/sim-operations.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { WebSocketBroker } from './websockets/web-socket.broker';
import { WebSocketTestService } from './services/websocket-test.service';
import { WebSocketChannel } from './websockets/web-socket.channel';

@NgModule({
  declarations: [
    AppComponent,
    SimOperationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({ timeOut: 3000 }),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [WebSocketBroker, WebSocketChannel, WebSocketTestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
