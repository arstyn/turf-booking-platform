import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole, OnboardingStatus } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserOnboardingDto, TurfOwnerOnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      onboardingStatus: OnboardingStatus.PENDING,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;

    const token = this.jwtService.sign({ sub: savedUser.id, role: savedUser.role });

    return {
      user: result,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user;
    const token = this.jwtService.sign({ sub: user.id, role: user.role });

    return {
      user: result,
      token,
    };
  }

  async completeUserOnboarding(userId: string, dto: UserOnboardingDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.role !== UserRole.USER) {
      throw new UnauthorizedException('Invalid user');
    }

    Object.assign(user, dto);
    user.onboardingStatus = OnboardingStatus.COMPLETED;

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;

    return result;
  }

  async completeTurfOwnerOnboarding(
    userId: string,
    dto: TurfOwnerOnboardingDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.role !== UserRole.TURF_OWNER) {
      throw new UnauthorizedException('Invalid user');
    }

    Object.assign(user, dto);
    user.onboardingStatus = OnboardingStatus.COMPLETED;

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;

    return result;
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}

