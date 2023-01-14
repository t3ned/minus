import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";

const isDebug = process.env.APP_DEBUG === "true";

const getTraceFromError = (error: unknown) => {
	return isDebug && error instanceof Error ? error.stack ?? error.message ?? null : undefined;
};

const getTraceCauseFromError = (error: unknown) => {
	return error instanceof Error ? getTraceFromError(error.cause) : null;
};

export class InternalServerErrorException extends HttpException {
	constructor(error: unknown) {
		super(HttpStatus.INTERNAL_SERVER_ERROR, ApiErrorCode.INTERNAL_SERVER_ERROR, {
			trace: getTraceFromError(error),
			cause: getTraceCauseFromError(error),
		});
	}
}
