import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class TooManyRequestsException extends HttpException {
	constructor() {
		super(HttpStatus.TOO_MANY_REQUESTS, ApiErrorCode.TOO_MANY_REQUESTS);
	}
}
