import { UserService } from "@/modules/users";
import { ZodValidationPipe } from "@/pipes";
import { z } from "zod";

const signupBodySchema = z.object({
	email: z.string().email().max(255),
	username: z.string().min(3).max(15),
	first_name: z.string().min(1).max(255),
	last_name: z.string().min(1).max(255),
	password: z.string().min(8).max(255),
	country_code: z.string().length(2),
	language_code: z.string().length(2),
	gender: z.nativeEnum(UserService.Gender),
});

export const SignupBodyDTO = () => {
	return new ZodValidationPipe(signupBodySchema);
};

export type SignupBodyDTOType = z.infer<typeof signupBodySchema>;
