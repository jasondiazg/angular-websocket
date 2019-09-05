import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sim-operations',
  templateUrl: './sim-operations.component.html',
  styleUrls: ['./sim-operations.component.css']
})
export class SimOperationsComponent implements OnInit {
  private form: FormGroup;
  simOperations: SocketMessage[] = [];
  socketSubscription: Subscription;

  constructor(private socketService: SocketService, private toastr: ToastrService) { 
    this.socketSubscription = this.socketService.simOperations.subscribe(simOperations => this.handleResult(simOperations));
  }

  ngOnInit() {
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required]),
      simId: new FormControl(null, [Validators.required])
    })
  }

  subscribeToSocket() {
    if (this.form.valid) {
      this.socketService.openChannel(this.form.value.simId);
    }
  }

  handleResult(simOperations){
    if (simOperations) {
      this.simOperations = simOperations;
      this.toastr.success("new message recieved", null, { 'timeOut': 3000 });
    }
  }
}

export interface SocketMessage {
  message: string,
  simId: string,
}