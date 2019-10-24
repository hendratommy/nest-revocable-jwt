import { Injectable, Inject } from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as uuidv4 from 'uuid/v4';
import * as Redis from 'ioredis';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('IOREDIS') private readonly redis: Redis.Redis,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // we will use jti (JWT ID https://tools.ietf.org/html/rfc7519#page-10) to lookup if the token exists in redis store
    const jti = uuidv4();

    const payload = { userId: user.id, username: user.username };

    await this.redis.set(
      `jti:${jti}`,
      JSON.stringify(payload),
      'EX',
      jwtConstants.expiresIn,
    );

    return {
      access_token: this.jwtService.sign({ jti, ...payload }),
    };
  }

  async logout(user: any) {
    // revoke the jwt on logout

    const { jti } = user;

    this.redis.del(`jti:${jti}`);
  }
}
