import { SessionModule } from "@/modules/sessions";
import { AuthController } from "./auth.controller";
import { UserModule } from "@/modules/users";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AuthGuard } from "./guard";

@Module({
	imports: [ConfigModule, UserModule, SessionModule],
	controllers: [AuthController],
	providers: [AuthService, AuthGuard],
	exports: [AuthService, AuthGuard],
})
export class AuthModule {}
