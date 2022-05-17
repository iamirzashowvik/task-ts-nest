import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPlayload } from './interface/jwt-playload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';

import * as config from 'config';

const jwtConfig = config.get('jwt');
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.secret,
    });
  }
  async validate(payload: JwtPlayload): Promise<string> {
    const { username } = payload;

    return username;
  }
}
