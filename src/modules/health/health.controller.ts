import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
	/**
	 * @param health The health service
	 */
	constructor(private health: HealthService) {}

	@Get("ready")
	@HttpCode(HttpStatus.NO_CONTENT)
	getReady() {
		return this.health.getReady();
	}

	@Get("status")
	@HttpCode(HttpStatus.OK)
	getStatus() {
		return this.health.getStatus();
	}
}
