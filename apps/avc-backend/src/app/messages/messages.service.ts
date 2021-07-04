import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  getData(): { message: string } {
    return { message: 'Welcome to avc-backend!' };
  }
}
