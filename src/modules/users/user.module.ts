import { UserService } from "./user.service";
import { PrismaModule } from "@/providers";
import { Module } from "@nestjs/common";

@Module({
	imports: [PrismaModule],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
