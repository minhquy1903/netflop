import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO, UserRegisterDTO } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

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
  register(@Body() userRegisterDto: UserRegisterDTO) {
    return this.authService.register(userRegisterDto);
  }
}
