import { ApiErrorCode } from "./ApiErrorCode";

export const ApiErrorMessage: Record<ApiErrorCode, string> = {
	// Bad Request
	[ApiErrorCode.BAD_REQUEST]: "Bad Request",
	[ApiErrorCode.INVALID_FORM_BODY]: "Invalid Form Body",

	// Unauthorized
	[ApiErrorCode.UNAUTHORIZED]: "Unauthorized",

	// Forbidden
	[ApiErrorCode.FORBIDDEN]: "Forbidden",

	// Not Found
	[ApiErrorCode.NOT_FOUND]: "Not Found",
	[ApiErrorCode.ROUTE_NOT_FOUND]: "Unknown Route",

	// Too Many Requests
	[ApiErrorCode.TOO_MANY_REQUESTS]: "Too Many Requests",

	// Internal Server Error
	[ApiErrorCode.INTERNAL_SERVER_ERROR]: "Internal Server Error",
	[ApiErrorCode.APPLICATION_NOT_READY]: "Application Not Ready",
	[ApiErrorCode.APPLICATION_NOT_HEALTHY]: "Health Checks Failed",
};
