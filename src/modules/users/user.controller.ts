import {
	GetUserByIdParamDTO,
	GetUserByIdParamDTOType,
	GetUserByUsernameParamDTO,
	GetUserByUsernameParamDTOType,
	SearchUserByUsernameQueryDTO,
	SearchUserByUsernameQueryDTOType,
	UpdateCurrentUserBodyDTO,
	UpdateCurrentUserBodyDTOType,
} from "./dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Query,
	Req,
	Version,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserMapper } from "./user.mapper";
import { Auth } from "@/modules/auth";
import { Request } from "express";

@Controller("users")
export class UserController {
	/**
	 * @param users The user service
	 * @param userMapper The user mapper
	 */
	constructor(private users: UserService, private userMapper: UserMapper) {}

	@Get("@me")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	getCurrentUser(@Req() req: Request) {
		const currentUser = req.authenticatedUser;
		return this.userMapper.mapCurrent(currentUser);
	}

	@Patch("@me")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	async updateCurrentUser(
		@Body(UpdateCurrentUserBodyDTO()) body: UpdateCurrentUserBodyDTOType,
		@Req() req: Request,
	) {
		const currentUser = req.authenticatedUser;
		const user = await this.users.update(currentUser, {
			email: body.email,
			displayName: body.display_name,
			username: body.username,
			firstName: body.first_name,
			lastName: body.last_name,
			countryCode: body.country_code,
			languageCode: body.language_code,
			gender: body.gender,
		});

		return this.userMapper.mapCurrent(user);
	}

	@Get("search")
	@HttpCode(HttpStatus.OK)
	@Version("1")
	@Auth()
	async searchByUsername(@Query(SearchUserByUsernameQueryDTO()) query: SearchUserByUsernameQueryDTOType) {
		const users = await this.users.searchByUsername(query.username, {
			limit: query.limit,
		});

		return this.userMapper.mapMany(users);
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
