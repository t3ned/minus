import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class BadRequestException extends HttpException {
	constructor() {
		super(HttpStatus.BAD_REQUEST, ApiErrorCode.BAD_REQUEST);
	}
}
