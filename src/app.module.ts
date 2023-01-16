import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { HttpExceptionFilter } from "@/filters";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";

import { HealthModule } from "@/modules/health";

import { PrismaModule, RedisModule } from "@/providers";
import { AuthModule } from "@/modules/auth/auth.module";
import { UserModule } from "@/modules/users";
import { SessionModule } from "@/modules/sessions";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [() => configuration],
		}),
		HealthModule,
		RedisModule,
		PrismaModule,
		AuthModule,
		UserModule,
		SessionModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
