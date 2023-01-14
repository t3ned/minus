import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Response } from "express";
import { Observable } from "rxjs";
import { hostname } from "os";

@Injectable()
export class ForwardedByHeaderInterceptor implements NestInterceptor {
	/**
	 * Intercept the response
	 * @param context The execution context
	 * @param next The call handler
	 */
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const response = context.switchToHttp()?.getResponse<Response>();
		response.header("X-Forwarded-By", hostname());
		return next.handle();
	}
}
