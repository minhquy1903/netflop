import { PrismaModule } from 'src/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/config/config.module';

@Module({
  imports: [PrismaModule, JwtModule, AppConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
