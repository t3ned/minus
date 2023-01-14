import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class ApplicationNotReadyException extends HttpException {
	constructor() {
		super(HttpStatus.INTERNAL_SERVER_ERROR, ApiErrorCode.APPLICATION_NOT_READY);
	}
}
