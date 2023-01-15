import { PrismaService } from "@/providers";
import { sha256, snowflake } from "@/utils";
import { Session } from "@prisma/client";
import { randomBytes } from "crypto";
import UAParser from "ua-parser-js";
import geoip from "geoip-lite";

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
				countryCode: geolocation?.country,
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

	export interface Token {
		token: string;
		hashedToken: string;
		version: string;
		authorization: string;
	}
}
