import { TestBed } from '@angular/core/testing';
import { ChatStoreService } from './chat-store.service';
import { DebugService } from '../debug.service';
import { Message } from '../../models/message.model';
import { Room } from '../../models/room.model';
import { User } from '../../models/user.model';
import { Notification } from '../../models/notification.model';

describe('ChatStoreService', () => {
  let service: ChatStoreService;
  let debugService: jasmine.SpyObj<DebugService>;

  beforeEach(() => {
    const debugServiceSpy = jasmine.createSpyObj('DebugService', ['logState']);
    TestBed.configureTestingModule({
      providers: [
        ChatStoreService,
        { provide: DebugService, useValue: debugServiceSpy },
      ],
    });
    service = TestBed.inject(ChatStoreService);
    debugService = TestBed.inject(DebugService) as jasmine.SpyObj<DebugService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Selectors', () => {
    it('should select messages$', () => {
      const message = new Message('user1', 'Hello', new Date());
      service.setState((state) => ({ ...state, messages: [message] }));
      service.messages$.subscribe((messages) => {
        expect(messages.length).toBe(1);
        expect(messages[0]).toEqual(message);
      });
    });

    it('should select connectedUsers$', () => {
      const user: User = { id: 'user1', name: 'User1' };
      service.setState((state) => ({ ...state, connectedUsers: [user] }));
      service.connectedUsers$.subscribe((users) => {
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(user);
      });
    });

    it('should select currentUser$', () => {
      const user: User = { id: 'user1', name: 'User1' };
      service.setState((state) => ({ ...state, currentUser: user }));
      service.currentUser$.subscribe((currentUser) => {
        expect(currentUser).toEqual(user);
      });
    });

    it('should select currentRoom$', () => {
      const room: Room = { id: 'room1', name: 'Room1' };
      service.setState((state) => ({ ...state, currentRoom: room }));
      service.currentRoom$.subscribe((currentRoom) => {
        expect(currentRoom).toEqual(room);
      });
    });

    it('should select availableRooms$', () => {
      const rooms: Room[] = [{ id: 'room1', name: 'Room1' }];
      service.setState((state) => ({ ...state, availableRooms: rooms }));
      service.availableRooms$.subscribe((availableRooms) => {
        expect(availableRooms.length).toBe(1);
        expect(availableRooms[0]).toEqual(rooms[0]);
      });
    });

    it('should select notification$', () => {
      const notification: Notification = { title: 'Title', content: 'Content', timestamp: new Date() };
      service.setState((state) => ({ ...state, notification }));
      service.notification$.subscribe((notif) => {
        expect(notif).toEqual(notification);
      });
    });
  });

  describe('Updaters', () => {
    it('should add a message', () => {
      const message = new Message('user1', 'Hello', new Date());
      service.addMessage(message);
      service.messages$.subscribe((messages) => {
        expect(messages.length).toBe(1);
        expect(messages[0]).toEqual(message);
      });
    });

    it('should update connected users', () => {
      const users: User[] = [{ id: 'user1', name: 'User1' }];
      service.updateConnectedUsers(users);
      service.connectedUsers$.subscribe((connectedUsers) => {
        expect(connectedUsers.length).toBe(1);
        expect(connectedUsers[0]).toEqual(users[0]);
      });
    });

    it('should set the current user', () => {
      const user: User = { id: 'user1', name: 'User1' };
      service.setCurrentUser(user);
      service.currentUser$.subscribe((currentUser) => {
        expect(currentUser).toEqual(user);
      });
    });

    it('should set the current room', () => {
      const room: Room = { id: 'room1', name: 'Room1' };
      service.setCurrentRoom(room);
      service.currentRoom$.subscribe((currentRoom) => {
        expect(currentRoom).toEqual(room);
      });
    });

    it('should set available rooms', () => {
      const rooms: Room[] = [{ id: 'room1', name: 'Room1' }];
      service.setAvailableRooms(rooms);
      service.availableRooms$.subscribe((availableRooms) => {
        expect(availableRooms.length).toBe(1);
        expect(availableRooms[0]).toEqual(rooms[0]);
      });
    });

    it('should add a notification', () => {
      const notification: Notification = { title: 'Title', content: 'Content', timestamp: new Date() };
      service.addNotification(notification);
      service.notification$.subscribe((notif) => {
        expect(notif).toEqual(notification);
      });
    });

    it('should clear state', () => {
      const message = new Message('user1', 'Hello', new Date());
      const user: User = { id: 'user1', name: 'User1' };
      const room: Room = { id: 'room1', name: 'Room1' };
      const notification: Notification = { title: 'Title', content: 'Content', timestamp: new Date() };

      service.setState({
        messages: [message],
        connectedUsers: [user],
        currentUser: user,
        currentRoom: room,
        availableRooms: [room],
        notification,
      });

      service.clearState();

      service.messages$.subscribe((messages) => {
        expect(messages.length).toBe(0);
      });
      service.connectedUsers$.subscribe((connectedUsers) => {
        expect(connectedUsers.length).toBe(0);
      });
      service.currentUser$.subscribe((currentUser) => {
        expect(currentUser).toEqual({ id: '', name: '' });
      });
      service.currentRoom$.subscribe((currentRoom) => {
        expect(currentRoom).toEqual({ id: '', name: '' });
      });
      service.availableRooms$.subscribe((availableRooms) => {
        expect(availableRooms.length).toBe(0);
      });
      service.notification$.subscribe((notification) => {
        expect(notification).toEqual({
          title: '',
          content: '',
          timestamp: new Date(0),
        });
      });
    });
  });
});

