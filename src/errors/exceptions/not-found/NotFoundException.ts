import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class NotFoundException extends HttpException {
	constructor() {
		super(HttpStatus.NOT_FOUND, ApiErrorCode.NOT_FOUND);
	}
}
