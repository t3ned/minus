import { SessionModule } from "@/modules/sessions";
import { UserModule } from "@/modules/users";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AuthGuard } from "./guard";

@Module({
	imports: [ConfigModule, UserModule, SessionModule],
	providers: [AuthService],
	providers: [AuthService, AuthGuard],
	exports: [AuthService, AuthGuard],
})
export class AuthModule {}
