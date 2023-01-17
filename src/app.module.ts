import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { HttpExceptionFilter } from "@/filters";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";

import { HealthModule } from "@/modules/health";

import { PrismaModule, RedisModule, SendGridModule } from "@/providers";
import { AuthModule } from "@/modules/auth/auth.module";
import { UserModule } from "@/modules/users";
import { SessionModule } from "@/modules/sessions";
import { AuthGuard } from "./modules/auth/guard";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [() => configuration],
		}),
		HealthModule,
		RedisModule,
		PrismaModule,
		SendGridModule,
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
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
