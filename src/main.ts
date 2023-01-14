import "module-alias/register";
import config from "./config/configuration";
import { ForwardedByHeaderInterceptor } from "@/interceptors";
import { HttpStatus, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as Sentry from "@sentry/node";
import "@sentry/tracing";

Sentry.init({
	dsn: config.sentry.dsn,
	tracesSampleRate: config.sentry.tracesSampleRate,
	environment: config.app.environment,
});

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule);
	const adapter = app.getHttpAdapter().getInstance();

	adapter.set("etag", false);
	adapter.set("x-powered-by", false);

	app.enableCors({
		origin: "*",
		credentials: true,
		optionsSuccessStatus: HttpStatus.NO_CONTENT,
	});

	app.enableVersioning({
		type: VersioningType.URI,
		prefix: "v",
	});

	app.useGlobalInterceptors(new ForwardedByHeaderInterceptor());

	await app.listen(config.app.port);
};

bootstrap();
