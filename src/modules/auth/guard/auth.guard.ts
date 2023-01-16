import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { AuthDecoratorKey } from "../auth.constants";
import { UnauthorizedException } from "@/errors";
import { UserService } from "@/modules/users";
import { AuthService } from "../auth.service";
import { Session } from "@prisma/client";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * @param reflector The reflector
	 * @param auth The auth service
	 */
	constructor(private reflector: Reflector, private auth: AuthService) {}

	/**
	 * Run the authentication strategy against a request
	 * @param context The execution context
	 *
	 * @returns Whether the guard can activate
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const authMetadata = this.reflector.getAllAndOverride(AuthDecoratorKey.AUTH_GUARD, [
			context.getHandler(),
			context.getClass(),
		]);

		if (authMetadata) {
			const request = context.switchToHttp().getRequest<Request>();
			const authorization = request.get("authorization") ?? "";
			const session = await this.auth.authenticate(authorization);
			if (!session) {
				throw new UnauthorizedException();
			}

			request.authenticatedUser = session.user;
			request.authenticatedSession = session;
		}

		return true;
	}
}

export const Auth = () => {
	return SetMetadata(AuthDecoratorKey.AUTH_GUARD, true);
};

declare module "express" {
	export interface Request {
		authenticatedUser: UserService.UserWithEmail;
		authenticatedSession: Session;
	}
}
