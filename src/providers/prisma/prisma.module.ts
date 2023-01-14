import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
	imports: [ConfigModule],
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
