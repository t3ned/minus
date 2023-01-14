import {
	HttpException,
	NotFoundException,
	ExceptionFilter,
	ArgumentsHost,
	Logger,
	Catch,
} from "@nestjs/common";

import type { Response } from "express";
import { RouteNotFoundException, InternalServerErrorException } from "@/errors";
import * as Sentry from "@sentry/node";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	/**
	 * Catch http exceptions
	 * @param exception The exception
	 * @param host The arguments host
	 */
	catch(exception: unknown, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();

		if (exception instanceof NotFoundException) {
			return this.catch(new RouteNotFoundException(), host);
		}

		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			return response.status(status).send(exception.getResponse());
		}

		Sentry.captureException(exception);
		Logger.error(exception);

		return this.catch(new InternalServerErrorException(exception), host);
	}
}
