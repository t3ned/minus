import { Body, Controller, Headers, HttpCode, HttpStatus, Ip, Post, Version } from "@nestjs/common";
import { LoginBodyDTO, LoginBodyDTOType, SignupBodyDTO, SignupBodyDTOType } from "./dto";
import { AuthService } from "./auth.service";
import { UserMapper } from "../users/user.mapper";

@Controller("auth")
export class AuthController {
	/**
	 * @param auth The auth service
	 * @param userMapper The user mapper
	 */
	constructor(private auth: AuthService, private userMapper: UserMapper) {}

	@Post("signup")
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	async signup(
		@Body(SignupBodyDTO()) body: SignupBodyDTOType,
		@Headers("user-agent") userAgent: string,
		@Ip() ipAddress: string,
	) {
		const { user, token } = await this.auth.signup({
			email: body.email,
			username: body.username,
			firstName: body.first_name,
			lastName: body.last_name,
			password: body.password,
			countryCode: body.country_code,
			languageCode: body.language_code,
			gender: body.gender,
			ipAddress,
			userAgent,
		});

		return this.userMapper.mapCurrentWithToken(user, token);
	}

	@Post("login")
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	async login(
		@Body(LoginBodyDTO()) body: LoginBodyDTOType,
		@Headers("user-agent") userAgent: string,
		@Ip() ipAddress: string,
	) {
		const { user, token } = await this.auth.login({
			username: body.username,
			password: body.password,
			ipAddress,
			userAgent,
		});

		return this.userMapper.mapCurrentWithToken(user, token);
	}
}
