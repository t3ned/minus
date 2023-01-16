import { InvalidCredentialsException, UserNotFoundException } from "@/errors";
import { SessionService } from "@/modules/sessions";
import { ConfigService } from "@nestjs/config";
import { UserService } from "@/modules/users";
import { safeBigInt, sha256 } from "@/utils";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";

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
	async signup(options: AuthService.SignupOptions): Promise<AuthService.AuthenticatedResult> {
		await this.users.checkEmailConflict(options.email);
		await this.users.checkUsernameConflict(options.username);

		const saltRounds = this.config.getOrThrow<number>("security.passwordSaltRounds");
		const hashedPassword = await hash(options.password, saltRounds);

		const user = await this.users.create({ ...options, hashedPassword });
		const session = await this.sessions.create(user.id, options);

		// TODO: send email verification

		return {
			token: session.authorization,
		};
	}

	/**
	 * Login to an existing user
	 * @param options The login options
	 *
	 * @returns The user, session and authorization token
	 */
	async login(options: AuthService.LoginOptions): Promise<AuthService.AuthenticatedResult> {
		const user = await this.users.findByEmailOrUsername(options.username);
		if (!user) {
			throw new UserNotFoundException();
		}

		const isValidCredentials = await compare(options.password, user.password);
		if (!isValidCredentials) {
			throw new InvalidCredentialsException();
		}

		const session = await this.sessions.create(user.id, options);

		return {
			token: session.authorization,
		};
	}

	/**
	 * Logout the current session
	 * @param currentSessionId The current session id
	 */
	async logout(currentSessionId: bigint): Promise<void> {
		await this.sessions.logout(currentSessionId);
	}

	/**
	 * Logout of sessions
	 * @param userId The id of the user
	 * @param currentSessionId The current session id
	 * @param sessionIds The session ids to logout
	 */
	async logoutSessions(userId: bigint, currentSessionId: bigint, sessionIds: bigint[]): Promise<void> {
		const uniqueSessionIds = [...new Set(sessionIds)];
		const filteredSessionIds = uniqueSessionIds.filter((sessionId) => sessionId !== currentSessionId);
		if (!filteredSessionIds.length) return;

		const sessions = await this.sessions.findManyByUserIdAndSessionIds(userId, filteredSessionIds);
		await Promise.allSettled(sessions.map((session) => this.sessions.logout(session.id)));
	}

	/**
	 * Authenticate using a token
	 * @param fullToken The full token ({base64 |> user_id}.${version}.{token})
	 *
	 * @returns The session, if it exists
	 */
	async authenticate(fullToken: string): Promise<SessionService.SessionWithUser | null> {
		const [base64UserId, version, token] = fullToken.split(".");
		if (!base64UserId || !version || !token) return null;

		const userId = safeBigInt(Buffer.from(base64UserId, "base64url").toString("utf-8"));
		if (!userId) return null;

		const session = await this.sessions.findSessionByUserIdAndVersion(userId, version);
		if (!session || !session.isActive || session.token !== sha256(token)) return null;

		return session;
	}
}

export namespace AuthService {
	export interface SignupOptions
		extends Omit<UserService.CreateOptions, "hashedPassword">,
			SessionService.CreateOptions {
		password: string;
	}

	export interface LoginOptions extends SessionService.CreateOptions {
		username: string;
		password: string;
	}

	export interface AuthenticatedResult {
		token: string;
	}
}
