import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import {
  ResendConfirmEmailDTO,
  UserLoginDTO,
  UserRegisterDTO,
  VerifyEmailDTO,
} from 'src/modules/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from 'src/modules/config/config.service';
import { JWTPayload } from './jwt/interface';
import { MailService } from 'src/modules/mail/mail.service';
import { getConfirmSentCacheKey, MINUTE, SECOND } from 'src/utils/cache';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
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

  async register(userRegister: UserRegisterDTO, origin: string) {
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

    this.sendConfirmEmail(newUser.id, email, origin);

    return { data: newUser.id };
  }

  async resendConfirmEmail(
    resendConfirmEmailDTO: ResendConfirmEmailDTO,
    origin: string,
  ) {
    const { email } = resendConfirmEmailDTO;

    const user = await this.prismaService.user.findFirst({
      where: { email },
      select: {
        id: true,
        verified: true,
      },
    });

    if (user.verified)
      throw new BadRequestException(`Email ${email} is verified`);

    const isRecentUrlExisted = await this.cacheService.get(
      getConfirmSentCacheKey(user.id),
    );

    console.log(
      'getConfirmSentCacheKey(user.id)',
      getConfirmSentCacheKey(user.id),
    );

    console.log({ isRecentUrlExisted });

    if (isRecentUrlExisted) throw new BadRequestException('In waiting time!');

    this.sendConfirmEmail(user.id, email, origin);

    return { data: true };
  }

  async verifyEmail({ token }: VerifyEmailDTO) {
    try {
      const { uid } = this.jwtService.verify<JWTPayload>(token, {
        secret: this.configService.get('jwt.confirmSecret'),
      });

      const updatedUser = await this.prismaService.user.update({
        where: {
          id: uid,
        },
        data: {
          verified: true,
        },
        select: {
          id: true,
          email: true,
          verified: true,
        },
      });

      const accessToken = await this.generateJwtAccessToken({ uid });

      return {
        accessToken,
        data: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendConfirmEmail(uid: string, email: string, origin: string) {
    const token = await this.generateConfirmationToken({ uid });

    const url = this.generateConfirmationUrl(token, origin);

    this.mailService.sendEmailConfirmation(email, url);

    await this.cacheService.get(getConfirmSentCacheKey(uid));

    this.cacheService.set(
      getConfirmSentCacheKey(uid),
      true,
      MINUTE + 30 * SECOND,
    );
  }

  generateConfirmationUrl(token: string, origin: string) {
    return `${origin}/auth/verify-email?token=${token}`;
  }

  async generateJwtAccessToken(payload: JWTPayload) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get('jwt.accessSecret'),
      expiresIn: this.configService.get('jwt.accessExpires'),
    });
  }

  async generateConfirmationToken(payload: JWTPayload) {
    return this.jwtService.sign(payload, {
      privateKey: this.configService.get('jwt.confirmSecret'),
      expiresIn: this.configService.get('jwt.confirmExpires'),
    });
  }
}
