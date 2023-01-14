import { HttpStatus } from "@nestjs/common";
import { HttpException } from "../HttpException";
import { ApiErrorCode } from "../../ApiErrorCode";
import { HealthCheck } from "@/modules/health";

export class ApplicationNotHealthyException extends HttpException {
	/**
	 * @param states The unhealthy states
	 */
	constructor(states: HealthCheck.UnhealthyState[]) {
		super(HttpStatus.INTERNAL_SERVER_ERROR, ApiErrorCode.APPLICATION_NOT_HEALTHY, {
			states,
		});
	}
}
