export abstract class HealthCheck {
	/**
	 * Perform the health check
	 */
	abstract run(): Promise<HealthCheck.State>;
}

export namespace HealthCheck {
	export type State = HealthyState | UnhealthyState;
	export type UnhealthyState = DegradedState | CriticalState;

	export enum StateType {
		Healthy,
		Degraded,
		Critical,
	}

	export interface HealthyState {
		type: StateType.Healthy;
	}

	export interface DegradedState {
		type: StateType.Degraded;
		message: string;
	}

	export interface CriticalState {
		type: StateType.Critical;
		message: string;
	}
}
