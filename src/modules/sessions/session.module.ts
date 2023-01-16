import { SessionService } from "./session.service";
import { SessionMapper } from "./session.mapper";
import { PrismaModule } from "@/providers";
import { Module } from "@nestjs/common";

@Module({
	imports: [PrismaModule],
	providers: [SessionService, SessionMapper],
	exports: [SessionService, SessionMapper],
})
export class SessionModule {}
