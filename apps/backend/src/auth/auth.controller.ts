import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserOnboardingDto, TurfOwnerOnboardingDto } from './dto/onboarding.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/user')
  async completeUserOnboarding(
    @Request() req,
    @Body() dto: UserOnboardingDto,
  ) {
    return this.authService.completeUserOnboarding(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/turf-owner')
  async completeTurfOwnerOnboarding(
    @Request() req,
    @Body() dto: TurfOwnerOnboardingDto,
  ) {
    return this.authService.completeTurfOwnerOnboarding(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const { password, ...user } = req.user;
    return user;
  }
}

