import { Controller, Post, Body, UsePipes, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ResendConfirmEmailDTO,
  UserLoginDTO,
  UserRegisterDTO,
  VerifyEmailDTO,
} from 'src/modules/auth/dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Origin } from 'src/decorators/origin.decorator';

@Controller('auth')
@ApiTags('Auth')
@UsePipes(ZodValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login api',
    description:
      'Password must have at least 8 chars, contain at least 1 number or char',
  })
  login(@Body() userLoginDto: UserLoginDTO) {
    return this.authService.login(userLoginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register api',
    description:
      'Password must have at least 8 chars, contain both special letter, lowercase and uppercase',
  })
  register(@Body() userRegisterDto: UserRegisterDTO, @Origin() origin) {
    return this.authService.register(userRegisterDto, origin);
  }

  @Post('resend-confirm-email')
  @ApiOperation({
    summary: 'Resend confirm email api',
    description: 'System send a link to user email for verification',
  })
  resendConfirmEmail(
    @Body() resendConfirmEmailDTO: ResendConfirmEmailDTO,
    @Origin() origin,
  ) {
    return this.authService.resendConfirmEmail(resendConfirmEmailDTO, origin);
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verify link url api',
    description: 'Verify user email when user click to confirm link',
  })
  verifyEmail(@Body() verifyEmail: VerifyEmailDTO) {
    return this.authService.verifyEmail(verifyEmail);
  }
}
