import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Message } from '../../models/message.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatStoreService } from '../../services/state/chat-store.service';
import { ConnectionService } from '../../services/connection/connection.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnDestroy, OnInit {
  form: FormGroup;
  messages$: Observable<Message[]>;
  currentUser: string = '';
  currentRoom: string = '';
  currentRoomName: string = '';
  usersListVisible: boolean = false;
  connectedUsers$: Observable<User[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private connectionService: ConnectionService,
    private chatStoreService: ChatStoreService,
    private datePipe: DatePipe,
    private toastrService: ToastrService,
  ) {
    this.form = this.fb.group({
      message: ['', Validators.required],
    });
    this.messages$ = this.chatStoreService.messages$;
    this.connectedUsers$ = this.chatStoreService.connectedUsers$;
  }

  async ngOnInit() {
    try {
      await this.getCurrentUserAndRoom();
      this.form.get('message')?.valueChanges.subscribe(value => this.checkForEnterKey(value));
      this.getNotification();
    } catch (error) {
      this.handleError(error, 'Error al cargar el componente.');
    }
  }

  private async getCurrentUserAndRoom() {
    this.chatStoreService.currentUser$.subscribe(user => this.currentUser = user.name);
    this.chatStoreService.currentRoom$.subscribe(room => {
      this.currentRoom = room?.id || ''
      this.currentRoomName = room?.name || ''
    });

    if (!this.currentUser || !this.currentRoom) {
      await this.router.navigate(['/']);
    }
  }

  private getNotification() {
    this.chatStoreService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        if (notification.content) {
          this.toastrService.info(notification.content, notification.title);
        }
      });
  }

  private checkForEnterKey(value: string | null) {
    if (value && value.endsWith('\n')) {
      this.sendMessage();
    }
  }

  toggleUsersList() {
    this.usersListVisible = !this.usersListVisible;
  }

  async sendMessage() {
    const message = this.form.get('message')?.value.trim();
    if (message) {
      try {
        await this.connectionService.sendMessage(this.currentUser, message, this.currentRoom);
        this.form.reset();
      } catch (error) {
        this.handleError(error, 'Error al enviar el mensaje.');
      }
    }
  }

  async leaveRoom() {
    if (this.currentRoom && this.currentUser) {
      try {
        await this.connectionService.leaveRoom(this.currentRoom, this.currentUser);
        await this.connectionService.sendNotification(this.currentUser, 'ha abandonado el chat');
        this.connectionService.stopConnection();
        this.chatStoreService.clearState();
        await this.router.navigate(['/']);
      } catch (error) {
        this.handleError(error, 'Error al salir del chat.');
      }
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MMM-yyyy') || '';
  }

  formatTime(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm') || '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleError(error: any, message: string) {
    console.error(message, error);
    //throw new Error(error);
  }
}
