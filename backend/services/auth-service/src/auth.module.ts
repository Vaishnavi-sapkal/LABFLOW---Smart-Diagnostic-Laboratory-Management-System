import { BadRequestException, Module, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserSchema } from './auth.schema';
import { AuthController, HealthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RegistrationGuard } from './registration.guard';

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

  controllers: [AuthController, HealthController],

  providers: [
    {
      provide: 'AUTH_LOGIC',

      inject: [
        getModelToken(User.name),
        JwtService,
        ConfigService,
      ],

      useFactory: (
        userModel: Model<User>,
        jwtService: JwtService,
        configService: ConfigService,
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

        listUsers: async () => {
          const users = await userModel.find().select('-password').sort({ createdAt: -1 }).lean().exec();
          return users.map((user: any) => ({
            id: String(user._id), name: user.name, email: user.email, role: user.role, isActive: user.isActive,
          }));
        },

        getActiveUser: async (userId: string) => {
          const user = await userModel.findById(userId).select('-password').lean().exec();
          if (!user || !user.isActive) throw new Error('User account is inactive');
          return { userId: String(user._id), email: user.email, role: user.role };
        },

        deleteUser: async (id: string, actorUserId: string) => {
          if (!isValidObjectId(id)) throw new BadRequestException('A valid user ID is required');
          if (String(id) === String(actorUserId)) {
            throw new Error('You cannot delete your own account while logged in.');
          }

          const user = await userModel.findById(id).exec();
          if (!user) throw new NotFoundException('User account was not found');

          // Fail closed: an interrupted deletion leaves a disabled account, never an
          // active account whose profile has already been removed/deactivated.
          if (user.isActive) {
            user.isActive = false;
            await user.save();
          }

          const internalSecret = configService.get<string>('INTERNAL_SERVICE_SECRET');
          if (!internalSecret) throw new ServiceUnavailableException('INTERNAL_SERVICE_SECRET is not configured');
          const baseUrl = user.role === 'doctor'
            ? configService.get<string>('DOCTOR_SERVICE_URL') ?? 'http://localhost:3005'
            : configService.get<string>('PATIENT_SERVICE_URL') ?? 'http://localhost:3002';
          const path = user.role === 'doctor'
            ? `/doctors/by-user/${encodeURIComponent(String(user._id))}/deactivate`
            : `/patients/by-user/${encodeURIComponent(String(user._id))}`;

          if (user.role === 'doctor' || user.role === 'patient') {
            let response: Response;
            try {
              response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
                method: user.role === 'doctor' ? 'PATCH' : 'DELETE',
                headers: { 'x-internal-service-key': internalSecret },
              });
            } catch {
              throw new ServiceUnavailableException(`Unable to contact the ${user.role} service`);
            }
            if (!response.ok) {
              throw new ServiceUnavailableException(`Unable to ${user.role === 'doctor' ? 'deactivate the doctor profile' : 'delete the patient profile'}`);
            }
          }

          await user.deleteOne();
          return { deleted: true, id: String(user._id), role: user.role };
        },
      }),
    },

    // =========================
    // JWT STRATEGY
    // =========================
    JwtStrategy,
    RegistrationGuard,
  ],
})
export class AuthModule {}
