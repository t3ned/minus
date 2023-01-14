import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class UnauthorizedException extends HttpException {
	constructor() {
		super(HttpStatus.UNAUTHORIZED, ApiErrorCode.UNAUTHORIZED);
	}
}
