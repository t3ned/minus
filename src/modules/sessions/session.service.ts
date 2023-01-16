import { PrismaService } from "@/providers";
import { sha256, snowflake } from "@/utils";
import { Injectable } from "@nestjs/common";
import { Session } from "@prisma/client";
import { UserService } from "../users";
import { randomBytes } from "crypto";
import UAParser from "ua-parser-js";
import geoip from "geoip-lite";

@Injectable()
export class SessionService {
	/**
	 * @param prisma The prisma service
	 */
	constructor(private prisma: PrismaService) {}

	/**
	 * Create a session
	 * @param userId The id of the user belonging to this session
	 * @param options The create options
	 *
	 * @returns The session
	 */
	async create(
		userId: bigint,
		options: SessionService.CreateOptions,
	): Promise<SessionService.SessionServiceWithAuthorization> {
		const { hashedToken, version, authorization } = this.createToken(userId);
		const userAgent = options.userAgent ? new UAParser(options.userAgent).getResult() : null;
		const geolocation = geoip.lookup(options.ipAddress);

		const session = await this.prisma.session.create({
			data: {
				id: snowflake.generate(),
				token: hashedToken,
				version,
				isActive: true,
				ipAddress: options.ipAddress,
				userAgent: options.userAgent,
				city: geolocation?.city,
				region: geolocation?.region,
				timezone: geolocation?.timezone,
				countryCode: geolocation?.country.toString(),
				browser: userAgent?.browser.name,
				operatingSystem: userAgent?.os.name,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return { ...session, authorization };
	}

	/**
	 * Logout of a session
	 * @param id The id of the session
	 *
	 * @returns The session
	 */
	logout(id: bigint): Promise<Session> {
		return this.prisma.session.update({
			where: {
				id,
			},
			data: {
				isActive: false,
			},
		});
	}

	/**
	 * Find many sessions by user id and session ids
	 * @param userId The user id
	 * @param sessionIds The ids of the sessions
	 *
	 * @returns The session, if found
	 */
	findManyByUserIdAndSessionIds(userId: bigint, sessionIds: bigint[]): Promise<Session[]> {
		return this.prisma.session.findMany({
			where: {
				id: {
					in: sessionIds,
				},
				userId,
			},
		});
	}

	/**
	 * Find a session by user id and version
	 * @param userId The id of the user
	 * @param version The session version
	 *
	 * @returns The session with user
	 */
	findSessionByUserIdAndVersion(
		userId: bigint,
		version: string,
	): Promise<SessionService.SessionWithUser | null> {
		return this.prisma.session.findUnique({
			include: {
				user: {
					include: {
						primaryEmail: true,
					},
				},
			},
			where: {
				userVersion: {
					userId,
					version,
				},
			},
		});
	}

	/**
	 * Find many active sessions for a user
	 * @param userId The id of the user
	 *
	 * @returns The sessions
	 */
	findManyForUserId(userId: bigint): Promise<Session[]> {
		return this.prisma.session.findMany({
			where: {
				userId,
				isActive: true,
			},
			orderBy: {
				id: "asc",
			},
		});
	}

	/**
	 * Create a authorization token
	 * @param userId The id of the user owning the token
	 *
	 * @returns The token
	 */
	private createToken(userId: bigint): SessionService.Token {
		const base64UserId = Buffer.from(userId.toString()).toString("base64url");
		const token = randomBytes(16).toString("hex");
		const version = randomBytes(4).toString("hex");

		return {
			token,
			version,
			hashedToken: sha256(token),
			authorization: `${base64UserId}.${version}.${token}`,
		};
	}
}

export namespace SessionService {
	export interface CreateOptions {
		ipAddress: string;
		userAgent: string | null;
	}

	export interface SessionServiceWithAuthorization extends Session {
		authorization: string;
	}

	export interface SessionWithUser extends Session {
		user: UserService.UserWithEmail;
	}

	export interface Token {
		token: string;
		hashedToken: string;
		version: string;
		authorization: string;
	}
}
