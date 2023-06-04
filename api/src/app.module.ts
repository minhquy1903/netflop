import { AppConfigModule } from 'src/modules/config/config.module';
import { CacheModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { appConfigs } from './modules/config/config.service';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    AuthModule,
    MailModule,
    CacheModule.register({
      isGlobal: true,
    }),
    AppConfigModule.forRoot({
      isGlobal: true,
      load: appConfigs,
      envFilePath: ['.env'],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
