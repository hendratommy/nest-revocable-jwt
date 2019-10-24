import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import * as Redis from 'ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('IOREDIS') private readonly redis: Redis.Redis) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const { jti } = payload;

    const storedStringPayload = await this.redis.get(`jti:${jti}`);

    if (storedStringPayload) {
      const storedPayload = JSON.parse(storedStringPayload);

      if (storedPayload.userId === payload.userId) {
        return { jti, id: payload.userId, username: payload.username };
      }
    }
    throw new UnauthorizedException();
  }
}
