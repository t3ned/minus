import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class UserNotFoundException extends HttpException {
	constructor() {
		super(HttpStatus.NOT_FOUND, ApiErrorCode.USER_NOT_FOUND);
	}
}
