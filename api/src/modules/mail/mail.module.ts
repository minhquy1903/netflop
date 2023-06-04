import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';
import { join } from 'path';
import { AppConfigModule } from 'src/modules/config/config.module';
import { ConfigService } from 'src/modules/config/config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [AppConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('email.host'),
          secure: false,
          port: config.get('email.port'),
          auth: {
            user: config.get('email.user'),
            pass: config.get('email.password'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('email.from')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
