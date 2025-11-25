import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.searchByEmail(loginDto.email);

    if (!user) throw new HttpException('Invalid credentials', 401);

    const comparePasswords = await compare(loginDto.password, user?.password);

    if (!comparePasswords) {
      throw new HttpException('Invalid credentials', 401);
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return {
      access_token: accessToken,
    };
  }

  async getProfile(userId: number) {
    const user = await this.userService.findOne(userId);
    return user;
  }
}
