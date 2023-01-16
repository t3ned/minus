import { UserService } from "./user.service";
import { Injectable } from "@nestjs/common";
import { Email } from "@prisma/client";

@Injectable()
export class UserMapper {
	/**
	 * Map the current user
	 * @param user The current user
	 *
	 * @returns The mappped user
	 */
	mapCurrent(user: UserService.UserWithEmail): UserMapper.CurrentUser {
		const primaryEmail = user.primaryEmail as Email;

		return {
			id: user.id.toString(),
			email: primaryEmail.email as string,
			email_verified: primaryEmail.isVerified ?? false,
			display_name: user.displayName,
			username: user.username,
			full_name: `${user.firstName} ${user.lastName}`,
			first_name: user.firstName,
			last_name: user.lastName,
			locale: `${user.languageCode}-${user.countryCode.toUpperCase()}`,
			gender: this.mapGender(user.gender),
			roles: Number(user.roles),
			flags: Number(user.flags),
			public_flags: Number(user.publicFlags),
		};
	}

	/**
	 * Map a gender
	 * @param gender The gender
	 *
	 * @returns The gender name
	 */
	private mapGender(gender: UserService.Gender): string {
		if (gender === UserService.Gender.Male) return "Male";
		if (gender === UserService.Gender.Female) return "Female";
		if (gender === UserService.Gender.NonBinary) return "Non-Binary";
		return "Other";
	}
}

export namespace UserMapper {
	export interface CurrentUser {
		id: string;
		email: string;
		email_verified: boolean;
		display_name: string;
		username: string;
		full_name: string;
		first_name: string;
		last_name: string;
		locale: string;
		gender: string;
		roles: number;
		flags: number;
		public_flags: number;
	}
}
