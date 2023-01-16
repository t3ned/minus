import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class InvalidCredentialsException extends HttpException {
	constructor() {
		super(HttpStatus.UNAUTHORIZED, ApiErrorCode.INVALID_CREDENTIALS);
	}
}
