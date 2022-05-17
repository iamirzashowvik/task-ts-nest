import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { AuthCreadentialDto } from './dto/auth-creadential.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPlayload } from './interface/jwt-playload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authCreadentialDto: AuthCreadentialDto): Promise<User> {
    return this.userRepository.signUp(authCreadentialDto);
  }
  async signIn(authCreadentialDto: AuthCreadentialDto): Promise<User | any> {
    const username = await this.userRepository.validateUserPassword(
      authCreadentialDto,
    );
    if (username) {
      const playload: JwtPlayload = { username };
      const accessToken = this.jwtService.sign(playload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Username or password is incorrect');
    }
  }
}
