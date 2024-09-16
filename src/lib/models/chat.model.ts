import { Message } from './message.model';
import { Room } from './room.model';
import { User } from './user.model';

export class Chat {
  constructor(
    public messages: Message[],
    public currentRoom: Room,
    public currentUsers: User[],
  ) {}
}
