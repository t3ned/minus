import { SendGridSevice } from "./sendgrid.service";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
	imports: [ConfigModule],
	providers: [SendGridSevice],
	exports: [SendGridModule],
})
export class SendGridModule {}
