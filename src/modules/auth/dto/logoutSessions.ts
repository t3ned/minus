import { snowflakeValidator } from "@/validators";
import { ZodValidationPipe } from "@/pipes";
import { z } from "zod";

const logoutSessionsBodySchema = z.object({
	session_ids: snowflakeValidator().array(),
});

export const LogoutSessionsBodyDTO = () => {
	return new ZodValidationPipe(logoutSessionsBodySchema);
};

export type LogoutSessionsBodyDTOType = z.infer<typeof logoutSessionsBodySchema>;
