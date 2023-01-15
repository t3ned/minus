import { SessionService } from "./session.service";
import { PrismaModule } from "@/providers";
import { Module } from "@nestjs/common";

@Module({
	imports: [PrismaModule],
	providers: [SessionService],
	exports: [SessionService],
})
export class SessionModule {}
