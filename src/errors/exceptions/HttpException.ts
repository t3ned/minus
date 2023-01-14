import { HttpException as NestHttpException, HttpStatus } from "@nestjs/common";
import { ApiErrorMessage } from "../ApiErrorMessage";
import { ApiErrorCode } from "../ApiErrorCode";

export class HttpException extends NestHttpException {
	/**
	 * @param status The http status
	 * @param code The internal API error code
	 * @param metadata The error metadata
	 */
	constructor(status: HttpStatus, code: ApiErrorCode, metadata?: Record<PropertyKey, unknown>) {
		super(
			{
				code,
				message: ApiErrorMessage[code],
				...metadata,
			},
			status,
		);
	}
}
