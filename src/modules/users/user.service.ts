import { EmailConflictException, UsernameConflictException, UserNotFoundException } from "@/errors";
import { PrismaService } from "@/providers";
import { Injectable } from "@nestjs/common";
import { Email, User } from "@prisma/client";
import normalizeEmail from "normalize-email";
import { snowflake } from "@/utils";

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
				emails: [primaryEmail],
			};
		});
	}

	/**
	 * Update a user
	 * @param user The user to update
	 * @param options The update options
	 *
	 * @returns The user
	 */
	async update(
		user: UserService.UserWithEmail,
		options: UserService.UpdateOptions,
	): Promise<UserService.UserWithEmail> {
		return this.prisma.$transaction(async (prisma) => {
			if (options.email) {
				const primaryEmail = user.primaryEmail as Email;

				if (primaryEmail.normalizedEmail !== normalizeEmail(options.email)) {
					const emailIds = user.emails
						.filter((email) => email.id !== primaryEmail.id)
						.map((email) => email.id);

					// delete previous email update requests
					if (emailIds.length) {
						await prisma.email.deleteMany({
							where: {
								id: {
									in: emailIds,
								},
							},
						});
					}

					await this.checkEmailConflict(options.email);
					await prisma.email.create({
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
						},
					});

					// TODO: send transfer email
				}
			}

			if (options.username && user.normalizedUsername !== options.username.toLocaleLowerCase()) {
				await this.checkUsernameConflict(options.username);
			}

			return prisma.user.update({
				include: {
					primaryEmail: true,
					emails: true,
				},
				where: {
					id: user.id,
				},
				data: {
					displayName: options.displayName,
					username: options.username,
					normalizedUsername: options.username?.toLocaleLowerCase(),
					firstName: options.firstName,
					lastName: options.lastName,
					countryCode: options.countryCode,
					languageCode: options.languageCode,
					gender: options.gender,
					updatedAt: new Date(),
				},
			});
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
	 * Check if a user exists with a given email
	 * @param email The email to check
	 */
	async checkEmailConflict(email: string): Promise<void> {
		const user = await this.findByEmail(email);
		if (user) {
			throw new EmailConflictException();
		}
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
	 * Check if a user exists with a given username
	 * @param email The email to check
	 */
	async checkUsernameConflict(username: string): Promise<void> {
		const user = await this.findByUsername(username);
		if (user) {
			throw new UsernameConflictException();
		}
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

	export interface UpdateOptions {
		email?: string;
		displayName?: string;
		username?: string;
		firstName?: string;
		lastName?: string;
		countryCode?: string;
		languageCode?: string;
		gender?: Gender;
	}

	export interface UserWithEmail extends User {
		primaryEmail: Email | null;
		emails: Email[];
	}

	export interface SearchOptions {
		limit: number;
	}
}
