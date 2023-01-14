import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService
	extends PrismaClient<PrismaClientOptions>
	implements OnModuleInit, OnModuleDestroy
{
	/**
	 * The logger for this service
	 */
	public logger = new Logger(PrismaService.name);

	/**
	 * @param config The config service
	 */
	constructor(config: ConfigService) {
		super({
			datasources: {
				db: {
					url: config.getOrThrow("postgres.url"),
				},
			},
			errorFormat: "pretty",
			log: [
				{ level: "error", emit: "event" },
				{ level: "warn", emit: "event" },
				{ level: "info", emit: "event" },
				{ level: "query", emit: "event" },
			],
		});
	}

	/**
	 * Initialize the module
	 */
	async onModuleInit() {
		this.$on("error", (info) => {
			this.logger.error(info.message, info);
		});

		this.$on("warn", (info) => {
			this.logger.warn(info.message, info);
		});

		this.$on("info", (info) => {
			this.logger.log(info.message);
		});

		this.$on("query", (info) => {
			this.logger.log(`${info.query} -> ${info.params.replace(/,/g, ", ")} -> ${info.duration}ms`);
		});

		await this.$connect();
	}

	/**
	 * Destroy the module
	 */
	async onModuleDestroy() {
		await this.$disconnect();
	}
}

interface PrismaClientOptions extends Prisma.PrismaClientOptions {
	log: [
		{ level: "error"; emit: "event" },
		{ level: "warn"; emit: "event" },
		{ level: "info"; emit: "event" },
		{ level: "query"; emit: "event" },
	];
}
