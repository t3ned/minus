import { Controller, Get, HttpCode, HttpStatus, Req, Version } from "@nestjs/common";
import { UserMapper } from "./user.mapper";
import { Auth } from "@/modules/auth";
import { Request } from "express";

@Controller("users")
export class UserController {
	/**
	 * @param mapper The user mapper
	 */
	constructor(private mapper: UserMapper) {}

	@Get("@me")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	getCurrentUser(@Req() req: Request) {
		const currentUser = req.authenticatedUser;
		return this.mapper.mapCurrent(currentUser);
	}
}
