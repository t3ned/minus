import { UserService } from "@/modules/users";
import { ZodValidationPipe } from "@/pipes";
import { z } from "zod";

const updateCurrentUserBodySchema = z.object({
	email: z.string().email().max(255).optional(),
	display_name: z.string().min(3).max(15).optional(),
	username: z.string().min(3).max(15).optional(),
	first_name: z.string().min(1).max(255).optional(),
	last_name: z.string().min(1).max(255).optional(),
	country_code: z.string().length(2).optional(),
	language_code: z.string().length(2).optional(),
	gender: z.nativeEnum(UserService.Gender).optional(),
});

export const UpdateCurrentUserBodyDTO = () => {
	return new ZodValidationPipe(updateCurrentUserBodySchema);
};

export type UpdateCurrentUserBodyDTOType = z.infer<typeof updateCurrentUserBodySchema>;
