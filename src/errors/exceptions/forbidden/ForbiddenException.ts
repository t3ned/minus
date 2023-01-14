import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class ForbiddenException extends HttpException {
	constructor() {
		super(HttpStatus.FORBIDDEN, ApiErrorCode.FORBIDDEN);
	}
}
