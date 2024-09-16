import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Message } from '../../models/message.model';
import { Room } from '../../models/room.model';
import { User } from '../../models/user.model';
import { Notification } from '../../models/notification.model';
import { DebugService } from '../debug.service';
import { tap } from 'rxjs';

export interface ChatState {
  messages: Message[];
  connectedUsers: User[];
  currentUser: User;
  currentRoom: Room;
  availableRooms: Room[];
  notification: Notification;
}

const initialState: ChatState = {
  messages: [],
  connectedUsers: [],
  currentUser: { id: '', name: '' },
  currentRoom: { id: '', name: '' },
  availableRooms: [],
  notification: {
    title: '',
    content: '',
    timestamp: new Date(0),
  },
};

@Injectable({
  providedIn: 'root',
})
export class ChatStoreService extends ComponentStore<ChatState> {
  constructor(private debugService: DebugService) {
    super(initialState);
    // Descomentar para ver el estado del state cuando se produzca un cambio
    this.state$
      .pipe(tap((state) => this.debugService.logState(state)))
      .subscribe();
  }

  private static initialState: ChatState = {
    messages: [],
    connectedUsers: [],
    currentUser: { id: '', name: '' },
    currentRoom: { id: '', name: '' },
    availableRooms: [],
    notification: {
      title: '',
      content: '',
      timestamp: new Date(0),
    },
  };

  // Selectores
  readonly messages$ = this.select((state) => state.messages);
  readonly connectedUsers$ = this.select((state) => state.connectedUsers);
  readonly currentUser$ = this.select((state) => state.currentUser);
  readonly currentRoom$ = this.select((state) => state.currentRoom);
  readonly availableRooms$ = this.select((state) => state.availableRooms);
  readonly notification$ = this.select((state) => state.notification);

  // Updaters
  readonly addMessage = this.updater((state, message: Message) => ({
    ...state,
    messages: [...state.messages, message],
  }));

  readonly updateConnectedUsers = this.updater((state, users: User[]) => ({
    ...state,
    connectedUsers: users,
  }));

  readonly setCurrentUser = this.updater((state, user: User) => ({
    ...state,
    currentUser: user,
  }));

  readonly setCurrentRoom = this.updater((state, room: Room) => ({
    ...state,
    currentRoom: room,
  }));

  readonly setAvailableRooms = this.updater((state, rooms: Room[]) => ({
    ...state,
    availableRooms: rooms,
  }));

  readonly addNotification = this.updater((state, notification: Notification) => ({
    ...state,
    notification: notification,
  }));

  readonly clearState = this.updater((): ChatState => ChatStoreService.initialState);
}
