import { ZodValidationPipe } from "@/pipes";
import { z } from "zod";

const loginBodySchema = z.object({
	username: z.string().min(3).max(255),
	password: z.string().min(8).max(255),
});

export const LoginBodyDTO = () => {
	return new ZodValidationPipe(loginBodySchema);
};

export type LoginBodyDTOType = z.infer<typeof loginBodySchema>;
