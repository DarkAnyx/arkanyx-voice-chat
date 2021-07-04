import * as fs from 'fs';
import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { MessagesService } from './messages.service';

@Controller('/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('/:filename?')
  @UseInterceptors(FileInterceptor('message'))
  getMessages(@Param('filename') filename: string, @Res() res: Response) {
    if (filename) {
        const exists = fs.existsSync(`apps/avc-backend/filestorage/${filename}`);
        if (exists) fs.createReadStream(`apps/avc-backend/filestorage/${filename}`).pipe(res);
        if (!exists) res.status(404).json({ error: 'File not found' });
    } else {
      const files = fs.readdirSync('apps/avc-backend/filestorage');
      const messages = files.map((file) => ({
        login: file.split('_')[0],
        url: `/api/messages/${file}`,
        date: file.split('_')[1].split('.')[0],
      }));

      res.status(200).json({ status: 200, messages });
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('message'))
  uploadMessage(@UploadedFile() message: any, @Body('username') username: string) {
    const saved = fs.createWriteStream(`apps/avc-backend/filestorage/${username}_${Date.now()}.webm`).write(message.buffer);

    return { status: 200, saved };
  }
}
