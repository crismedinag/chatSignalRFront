import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ChatComponent } from './chat.component';
import { ChatStoreService } from '../../services/state/chat-store.service';
import { ConnectionService } from '../../services/connection/connection.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatStoreService: jasmine.SpyObj<ChatStoreService>;
  let connectionService: jasmine.SpyObj<ConnectionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const chatStoreServiceSpy = jasmine.createSpyObj('ChatStoreService', [
      'messages$',
      'connectedUsers$',
      'currentUser$',
      'currentRoom$',
      'notification$',
      'clearState'
    ]);
    const connectionServiceSpy = jasmine.createSpyObj('ConnectionService', [
      'sendMessage',
      'leaveRoom',
      'sendNotification',
      'stopConnection'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['info']);
    const datePipeSpy = jasmine.createSpyObj('DatePipe', ['transform']);

    chatStoreServiceSpy.currentUser$ = of({ name: 'user' });
    chatStoreServiceSpy.currentRoom$ = of({ id: 'room1' });
    chatStoreServiceSpy.messages$ = of([]);
    chatStoreServiceSpy.connectedUsers$ = of([]);
    chatStoreServiceSpy.notification$ = of(null);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ChatComponent
      ],
      providers: [
        FormBuilder,
        { provide: ChatStoreService, useValue: chatStoreServiceSpy },
        { provide: ConnectionService, useValue: connectionServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: DatePipe, useValue: datePipeSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    chatStoreService = TestBed.inject(ChatStoreService) as jasmine.SpyObj<ChatStoreService>;
    connectionService = TestBed.inject(ConnectionService) as jasmine.SpyObj<ConnectionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('init', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with currentUser and currentRoom', () => {
      expect(component.currentUser).toBe('');
      expect(component.currentRoom).toBe('');
    });
  });

  describe('leaveRoom', () => {
    it('should leave the room and navigate to home', async () => {
      component.currentRoom = 'room1';
      component.currentUser = 'user';
      await component.leaveRoom();
      expect(connectionService.leaveRoom).toHaveBeenCalledWith('room1', 'user');
      expect(connectionService.sendNotification).toHaveBeenCalledWith('user', 'ha abandonado el chat');
      expect(connectionService.stopConnection).toHaveBeenCalled();
      expect(chatStoreService.clearState).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});

