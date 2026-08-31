import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserSchema } from './auth.schema';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:
            configService.get<string>('JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    {
      provide: 'AUTH_LOGIC',

      inject: [
        getModelToken(User.name),
        JwtService,
      ],

      useFactory: (
        userModel: Model<User>,
        jwtService: JwtService,
      ) => ({

        // =========================
        // REGISTER
        // =========================
        register: async (data: any) => {
          const email = data.email.toLowerCase().trim();

          const existingUser = await userModel.findOne({ email });

          if (existingUser) {
            throw new Error('Email already registered');
          }

          const hashedPassword = await bcrypt.hash(
            data.password,
            10,
          );

          const user = await userModel.create({
            name: data.name,
            email,
            password: hashedPassword,
            role: data.role,
            isActive: true,
          });

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          };
        },

        // =========================
        // LOGIN
        // =========================
        login: async (data: any) => {
          const email = data.email.toLowerCase().trim();

          const user = await userModel.findOne({ email });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
          );

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          if (!user.isActive) {
            throw new Error('User account is inactive');
          }

          const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
          };

          const accessToken = jwtService.sign(payload);

          return {
            access_token: accessToken,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              isActive: user.isActive,
            },
          };
        },
      }),
    },

    // =========================
    // JWT STRATEGY
    // =========================
    JwtStrategy,
  ],
})
export class AuthModule {}