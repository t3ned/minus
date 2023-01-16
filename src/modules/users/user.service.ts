import { UserNotFoundException } from "@/errors";
import { PrismaService } from "@/providers";
import { snowflake } from "@/utils";
import { Injectable } from "@nestjs/common";
import { Email, User } from "@prisma/client";
import normalizeEmail from "normalize-email";

@Injectable()
export class UserService {
	/**
	 * @param prisma The prisma service
	 */
	constructor(private prisma: PrismaService) {}

	/**
	 * Create a user
	 * @param options The create options
	 *
	 * @returns The user, with emails
	 */
	async create(options: UserService.CreateOptions): Promise<UserService.UserWithEmail> {
		return this.prisma.$transaction(async (prisma) => {
			const user = await prisma.user.create({
				data: {
					id: snowflake.generate(),
					displayName: options.username,
					username: options.username,
					normalizedUsername: options.username.toLocaleLowerCase(),
					firstName: options.firstName,
					lastName: options.lastName,
					password: options.hashedPassword,
					countryCode: options.countryCode,
					languageCode: options.languageCode,
					gender: options.gender,
					roles: 0n,
					flags: 0n,
					publicFlags: 0n,
					updatedAt: new Date(),
				},
			});

			const primaryEmail = await prisma.email.create({
				data: {
					id: snowflake.generate(),
					email: options.email,
					normalizedEmail: normalizeEmail(options.email),
					isVerified: false,
					updatedAt: new Date(),
					user: {
						connect: {
							id: user.id,
						},
					},
					primaryUser: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			return {
				...user,
				primaryEmailId: primaryEmail.id,
				primaryEmail: primaryEmail,
			};
		});
	}

	/**
	 * Find a user by email
	 * @param id The id of the user
	 *
	 * @returns The user, if found
	 */
	findById(id: bigint): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
		});
	}

	/**
	 * Find a user by email, or throw if not found
	 * @param id The id of the user
	 *
	 * @returns The user
	 */
	async findByIdOrThrow(id: bigint): Promise<User> {
		const user = await this.findById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Find a user by email
	 * @param email The email to lookup
	 *
	 * @returns The user, if found
	 */
	findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findFirst({
			where: {
				emails: {
					some: {
						normalizedEmail: normalizeEmail(email),
					},
				},
			},
		});
	}

	/**
	 * Find a user by username
	 * @param username The username to lookup
	 *
	 * @returns The user, if found
	 */
	findByUsername(username: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				normalizedUsername: username.toLocaleLowerCase(),
			},
		});
	}

	/**
	 * Find a user by username, or throw if not found
	 * @param username The username to lookup
	 *
	 * @returns The user
	 */
	async findByUsernameOrThrow(username: string): Promise<User> {
		const user = await this.findByUsername(username);
		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Find a user by email or username
	 * @param username The email or username
	 *
	 * @returns The user, if found
	 */
	findByEmailOrUsername(username: string): Promise<User | null> {
		return this.prisma.user.findFirst({
			where: {
				OR: [
					{
						emails: {
							some: {
								normalizedEmail: normalizeEmail(username),
							},
						},
					},
					{
						normalizedUsername: username.toLocaleLowerCase(),
					},
				],
			},
		});
	}

	/**
	 * Search for a user by username
	 * @param username The username to search
	 * @param options The search options
	 *
	 * @returns The users
	 */
	searchByUsername(username: string, options: UserService.SearchOptions): Promise<User[]> {
		return this.prisma.user.findMany({
			where: {
				normalizedUsername: {
					startsWith: username.toLocaleLowerCase(),
				},
			},
			orderBy: {
				username: "asc",
			},
			take: options.limit,
		});
	}
}

export namespace UserService {
	export enum Gender {
		Male,
		Female,
		NonBinary,
		PreferNotToSay,
		Other,
	}

	export interface CreateOptions {
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		hashedPassword: string;
		countryCode: string;
		languageCode: string;
		gender: Gender;
	}

	export interface UserWithEmail extends User {
		primaryEmail: Email | null;
	}

	export interface SearchOptions {
		limit: number;
	}
}
