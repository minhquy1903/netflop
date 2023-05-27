import { AppConfigModule } from 'src/config/config.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { appConfigs } from './config/config.service';

@Module({
  imports: [
    AuthModule,
    AppConfigModule.forRoot({
      isGlobal: true,
      load: appConfigs,
      envFilePath: ['.env'],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
