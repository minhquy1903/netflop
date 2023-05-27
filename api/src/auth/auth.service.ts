import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO, UserRegisterDTO } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from 'src/config/config.service';
import { JWTPayload } from './jwt/interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(userLogin: UserLoginDTO) {
    const { email, password } = userLogin;

    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    const passwordMatching = await bcrypt.compare(password, user.password);

    if (!passwordMatching)
      throw new UnauthorizedException('Your email or password is invalid');

    return {
      data: {
        accessToken: await this.generateJwtAccessToken({ uid: user.id }),
      },
    };
  }

  async register(userRegister: UserRegisterDTO) {
    const { email, password } = userRegister;

    const existedUser = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (existedUser) throw new BadRequestException('Email is taken');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: { id: true },
    });

    return { data: newUser.id };
  }

  async generateJwtAccessToken(payload: JWTPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.accessExpires'),
      privateKey: this.configService.get('jwt.accessSecret'),
    });
  }
}
