import { ZodValidationPipe } from "@/pipes";
import { z } from "zod";

const getUserByUsernameParamSchema = z.object({
	username: z.string().min(3).max(15),
});

export const GetUserByUsernameParamDTO = () => {
	return new ZodValidationPipe(getUserByUsernameParamSchema);
};

export type GetUserByUsernameParamDTOType = z.infer<typeof getUserByUsernameParamSchema>;
