import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { parseJSON, stringifyJSON } from "../../utils";
import { ConfigService } from "@nestjs/config";
import * as Sentry from "@sentry/node";
import Redis from "ioredis";

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
	/**
	 * The logger for this service
	 */
	public logger = new Logger(RedisService.name);

	/**
	 * @param config The config service
	 */
	constructor(config: ConfigService) {
		super({
			host: config.getOrThrow("redis.host"),
			port: config.getOrThrow("redis.port"),
			db: config.getOrThrow("redis.db"),
			password: config.get("redis.password"),
			keyPrefix: `${config.get("app.name")}:${config.get("app.environment")}:`,
			lazyConnect: true,
		});
	}

	/**
	 * Initialize the module
	 */
	async onModuleInit() {
		this.on("connect", () => {
			this.logger.log("Connected to redis");
		});

		this.on("error", (error) => {
			this.logger.error(error);
			Sentry.captureException(error);
		});

		await this.connect();
	}

	/**
	 * Destroy the module
	 */
	async onModuleDestroy() {
		this.disconnect(false);
	}

	/**
	 * Get a JSON data
	 * @param key The cache key
	 *
	 * @returns The JSON data
	 */
	async getJSON<T extends object>(key: string): Promise<T | null> {
		const result = await this.get(key);
		return result ? parseJSON<T>(result) : null;
	}

	/**
	 * Set JSON data
	 * @param key The cache key
	 * @param data The JSON data
	 * @param ttl The key expiry in ms
	 *
	 * @returns The JSON data
	 */
	async setJSON<T extends object>(key: string, data: T, ttl: number): Promise<T> {
		await this.set(key, stringifyJSON(data), "PX", ttl);
		return data;
	}
}
