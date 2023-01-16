import { UserController } from "./user.controller";
import { SessionModule } from "@/modules/sessions";
import { UserService } from "./user.service";
import { PrismaModule } from "@/providers";
import { UserMapper } from "./user.mapper";
import { Module } from "@nestjs/common";

@Module({
	imports: [PrismaModule, SessionModule],
	controllers: [UserController],
	providers: [UserService, UserMapper],
	exports: [UserService, UserMapper],
})
export class UserModule {}
