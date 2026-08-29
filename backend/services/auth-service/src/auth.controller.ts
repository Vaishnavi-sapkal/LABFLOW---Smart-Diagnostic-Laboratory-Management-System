import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_LOGIC')
    private readonly authLogic: any,
  ) {}

  // =========================
  // REGISTER
  // =========================

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  async register(@Body() data: RegisterUserDto) {
    return this.authLogic.register(data);
  }

  // =========================
  // LOGIN
  // =========================

  @Post('login')
  @ApiOperation({
    summary: 'Login user and generate JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful and JWT token generated',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async login(@Body() data: LoginUserDto) {
    return this.authLogic.login(data);
  }

  // =========================
  // JWT PROTECTED ENDPOINT
  // =========================

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Test JWT protected endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token is valid',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  getProtected(@Req() req: any) {
    return {
      message: 'JWT authentication successful',
      user: req.user,
    };
  }

  // =========================
  // ADMIN ONLY ENDPOINT
  // =========================

  @Get('admin-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Test admin-only access',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin access granted',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  getAdminTest(@Req() req: any) {
    return {
      message: 'Admin access granted',
      user: req.user,
    };
  }
}
