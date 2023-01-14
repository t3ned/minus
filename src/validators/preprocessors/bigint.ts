import { z, ZodTypeAny } from "zod";

const bigintRegex = /^-?\d+$/;

export const preprocessBigint = <T extends ZodTypeAny>(schema: T) =>
	z.preprocess((arg) => {
		if (typeof arg === "bigint") return arg;
		if (typeof arg === "number") return BigInt(arg);
		return typeof arg === "string" && bigintRegex.test(arg) ? BigInt(arg) : arg;
	}, schema);
