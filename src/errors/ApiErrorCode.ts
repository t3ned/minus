export enum ApiErrorCode {
	// Bad Request
	BAD_REQUEST = 400_00,
	INVALID_FORM_BODY,

	// Unauthorized
	UNAUTHORIZED = 401_00,

	// Forbidden
	FORBIDDEN = 403_00,

	// Not Found
	NOT_FOUND = 404_00,
	ROUTE_NOT_FOUND,

	// Too Many Requests
	TOO_MANY_REQUESTS = 429_00,

	// Internal Server Error
	INTERNAL_SERVER_ERROR = 500_00,
	APPLICATION_NOT_READY,
	APPLICATION_NOT_HEALTHY,
}
