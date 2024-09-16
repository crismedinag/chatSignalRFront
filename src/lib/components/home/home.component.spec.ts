import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HomeComponent } from './home.component';
import { ChatStoreService } from '../../services/state/chat-store.service';
import { ConnectionService } from '../../services/connection/connection.service';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let chatStoreService: jasmine.SpyObj<ChatStoreService>;
  let connectionService: jasmine.SpyObj<ConnectionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const chatStoreServiceSpy = jasmine.createSpyObj('ChatStoreService', [
      'setCurrentUser',
      'setCurrentRoom'
    ]);
    const connectionServiceSpy = jasmine.createSpyObj('ConnectionService', [
      'startConnection',
      'getAvailableRooms',
      'joinRoom',
      'sendNotification'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    chatStoreServiceSpy.availableRooms$ = of([]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule],
      declarations: [],
      providers: [
        { provide: ChatStoreService, useValue: chatStoreServiceSpy },
        { provide: ConnectionService, useValue: connectionServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    chatStoreService = TestBed.inject(ChatStoreService) as jasmine.SpyObj<ChatStoreService>;
    connectionService = TestBed.inject(ConnectionService) as jasmine.SpyObj<ConnectionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('init', () => {
    const form = component.form;
    expect(form.get('userName')?.value).toBe('');
    expect(form.get('room')?.value).toBe('');
  });

  it('should error when not join room ', async () => {
    const userName = 'user';
    const roomId = 'room1';
    const error = new Error('Join room error');

    component.form.setValue({ userName, room: roomId });
    connectionService.joinRoom.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    try {
      await component.joinRoom();
    } catch (e) {
      expect(console.error).toHaveBeenCalledWith('Error', error);
    }
  });
});
