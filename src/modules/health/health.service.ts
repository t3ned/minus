import { ApplicationNotReadyException, ApplicationNotHealthyException } from "../../errors";
import { ConfigService } from "@nestjs/config";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { HealthCheck } from "./health-check";

@Injectable()
export class HealthService implements OnApplicationBootstrap {
	/**
	 * Whether the application is ready
	 */
	private isReady = false;

	/**
	 * The health checks
	 */
	private checks: HealthCheck[] = [];

	/**
	 * @param config The config service
	 */
	constructor(private config: ConfigService) {}

	/**
	 * Set the application as ready once it's finished starting up
	 */
	onApplicationBootstrap(): void {
		this.setReady();
	}

	/**
	 * Set the application as ready
	 */
	setReady(): void {
		this.isReady = true;
	}

	/**
	 * Get whether the application is ready
	 *
	 * @returns Whether the application is ready
	 */
	getReady(): void {
		if (!this.isReady) {
			throw new ApplicationNotReadyException();
		}
	}

	/**
	 * Add an additional health check
	 * @param check The check to add
	 *
	 * @returns The health service
	 */
	addCheck(check: HealthCheck): this {
		this.checks.push(check);
		return this;
	}

	/**
	 * Get the status of the app
	 *
	 * @returns The status
	 */
	async getStatus(): Promise<HealthService.Status> {
		if (!this.isReady) {
			throw new ApplicationNotReadyException();
		}

		const unhealthyChecks = await this.runChecks();
		if (unhealthyChecks.length) {
			throw new ApplicationNotHealthyException(unhealthyChecks);
		}

		return {
			node: this.config.getOrThrow<string>("app.node"),
			pod: this.config.getOrThrow<string>("app.pod"),
			name: this.config.getOrThrow<string>("app.name"),
			version: this.config.getOrThrow<string>("app.version"),
			release: this.config.getOrThrow<string>("app.release"),
			url: this.config.getOrThrow<string>("app.url"),
			environment: this.config.getOrThrow<string>("app.environment"),
			debug: this.config.getOrThrow<boolean>("app.debug"),
			server_time: new Date().toISOString(),
		};
	}

	/**
	 * Runs the additional healths checks
	 *
	 * @returns The unhealthy check states
	 */
	private async runChecks(): Promise<HealthCheck.UnhealthyState[]> {
		const states = await Promise.all(this.checks.map((check) => check.run()));
		const isErrorState = (state: HealthCheck.State) => state.type !== HealthCheck.StateType.Healthy;
		return states.filter(isErrorState) as HealthCheck.UnhealthyState[];
	}
}

export namespace HealthService {
	export interface Status {
		node: string;
		pod: string;
		name: string;
		version: string;
		release: string;
		url: string;
		environment: string;
		debug: boolean;
		server_time: string;
	}
}
