import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailConfirmation(email: string, url: string) {
    this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Netflop! Confirm your Email',
      template: './confirmation',
      context: {
        url,
      },
    });
  }
}
