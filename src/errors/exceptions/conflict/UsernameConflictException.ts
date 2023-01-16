import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class UsernameConflictException extends HttpException {
	constructor() {
		super(HttpStatus.CONFLICT, ApiErrorCode.USERNAME_CONFLICT);
	}
}
