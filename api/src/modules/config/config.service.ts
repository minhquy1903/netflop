import {
  ConfigFactory,
  ConfigFactoryKeyHost,
  ConfigObject,
  registerAs,
  ConfigService as NestjsConfigService,
} from '@nestjs/config';

import { GetConfig } from './type';

declare module '@nestjs/config' {
  function registerAs<
    TConfig extends ConfigObject,
    TFactory extends ConfigFactory = ConfigFactory<TConfig>,
    Name extends string = '',
  >(
    token: Name,
    configFactory: TFactory,
  ): TFactory & ConfigFactoryKeyHost<ReturnType<TFactory>> & { name: Name };
}

const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT),
  apiPrefix: process.env.API_PREFIX,
}));

const jwtConfig = registerAs('jwt', () => ({
  confirmSecret: process.env.JWT_CONFIRM_SECRET,
  confirmExpires: process.env.JWT_CONFIRM_EXPIRES,
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpires: process.env.JWT_ACCESS_EXPIRES,
}));

const emailConfig = registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  user: process.env.EMAIL_USER,
  port: process.env.EMAIL_PORT,
  password: process.env.EMAIL_PASSWORD,
  from: process.env.EMAIL_FROM,
}));

export const appConfigs = [appConfig, jwtConfig, emailConfig];

export class ConfigService extends NestjsConfigService<
  GetConfig<[typeof appConfig, typeof jwtConfig, typeof emailConfig]>
> {}
