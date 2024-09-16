import { TestBed } from '@angular/core/testing';
import { ConnectionService } from './connection.service';
import { ChatStoreService } from '../state/chat-store.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

describe('ConnectionService', () => {
  let service: ConnectionService;
  let chatStoreService: jasmine.SpyObj<ChatStoreService>;
  let hubConnection: jasmine.SpyObj<HubConnection>;

  beforeEach(() => {
    const chatStoreServiceSpy = jasmine.createSpyObj('ChatStoreService', [
      'addMessage',
      'updateConnectedUsers',
      'setAvailableRooms',
      'addNotification',
    ]);

    hubConnection = jasmine.createSpyObj('HubConnection', [
      'start',
      'stop',
      'invoke',
      'on',
    ]);

    const hubConnectionBuilderSpy = jasmine.createSpyObj('HubConnectionBuilder', ['build']);
    hubConnectionBuilderSpy.build.and.returnValue(hubConnection);

    TestBed.configureTestingModule({
      providers: [
        ConnectionService,
        { provide: ChatStoreService, useValue: chatStoreServiceSpy },
        { provide: HubConnectionBuilder, useValue: hubConnectionBuilderSpy },
      ]
    });

    spyOn(HubConnectionBuilder.prototype, 'build').and.returnValue(hubConnection);

    service = TestBed.inject(ConnectionService);
    chatStoreService = TestBed.inject(ChatStoreService) as jasmine.SpyObj<ChatStoreService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startConnection', () => {
    it('should start', async () => {
      hubConnection.start.and.returnValue(Promise.resolve());
      await service.startConnection();
      expect(hubConnection.start).toHaveBeenCalled();
    });
  });

  describe('stopConnection', () => {
    it('should stop', async () => {
      hubConnection.stop.and.returnValue(Promise.resolve());
      await service.stopConnection();
      expect(hubConnection.stop).toHaveBeenCalled();
    });
  });

  describe('joinRoom', () => {
    it('should join a room', async () => {
      hubConnection.invoke.and.returnValue(Promise.resolve());
      await service.joinRoom('roomId', 'userName');
      expect(hubConnection.invoke).toHaveBeenCalledWith('JoinRoom', 'roomId', 'userName');
    });
  });

  describe('leaveRoom', () => {
    it('should leave a room', async () => {
      hubConnection.invoke.and.returnValue(Promise.resolve());
      await service.leaveRoom('roomId', 'userName');
      expect(hubConnection.invoke).toHaveBeenCalledWith('LeaveRoom', 'roomId', 'userName');
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      hubConnection.invoke.and.returnValue(Promise.resolve());
      await service.sendMessage('user', 'message', 'roomId');
      expect(hubConnection.invoke).toHaveBeenCalledWith('SendMessage', 'user', 'message', 'roomId');
    });
  });

  describe('getAvailableRooms', () => {
    it('should get available rooms', async () => {
      hubConnection.invoke.and.returnValue(Promise.resolve());
      await service.getAvailableRooms();
      expect(hubConnection.invoke).toHaveBeenCalledWith('GetAvailableRooms');
    });
  });

  describe('sendNotification', () => {
    it('should send a notification', async () => {
      hubConnection.invoke.and.returnValue(Promise.resolve());
      await service.sendNotification('title', 'content');
      expect(hubConnection.invoke).toHaveBeenCalledWith('SendNotification', 'title', 'content');
    });
  });
});
