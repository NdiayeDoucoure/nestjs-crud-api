import { Injectable } from '@nestjs/common';
import { AuthBody } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async login({ authBody }: { authBody: AuthBody }) {
    const { email, password } = authBody;

    const hashPassword = await this.hashPassword(password);
    console.log(hashPassword, password);

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email: authBody.email,
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
    return existUser;
  }

  private async hashPassword(password: string) {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid(password: string, hashedPassword: string) {
    const isPasswordValid = await compare(password, hashedPassword);
    return isPasswordValid;
  }
}
