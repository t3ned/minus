import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { HttpExceptionFilter } from "@/filters";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "@/modules/health";
import configuration from "./config/configuration";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [() => configuration],
		}),
		HealthModule,
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
