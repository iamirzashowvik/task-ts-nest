import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCreadentialDto } from './dto/auth-creadential.dto';
import { User } from './entities/user.entity';
import { GetUser } from './getuser-decorator';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCreadentialDto: AuthCreadentialDto): Promise<User> {
    return this.authService.signUp(authCreadentialDto);
  }
  @Post('/signin')
  async signIn(@Body() authCreadentialDto: AuthCreadentialDto): Promise<User> {
    return this.authService.signIn(authCreadentialDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    //@GetUser() user: User
    console.log(user);

    //  return user;
  }
}
