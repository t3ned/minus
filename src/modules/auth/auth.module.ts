import { AuthService } from "./auth.service";
import { PrismaModule } from "@/providers";
import { Module } from "@nestjs/common";

@Module({
	imports: [PrismaModule],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
