import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WebSocketTestService } from '../../services/websocket-test.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sim-operations',
  templateUrl: './sim-operations.component.html',
  styleUrls: ['./sim-operations.component.css']
})
export class SimOperationsComponent implements OnInit, OnDestroy {
  private form: FormGroup;
  messages: string;
  socketSubscription$: Subscription;
  suscribed: boolean = false;

  constructor(private socketService: WebSocketTestService, private toastr: ToastrService) { }

  ngOnInit() {
    this.form = new FormGroup({
      userId: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
      simId: new FormControl(null, [Validators.required])
    });

    this.form.controls.userId.valueChanges.subscribe(value => this.suscribed = false);
    this.form.controls.simId.valueChanges.subscribe(value => this.suscribed = false);
  }

  ngOnDestroy() {
    this.socketSubscription$ && this.socketSubscription$.unsubscribe();
  }

  subscribeToChannel() {
    if (this.form.value.userId && this.form.value.simId) {
      this.socketService.subscribeToChannel(this.form.value.userId, this.form.value.simId);
      this.socketSubscription$ = this.socketService.simOperations.subscribe(message => { if (message) this.handleResult(message); });
    }
  }

  checkSubscription() {
    if (this.socketService.checkSubscription(this.form.value.userId, this.form.value.simId)) {
      this.suscribedToast();
      this.suscribed = true;
    } else {
      this.unsuscribedToast();
      this.suscribed = false;
    }
  }

  unsubscribeToChannel() {
    this.socketService.unsubscribeToChannel(this.form.value.userId, this.form.value.simId);
    this.suscribed = false;
  }

  sendMessage() {
    if (this.form.valid) {
      this.socketService.sendMessageUsingSocket({ userId: this.form.value.userId, simId: this.form.value.simId, message: this.form.value.message });
    }
  }

  handleResult(message: string) {
    this.messages += `${message} \n`;
    this.toastr.success(`New message recieved ${message}`, null, { 'timeOut': 3000 });
  }

  suscribedToast() {
    this.toastr.success(`Suscribed!`, null, { 'timeOut': 3000 });
  }

  unsuscribedToast() {
    this.toastr.error(`No subscribed!`, null, { 'timeOut': 3000 });
  }
}

export interface SubscriptionMessage {
  userId: string,
  simId: string,
  message: string
}