import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCreadentialDto } from '../dto/auth-creadential.dto';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCreadentialDto: AuthCreadentialDto) {
    const { username, password } = authCreadentialDto;
    const salt = await bcrypt.genSalt();
    const user = new User();
    user.username = username;
    user.password = password;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);
    try {
      return await this.save(user);
    } catch (err) {
      console.log(err.code);
      if (err.code == 23505) {
        throw new ConflictException('Username already exists');
      } else {
        throw new BadRequestException(err.message);
      }
    }
  }

  private async hashPassword(password: string, salt: any): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async validateUserPassword(
    authCreadentialDto: AuthCreadentialDto,
  ): Promise<string> {
    const { username, password } = authCreadentialDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
