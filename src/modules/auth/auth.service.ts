import { EmailConflictException, UsernameConflictException } from "@/errors";
import { SessionService } from "@/modules/sessions";
import { UserService } from "@/modules/users";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Session } from "@prisma/client";
import { hash } from "bcrypt";

@Injectable()
export class AuthService {
	/**
	 * @param config The config service
	 * @param users The user service
	 * @param sessions The session service
	 */
	constructor(
		private config: ConfigService,
		private users: UserService,
		private sessions: SessionService,
	) {}

	/**
	 * Signup a new user
	 * @param options The signup options
	 *
	 * @returns The user, session and authorization token
	 */
	async signup(options: AuthService.SignupOptions): Promise<AuthService.SignupResult> {
		const existingUserWithEmail = await this.users.findByEmail(options.email);
		if (existingUserWithEmail) {
			throw new EmailConflictException();
		}

		const existingUserWithUsername = await this.users.findByUsername(options.username);
		if (existingUserWithUsername) {
			throw new UsernameConflictException();
		}

		const saltRounds = this.config.getOrThrow<number>("security.passwordSaltRounds");
		const hashedPassword = await hash(options.password, saltRounds);

		const user = await this.users.create({ ...options, hashedPassword });
		const session = await this.sessions.create(user.id, options);

		// TODO: send email verification

		return {
			user,
			session,
			token: session.authorization,
		};
	}
}

export namespace AuthService {
	export interface SignupOptions
		extends Omit<UserService.CreateOptions, "hashedPassword">,
			SessionService.CreateOptions {
		password: string;
	}

	export interface SignupResult {
		user: UserService.UserWithEmails;
		session: Session;
		token: string;
	}
}
