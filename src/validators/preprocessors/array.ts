import { z, ZodTypeAny } from "zod";

const splitCommaRegex = /,\s*/g;

export const preprocessArray = <T extends ZodTypeAny>(schema: T, splitComma = true) =>
	z.preprocess((arg) => {
		if (Array.isArray(arg)) return arg;
		if (typeof arg !== "string" || !splitComma) return [arg];
		return arg.split(splitCommaRegex);
	}, schema);
