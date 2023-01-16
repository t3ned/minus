import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Ip, Post, Req, Version } from "@nestjs/common";
import { LoginBodyDTO, LoginBodyDTOType, SignupBodyDTO, SignupBodyDTOType } from "./dto";
import { SessionService, SessionMapper } from "@/modules/sessions";
import { UserMapper } from "@/modules/users";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { Auth } from "./guard";

@Controller("auth")
export class AuthController {
	/**
	 * @param auth The auth service
	 * @param sessions The session service
	 * @param sessionMapper The session mapper
	 * @param userMapper The user mapper
	 */
	constructor(
		private auth: AuthService,
		private sessions: SessionService,
		private sessionMapper: SessionMapper,
		private userMapper: UserMapper,
	) {}

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

	@Get("sessions")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	@Auth()
	async getSessions(@Req() req: Request) {
		const currentUser = req.authenticatedUser;
		const currentSession = req.authenticatedSession;
		const sessions = await this.sessions.findManyForUserId(currentUser.id);
		return this.sessionMapper.mapCurrentAndMany(currentSession, sessions);
	}
}
