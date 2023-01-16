export interface Configuration {
	app: {
		name: string;
		url: string;
		port: number;
		environment: string;
		debug: boolean;
		release: string;
		version: string;
		node: string;
		pod: string;
	};

	postgres: {
		host: string;
		port: number;
		username: string;
		password: string;
		db: string;
		url: string;
	};

	redis: {
		host: string;
		port: number;
		password?: string;
		db: number;
	};

	sentry: {
		dsn?: string;
		tracesSampleRate: number;
	};

	security: {
		passwordSaltRounds: number;
	};
}
