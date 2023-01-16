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

@Controller("users")
export class UserController {
	/**
	 * @param users The user service
	 * @param mapper The user mapper
	 */
	constructor(private users: UserService, private mapper: UserMapper) {}

	@Get("@me")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	getCurrentUser(@Req() req: Request) {
		const currentUser = req.authenticatedUser;
		return this.mapper.mapCurrent(currentUser);
	}

	@Get("@:username")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	async getUserByUsername(@Param(GetUserByUsernameParamDTO()) param: GetUserByUsernameParamDTOType) {
		const user = await this.users.findByUsernameOrThrow(param.username);
		return this.mapper.map(user);
	}

	@Get(":user_id")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	async getUserById(@Param(GetUserByIdParamDTO()) param: GetUserByIdParamDTOType) {
		const user = await this.users.findByIdOrThrow(param.user_id);
		return this.mapper.map(user);
	}
}
