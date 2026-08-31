import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required by the API
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the current request
    const request = context.switchToHttp().getRequest();

    // Get the authenticated user from JWT
    const user = request.user;

    // If user information is not available
    if (!user) {
      throw new ForbiddenException('User information not found');
    }

    // Check whether the user's role is allowed
    const hasRole = requiredRoles.includes(user.role);

    // If the user's role is not allowed
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    // User has the required role
    return true;
  }
}