import type { Configuration } from "./configuration.interface";
import { config } from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import * as env from "@t3ned/env";
dotenvExpand.expand(config());

const configuration: Configuration = {
	app: {
		name: env.str("APP_NAME", "MINUS_API"),
		url: env.str("APP_URL", "http://localhost:5000"),
		port: env.int("APP_PORT", 5000),
		environment: env.str("APP_ENV", "local"),
		debug: env.bool("APP_DEBUG", true),
		release: env.str("APP_BUILD_SHA", "local"),
		version: env.str("APP_VERSION", "local"),
		node: env.str("APP_NODE", "local"),
		pod: env.str("APP_POD", "local"),
	},

	postgres: {
		host: env.str("POSTGRES_HOST"),
		port: env.int("POSTGRES_PORT"),
		username: env.str("POSTGRES_USERNAME"),
		password: env.str("POSTGRES_PASSWORD"),
		db: env.str("POSTGRES_DATABASE"),
		url: env.str("POSTGRES_URL"),
	},

	redis: {
		host: env.str("REDIS_HOST", "localhost"),
		port: env.int("REDIS_PORT", 6379),
		password: env.string("REDIS_PASSWORD", "") || undefined,
		db: env.int("REDIS_DATABASE", 0),
	},

	sentry: {
		dsn: env.str("SENTRY_DSN", "") || undefined,
		tracesSampleRate: env.num("SENTRY_TRACES_SAMPLE_RATE", 1.0),
	},
};

export default configuration;
