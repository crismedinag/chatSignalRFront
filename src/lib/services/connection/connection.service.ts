import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Room } from '../../models/room.model';
import { User } from '../../models/user.model';
import { ChatStoreService } from '../state/chat-store.service';
import { Message } from '../../models/message.model';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  private hubConnection: HubConnection;

  constructor(private chatStoreService: ChatStoreService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5224/chatHub')
      .build();

    this.registerEventsServer();
  }


  private registerEventsServer() {
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.chatStoreService.addMessage(message);
    });

    this.hubConnection.on('UpdateConnectedUsers', (users: User[]) => {
      this.chatStoreService.updateConnectedUsers(users);
    });

    this.hubConnection.on('ReceiveAvailableRooms', (rooms: Room[]) => {
      this.chatStoreService.setAvailableRooms(rooms);
    });

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.chatStoreService.addNotification(notification);
    });
  }

  // Método básico para capturar los errores dentro del servicio. Puede aplicarse lógica que se quiera
  public handleError(method: string, err: any) {
    console.error(`Error in ${method}:`, err);
    throw new Error(`Error in ${method}`);

  }

  public async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('Hub connection started');
    } catch (err) {
      this.handleError('startConnection', err);
    }
  }

  public async stopConnection(): Promise<void> {
    try {
      await this.hubConnection.stop();
      console.log('Hub connection stopped');
    } catch (err) {
      this.handleError('stopConnection', err);
    }
  }

  public async joinRoom(roomId: string, userName: string): Promise<void> {
    try {
      await this.hubConnection.invoke('JoinRoom', roomId, userName);
    } catch (err) {
      this.handleError('joinRoom', err);
    }
  }

  public async leaveRoom(roomId: string, userName: string): Promise<void> {
    try {
      await this.hubConnection.invoke('LeaveRoom', roomId, userName);
    } catch (err) {
      this.handleError('leaveRoom', err);
    }
  }

  public async sendMessage(user: string, message: string, roomId: string): Promise<void> {
    try {
      await this.hubConnection.invoke('SendMessage', user, message, roomId);
    } catch (err) {
      this.handleError('sendMessage', err);
    }
  }

  public async getAvailableRooms(): Promise<void> {
    try {
      await this.hubConnection.invoke('GetAvailableRooms');
    } catch (err) {
      this.handleError('getAvailableRooms', err);
    }
  }

  public async sendNotification(title: string, content: string): Promise<void> {
    try {
      await this.hubConnection.invoke('SendNotification', title, content);
    } catch (err) {
      this.handleError('sendNotification', err);
    }
  }

}
