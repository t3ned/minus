import { preprocessNumber } from "@/validators";
import { ZodValidationPipe } from "@/pipes";
import { z } from "zod";

const searchUserByUsernameQuerySchema = z.object({
	username: z.string().min(1).max(15),
	limit: preprocessNumber(z.number().int().min(1).max(20).default(5)),
});

export const SearchUserByUsernameQueryDTO = () => {
	return new ZodValidationPipe(searchUserByUsernameQuerySchema);
};

export type SearchUserByUsernameQueryDTOType = z.infer<typeof searchUserByUsernameQuerySchema>;
