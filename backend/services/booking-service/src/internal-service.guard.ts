import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth';

const INTERNAL_SERVICE_KEY = 'isInternalService';
export const InternalService = () => SetMetadata(INTERNAL_SERVICE_KEY, true);

@Injectable()
export class InternalServiceGuard extends JwtAuthGuard {
  constructor(private readonly metadata: Reflector, private readonly config: ConfigService) { super(metadata); }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const enabled = this.metadata.getAllAndOverride<boolean>(INTERNAL_SERVICE_KEY, [context.getHandler(), context.getClass()]);
    const secret = this.config.get<string>('INTERNAL_SERVICE_SECRET');
    if (enabled && secret && request.headers['x-internal-service-key'] === secret) {
      request.user = { userId: 'internal-service', role: 'admin' };
      return true;
    }
    return super.canActivate(context);
  }
}
