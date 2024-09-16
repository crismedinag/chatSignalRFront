import { Injectable } from '@angular/core';
import { ChatState } from './state/chat-store.service';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  constructor() {}

  logState(state: ChatState): void {
    console.log('State:', state);
    // console.log('Messages:', state.messages);
    // console.log('Current User:', state.currentUser);
    // console.log('Current Room:', state.currentRoom);
    // console.log('Rooms:', state.availableRooms);
  }
}
