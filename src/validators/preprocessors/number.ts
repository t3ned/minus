import { z, ZodTypeAny } from "zod";

const numberRegex = /^-?\d+$/;

export const preprocessNumber = <T extends ZodTypeAny>(schema: T) =>
	z.preprocess((arg) => {
		if (typeof arg === "number") return arg;
		return typeof arg === "string" && numberRegex.test(arg) ? Number(arg) : arg;
	}, schema);
