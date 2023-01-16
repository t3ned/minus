import { ZodValidationPipe } from "@/pipes";
import { snowflakeValidator } from "@/validators";
import { z } from "zod";

const getUserByIdParamSchema = z.object({
	user_id: snowflakeValidator(),
});

export const GetUserByIdParamDTO = () => {
	return new ZodValidationPipe(getUserByIdParamSchema);
};

export type GetUserByIdParamDTOType = z.infer<typeof getUserByIdParamSchema>;
