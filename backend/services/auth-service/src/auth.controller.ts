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
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Shruti',
        },
        email: {
          type: 'string',
          example: 'shrutitest2026@gmail.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
        role: {
          type: 'string',
          example: 'patient',
        },
      },
      required: ['name', 'email', 'password', 'role'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  async register(@Body() data: any) {
    return this.authLogic.register(data);
  }

  // =========================
  // LOGIN
  // =========================

  @Post('login')
  @ApiOperation({
    summary: 'Login user and generate JWT token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'shrutitest2026@gmail.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful and JWT token generated',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async login(@Body() data: any) {
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