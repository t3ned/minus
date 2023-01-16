import { SignupEmailConflictException } from "@/errors";
import { SessionService } from "@/modules/sessions";
import { UserService } from "@/modules/users";
import { Session } from "@prisma/client";

export class AuthService {
	/**
	 * @param users The user service
	 * @param sessions The session service
	 */
	constructor(private users: UserService, private sessions: SessionService) {}

	/**
	 * Signup a new user
	 * @param options The signup options
	 *
	 * @returns The user, session and authorization token
	 */
	async signup(options: AuthService.SignupOptions): Promise<AuthService.SignupResult> {
		const existingUser = await this.users.findByEmail(options.email);
		if (existingUser) {
			throw new SignupEmailConflictException();
		}

		const user = await this.users.create(options);
		const session = await this.sessions.create(user.id, options);

		return {
			user,
			session,
			token: session.authorization,
		};
	}
}

export namespace AuthService {
	export type SignupOptions = UserService.CreateOptions & SessionService.CreateOptions;

	export interface SignupResult {
		user: UserService.UserWithEmails;
		session: Session;
		token: string;
	}
}
