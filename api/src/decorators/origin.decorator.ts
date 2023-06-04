import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayload } from 'src/modules/auth/jwt/interface';

export const Origin = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JWTPayload }>();

    return request.headers['origin'];
  },
);
