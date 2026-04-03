import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

const HARDCODED_ADMIN = {
  email: 'admin@sca.com',
  password: 'adminsca2026',
  role: 'admin',
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto): Promise<{ message: string; user: { id: number; email: string; role: string } }> {
    // Hardcoded admin fallback — works without seeding
    if (
      loginDto.email === HARDCODED_ADMIN.email &&
      loginDto.password === HARDCODED_ADMIN.password
    ) {
      return {
        message: 'Login successful',
        user: { id: 0, email: HARDCODED_ADMIN.email, role: HARDCODED_ADMIN.role },
      };
    }

    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
