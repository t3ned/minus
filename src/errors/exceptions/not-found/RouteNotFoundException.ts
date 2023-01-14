import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

export class RouteNotFoundException extends HttpException {
	constructor() {
		super(HttpStatus.NOT_FOUND, ApiErrorCode.ROUTE_NOT_FOUND);
	}
}
