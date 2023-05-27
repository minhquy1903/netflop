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

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT),
  apiPrefix: process.env.API_PREFIX,
}));

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpires: process.env.JWT_ACCESS_EXPIRES,
}));

export const appConfigs = [appConfig, jwtConfig];

export class ConfigService extends NestjsConfigService<
  GetConfig<[typeof appConfig, typeof jwtConfig]>
> {}
