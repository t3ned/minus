import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class EmailConflictException extends HttpException {
	constructor() {
		super(HttpStatus.CONFLICT, ApiErrorCode.EMAIL_CONFLICT);
	}
}
