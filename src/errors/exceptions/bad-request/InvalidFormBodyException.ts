import type { ZodError, ZodIssue } from "zod";
import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";
import { ApiValidationErrorMessage } from "../../ApiValidationErrorMessage";
import handlebars from "handlebars";

const mapZodIssue = (issue: ZodIssue) => {
	const error = ApiValidationErrorMessage[issue.message] ?? ApiValidationErrorMessage[issue.code];
	const message = handlebars.compile(error.message, { noEscape: true })(issue);
	return { ...error, message };
};

export class InvalidFormBodyException extends HttpException {
	/**
	 * @param error The zod error
	 */
	constructor(error: ZodError) {
		super(HttpStatus.BAD_REQUEST, ApiErrorCode.INVALID_FORM_BODY, {
			errors: error.format(mapZodIssue),
		});
	}
}
