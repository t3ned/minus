import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class SignupEmailConflictException extends HttpException {
	constructor() {
		super(HttpStatus.CONFLICT, ApiErrorCode.SIGNUP_EMAIL_CONFLICT);
	}
}
