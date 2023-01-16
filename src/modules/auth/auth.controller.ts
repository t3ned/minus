import {
	LoginBodyDTO,
	LoginBodyDTOType,
	LogoutSessionsBodyDTO,
	LogoutSessionsBodyDTOType,
	SignupBodyDTO,
	SignupBodyDTOType,
} from "./dto";
import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Ip, Post, Req, Version } from "@nestjs/common";
import { SessionService, SessionMapper } from "@/modules/sessions";
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
	) {}

	@Post("signup")
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	signup(
		@Body(SignupBodyDTO()) body: SignupBodyDTOType,
		@Headers("user-agent") userAgent: string,
		@Ip() ipAddress: string,
	) {
		return this.auth.signup({
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
	}

	@Post("login")
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	login(
		@Body(LoginBodyDTO()) body: LoginBodyDTOType,
		@Headers("user-agent") userAgent: string,
		@Ip() ipAddress: string,
	) {
		return this.auth.login({
			username: body.username,
			password: body.password,
			ipAddress,
			userAgent,
		});
	}

	@Post("logout")
	@Version("1")
	@HttpCode(HttpStatus.NO_CONTENT)
	@Auth()
	async logout(@Req() req: Request) {
		const currentSession = req.authenticatedSession;
		await this.auth.logout(currentSession.id);
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

	@Post("sessions/logout")
	@Version("1")
	@HttpCode(HttpStatus.NO_CONTENT)
	@Auth()
	async logoutSessions(
		@Body(LogoutSessionsBodyDTO()) body: LogoutSessionsBodyDTOType,
		@Req() req: Request,
	) {
		const currentUser = req.authenticatedUser;
		const currentSession = req.authenticatedSession;
		await this.auth.logoutSessions(currentUser.id, currentSession.id, body.session_ids);
	}
}
