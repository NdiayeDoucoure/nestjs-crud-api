import { Injectable } from '@nestjs/common';
import { AuthBody } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async login({ authBody }: { authBody: AuthBody }) {
    const { email, password } = authBody;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!existUser) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.isPasswordValid(
      password,
      existUser.password,
    );

    if (!isPasswordValid) {
      throw new Error('Password is incorrect');
    }
    return await this.authenticateUser(existUser.id.toString());
    //const hashPassword = await this.hashPassword(password);
  }

  private async hashPassword(password: string) {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid(password: string, hashedPassword: string) {
    const isPasswordValid = await compare(password, hashedPassword);
    return isPasswordValid;
  }

  private async authenticateUser(userId: string) {
    const payload = { userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
