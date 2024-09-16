import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChatStoreService } from '../../services/state/chat-store.service';
import { Room } from '../../models/room.model';
import { firstValueFrom, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConnectionService } from '../../services/connection/connection.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  rooms$: Observable<Room[]>;
  connectionEstablished = false;
  toggle = false;
  selectedRoomName: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private connectionService: ConnectionService,
    private chatStoreService: ChatStoreService,
  ) {
    this.form = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      room: ['', Validators.required],
    });
    this.rooms$ = this.chatStoreService.availableRooms$;
  }

  async ngOnInit() {
    try {
      await this.initializeConnection();
      await this.fetchAvailableRooms();
    } catch (err) {
      this.handleError('Error establishing connection or fetching rooms', err);
    }
  }

  private async initializeConnection(): Promise<void> {
    await this.connectionService.startConnection();
    this.connectionEstablished = true;
  }

  private async fetchAvailableRooms(): Promise<void> {
    if (this.connectionEstablished) {
      await this.connectionService.getAvailableRooms()
    }
  }

  toggleRoom() {
    this.toggle = !this.toggle;
  }

  selectOption(room: Room) {
    this.form.get('room')?.setValue(room.id);
    this.selectedRoomName = room.name;
    this.toggle = false;
  }

  async joinRoom(): Promise<void> {
    if (this.form.valid) {
      const { userName, room } = this.form.value;
      const user = { id: this.generateId(), name: userName };
      const rooms = await firstValueFrom(this.rooms$);
      const selectedRoom = rooms.find(r => r.id === room);

      if (selectedRoom) {
        this.setRoomAndUser(user, selectedRoom);

        await this.joinAndNotify(room, userName);
      }
    }
  }

  private async joinAndNotify(room: any, userName: any) {
    try {
      await this.connectionService.joinRoom(room, userName);
      await this.connectionService.sendNotification(userName, 'ha entrado a la sala');
      this.router.navigate(['/chat']);
    } catch (err) {
      this.handleError('Error joining room', err);
    }
  }

  private setRoomAndUser(user: { id: string; name: any; }, selectedRoom: Room) {
    this.chatStoreService.setCurrentUser(user);
    this.chatStoreService.setCurrentRoom({
      id: selectedRoom.id,
      name: selectedRoom.name,
      description: '',
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private handleError(message: string, err: any) {
    console.error(message, err);
    alert(message);
  }
}
