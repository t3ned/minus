import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class ConflictException extends HttpException {
	constructor() {
		super(HttpStatus.CONFLICT, ApiErrorCode.CONFLICT);
	}
}
