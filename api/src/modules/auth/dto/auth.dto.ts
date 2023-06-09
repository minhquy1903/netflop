import { zPassword } from 'src/utils/zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

import z from 'zod';

export const userLogin = z.object({
  email: z.string().trim().email('Email is invalid'),
  password: z.string(),
});

export class UserLoginDTO extends createZodDto(extendApi(userLogin)) {}

export const userRegister = z.object({
  email: z.string().trim().email('Email is invalid'),
  password: zPassword,
});

export class UserRegisterDTO extends createZodDto(extendApi(userRegister)) {}

export const resendConfirmEmail = z.object({
  email: z.string().trim().email('Email is invalid'),
});

export class ResendConfirmEmailDTO extends createZodDto(
  extendApi(resendConfirmEmail),
) {}

export const verifyEmail = z.object({
  token: z.string(),
});

export class VerifyEmailDTO extends createZodDto(extendApi(verifyEmail)) {}
