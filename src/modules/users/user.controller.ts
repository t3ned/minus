import {
	GetUserByIdParamDTO,
	GetUserByIdParamDTOType,
	GetUserByUsernameParamDTO,
	GetUserByUsernameParamDTOType,
} from "./dto";
import { Controller, Get, HttpCode, HttpStatus, Param, Req, Version } from "@nestjs/common";
import { UserMapper } from "./user.mapper";
import { Auth } from "@/modules/auth";
import { Request } from "express";
import { UserService } from "./user.service";
import { SessionService } from "../sessions";
import { SessionMapper } from "../sessions/session.mapper";

@Controller("users")
export class UserController {
	/**
	 * @param users The user service
	 * @param userMapper The user mapper
	 * @param sessions The session service
	 * @param sessionMapper The session mapper
	 */
	constructor(
		private users: UserService,
		private userMapper: UserMapper,
		private sessions: SessionService,
		private sessionMapper: SessionMapper,
	) {}

	@Get("@me")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	getCurrentUser(@Req() req: Request) {
		const currentUser = req.authenticatedUser;
		return this.userMapper.mapCurrent(currentUser);
	}

	@Get("@me/sessions")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	async getCurrentUserSessions(@Req() req: Request) {
		const currentUser = req.authenticatedUser;
		const currentSession = req.authenticatedSession;
		const sessions = await this.sessions.findManyForUserId(currentUser.id);
		return this.sessionMapper.mapCurrentAndMany(currentSession, sessions);
	}

	@Get("@:username")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	async getUserByUsername(@Param(GetUserByUsernameParamDTO()) param: GetUserByUsernameParamDTOType) {
		const user = await this.users.findByUsernameOrThrow(param.username);
		return this.userMapper.map(user);
	}

	@Get(":user_id")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	async getUserById(@Param(GetUserByIdParamDTO()) param: GetUserByIdParamDTOType) {
		const user = await this.users.findByIdOrThrow(param.user_id);
		return this.userMapper.map(user);
	}
}
